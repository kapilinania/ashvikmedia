/* ==========================================================================
   ASHVIK MEDIA - DEDICATED LANDING PAGE JAVASCRIPT
   Features: 
   - Zero-Latency Instant Background Queue (0s User Wait)
   - Confetti Celebration Particle Trigger
   - Custom Glowing Gold Cursor
   - Mobile Drawer Navigation
   - Number Counter Animation
   - LocalStorage Persistent Retry Queue + Keepalive Background Dispatch
   ========================================================================== */

/**
 * 🔗 GOOGLE APPS SCRIPT WEB APP URL
 */
const GOOGLE_SHEET_APP_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwCu3hfKlrKoRXbZphiWLs7yhQPtnlQSayJcPZ4CSux1jUN6-LFiNhLHnZosG_S_tfX0A/exec';

// ==========================================================================
// 🚀 ZERO-LATENCY BACKGROUND QUEUE ENGINE (Non-Blocking Data Pipeline)
// ==========================================================================
class LeadQueueEngine {
  constructor(endpointUrl) {
    this.endpoint = endpointUrl;
    this.storageKey = 'ashvik_pending_leads_queue';
    this.isProcessing = false;
    // Process any previously stored offline leads on load
    setTimeout(() => this.processQueue(), 1000);
  }

  // Instant non-blocking enqueue
  enqueue(leadData) {
    const queue = this.getQueue();
    const queueItem = {
      id: 'lead_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
      data: leadData,
      timestamp: new Date().toISOString(),
      retries: 0
    };

    queue.push(queueItem);
    this.saveQueue(queue);

    // Trigger background send immediately
    this.processQueue();
    return queueItem.id;
  }

  getQueue() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  }

  saveQueue(queue) {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(queue));
    } catch (e) {
      console.warn('LocalStorage queue save error:', e);
    }
  }

  async processQueue() {
    if (this.isProcessing) return;
    const queue = this.getQueue();
    if (!queue || queue.length === 0) return;

    this.isProcessing = true;

    while (queue.length > 0) {
      const currentItem = queue[0];

      try {
        const formData = new FormData();
        formData.append('name', currentItem.data.name || '');
        formData.append('email', currentItem.data.email || '');
        formData.append('phone', currentItem.data.phone || '');
        formData.append('service', currentItem.data.service || '');
        formData.append('source', currentItem.data.source || 'Landing Page');
        formData.append('submissionId', currentItem.id);

        // Uses keepalive: true so data transmission finishes even if tab closes
        await fetch(this.endpoint, {
          method: 'POST',
          mode: 'no-cors',
          keepalive: true,
          body: formData
        });

        // Item sent successfully -> remove from queue
        queue.shift();
        this.saveQueue(queue);

      } catch (err) {
        console.warn('Background sync retry scheduled:', err);
        currentItem.retries = (currentItem.retries || 0) + 1;
        if (currentItem.retries > 5) {
          queue.shift(); // Drop after 5 failed retries to avoid blocking
        }
        this.saveQueue(queue);
        break; // Pause and retry next time
      }
    }

    this.isProcessing = false;
  }
}

// Initialize Queue Engine
const leadQueue = new LeadQueueEngine(GOOGLE_SHEET_APP_SCRIPT_URL);

// Global Mobile Drawer Handlers
window.openMobileNav = function(e) {
  if (e && e.preventDefault) e.preventDefault();
  const drawer = document.querySelector('.mobile-drawer');
  const overlay = document.querySelector('.mobile-drawer-overlay');
  if (drawer && overlay) {
    drawer.classList.add('active');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
};

window.closeMobileNav = function(e) {
  const drawer = document.querySelector('.mobile-drawer');
  const overlay = document.querySelector('.mobile-drawer-overlay');
  if (drawer && overlay) {
    drawer.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }
};

document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Drawer Navigation
  const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
  const mobileDrawerClose = document.querySelector('.mobile-drawer-close');
  const mobileDrawerOverlay = document.querySelector('.mobile-drawer-overlay');

  if (mobileNavToggle) {
    mobileNavToggle.addEventListener('click', window.openMobileNav);
  }
  if (mobileDrawerClose) {
    mobileDrawerClose.addEventListener('click', window.closeMobileNav);
  }
  if (mobileDrawerOverlay) {
    mobileDrawerOverlay.addEventListener('click', window.closeMobileNav);
  }

  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
  mobileNavLinks.forEach(link => {
    link.addEventListener('click', window.closeMobileNav);
  });

  // 2. Navbar Sticky Scroll Effect
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }
  });

  // 3. Custom Glowing Gold Cursor
  const cursorDot = document.querySelector('.custom-cursor-dot');
  const cursorRing = document.querySelector('.custom-cursor-ring');

  if (cursorDot && cursorRing && window.innerWidth > 992) {
    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorDot.style.left = `${mouseX}px`;
      cursorDot.style.top = `${mouseY}px`;
    });

    function renderRing() {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      cursorRing.style.left = `${ringX}px`;
      cursorRing.style.top = `${ringY}px`;
      requestAnimationFrame(renderRing);
    }
    requestAnimationFrame(renderRing);

    const hoverElements = document.querySelectorAll('a, button, input, select, .stat-card, .pill-badge, .feature-pill-item, .tag-badge');
    hoverElements.forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });
  }

  // 4. Interactive Animated Number Counters
  const counterElements = document.querySelectorAll('.counter-val');
  let countersAnimated = false;

  function animateCounters() {
    counterElements.forEach(counter => {
      const target = parseInt(counter.getAttribute('data-target'), 10);
      const suffix = counter.getAttribute('data-suffix') || '';
      const duration = 1800;
      const startTime = performance.now();

      function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const currentCount = Math.floor(easeOut * target);

        counter.innerText = `${currentCount}${suffix}`;

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        } else {
          counter.innerText = `${target}${suffix}`;
        }
      }

      requestAnimationFrame(updateCounter);
    });
  }

  // Observe Stats Section
  const statsSection = document.querySelector('.landing-stats-section');
  if (statsSection && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !countersAnimated) {
          countersAnimated = true;
          animateCounters();
        }
      });
    }, { threshold: 0.25 });

    observer.observe(statsSection);
  } else {
    animateCounters();
  }

  // 5. Toast Notification Function
  const toastNotification = document.getElementById('toastNotification');
  function showToast(message, isSuccess = true) {
    if (!toastNotification) return;
    const toastText = toastNotification.querySelector('.toast-text');
    const toastIcon = toastNotification.querySelector('.toast-icon i');
    
    if (toastText) toastText.textContent = message;
    if (toastIcon) {
      toastIcon.className = isSuccess ? 'fa-solid fa-circle-check' : 'fa-solid fa-triangle-exclamation';
    }

    toastNotification.classList.add('show');
    setTimeout(() => {
      toastNotification.classList.remove('show');
    }, 5000);
  }

  // 6. Confetti Particle Explosion
  function triggerCelebrationConfetti() {
    if (typeof confetti === 'function') {
      confetti({
        particleCount: 75,
        spread: 65,
        origin: { y: 0.65 },
        colors: ['#FFC700', '#FFE57F', '#FFFFFF', '#0A0C10']
      });
    }
  }

  // 7. ZERO-LATENCY INSTANT FORM SUBMISSION (0ms UI Response)
  const projectForm = document.getElementById('projectLeadForm');
  const submitBtn = projectForm?.querySelector('.form-submit-btn');

  if (projectForm && submitBtn) {
    projectForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('userName')?.value.trim();
      const email = document.getElementById('userEmail')?.value.trim();
      const phone = document.getElementById('userPhone')?.value.trim();
      const service = document.getElementById('userService')?.value;

      if (!name || !email || !phone || !service || service === '') {
        alert('Please fill out all required fields.');
        return;
      }

      // ⚡ STEP 1: INSTANT NON-BLOCKING UI FEEDBACK (0ms)
      triggerCelebrationConfetti();
      showToast(`🎉 Thank you, ${name}! Your inquiry has been received instantly.`);

      // Instant button success animation
      const originalBtnHTML = submitBtn.innerHTML;
      submitBtn.innerHTML = `
        <span class="btn-icon-plane" style="background: #10B981; color: #FFFFFF;"><i class="fa-solid fa-check"></i></span>
        <span>Received!</span>
      `;
      submitBtn.style.background = '#0F172A';

      setTimeout(() => {
        submitBtn.innerHTML = originalBtnHTML;
        submitBtn.style.background = '';
      }, 2500);

      // ⚡ STEP 2: DISPATCH TO BACKGROUND QUEUE (Runs silently in background)
      leadQueue.enqueue({
        name: name,
        email: email,
        phone: phone,
        service: service,
        source: 'Landing Page'
      });

      // Clear input fields immediately
      projectForm.reset();

      // ⚡ STEP 3: OPTIONAL WHATSAPP CONNECT (Non-blocking)
      const whatsappMsg = encodeURIComponent(
        `*New Project Lead from Landing Page*\n\n` +
        `👤 *Name:* ${name}\n` +
        `📧 *Email:* ${email}\n` +
        `📱 *Phone:* ${phone}\n` +
        `💼 *Service Interested:* ${service}`
      );

      setTimeout(() => {
        const confirmWhatsapp = confirm('Your project request has been submitted! Would you also like to connect instantly with our team on WhatsApp (+91 99935 15138)?');
        if (confirmWhatsapp) {
          window.open(`https://wa.me/919993515138?text=${whatsappMsg}`, '_blank');
        }
      }, 700);
    });
  }

  // 8. FAQ Accordion Toggle Interaction
  const faqItems = document.querySelectorAll('.faq-card-item');
  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question-btn');
    questionBtn?.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      
      // Close other open FAQs
      faqItems.forEach(other => {
        if (other !== item) other.classList.remove('active');
      });

      // Toggle current
      item.classList.toggle('active', !isActive);
    });
  });

  // 9. Smooth Scroll to Form on CTA Button Click
  const scrollToFormBtns = document.querySelectorAll('.btn-scroll-form');
  scrollToFormBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const formCard = document.getElementById('projectLeadForm');
      if (formCard) {
        formCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
        const nameInput = document.getElementById('userName');
        if (nameInput) {
          setTimeout(() => nameInput.focus(), 600);
        }
      }
    });
  });

  // 10. Newsletter Subscription Form in Footer
  const newsletterForm = document.querySelector('.newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailInput = newsletterForm.querySelector('input[type="email"]');
      if (emailInput && emailInput.value.trim() !== '') {
        triggerCelebrationConfetti();
        showToast('Subscribed successfully to Growth Insights!');
        emailInput.value = '';
      }
    });
  }

  // 11. Back to Top Button
  const backToTopBtn = document.getElementById('backToTopBtn');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
});
