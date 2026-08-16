/* ==========================================================================
   ASHVIK MEDIA - MAIN JAVASCRIPT
   Interactions: Mobile Drawer, Sticky Navbar, FAQ Accordion, Portfolio Slider
   ========================================================================== */

// Global functions for inline onclick fallback
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
  // 1. Mobile Navigation Drawer Toggle
  const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
  const mobileDrawerClose = document.querySelector('.mobile-drawer-close');
  const mobileDrawerOverlay = document.querySelector('.mobile-drawer-overlay');

  if (mobileNavToggle) {
    mobileNavToggle.addEventListener('click', window.openMobileNav);
    mobileNavToggle.addEventListener('touchstart', window.openMobileNav, { passive: false });
  }

  if (mobileDrawerClose) {
    mobileDrawerClose.addEventListener('click', window.closeMobileNav);
  }

  if (mobileDrawerOverlay) {
    mobileDrawerOverlay.addEventListener('click', window.closeMobileNav);
  }

  // Close drawer on clicking mobile nav links & cards
  const mobileNavItems = document.querySelectorAll('.mobile-nav-card, .mobile-nav-link');
  mobileNavItems.forEach(link => {
    link.addEventListener('click', window.closeMobileNav);
  });

  // 2. Navbar Sticky Scroll Effect
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }
  });

  // 3. FAQ Accordion Toggle
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    question?.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      
      // Close other open FAQ items
      faqItems.forEach(otherItem => {
        otherItem.classList.remove('active');
      });

      // Toggle current item
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });

  // 4. Newsletter & Consultation Form Mock Submit
  const newsletterForms = document.querySelectorAll('.newsletter-form, .contact-form-element');
  newsletterForms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('input[type="email"], input[type="text"]');
      if (input && input.value.trim() !== '') {
        alert('Thank you for connecting with Ashvik Media! We will be in touch shortly.');
        input.value = '';
      }
    });
  });

  // 5. Portfolio Filtering (if present on subpages)
  const filterBtns = document.querySelectorAll('.portfolio-filter-btn');
  const portfolioCards = document.querySelectorAll('.portfolio-card-item');

  if (filterBtns.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const filterValue = btn.getAttribute('data-filter');
        
        portfolioCards.forEach(card => {
          if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
            card.style.display = 'block';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  // 6. Portfolio Automatic Infinite Carousel Slider
  const portfolioTrack = document.getElementById('portfolioTrack');
  const portfolioPrev = document.getElementById('portfolioPrev');
  const portfolioNext = document.getElementById('portfolioNext');
  const portfolioDots = document.querySelectorAll('#portfolioDots .dot-item');
  const portfolioCardItems = document.querySelectorAll('#portfolioTrack .portfolio-card-item');

  if (portfolioTrack && portfolioCardItems.length > 0) {
    let currentIndex = 0;
    let autoplayTimer = null;
    const totalCards = portfolioCardItems.length;

    function getCardWidth() {
      return portfolioTrack.clientWidth;
    }

    function scrollToSlide(index) {
      if (index >= totalCards) index = 0;
      if (index < 0) index = totalCards - 1;

      currentIndex = index;
      const scrollPos = currentIndex * getCardWidth();

      portfolioTrack.scrollTo({
        left: scrollPos,
        behavior: 'smooth'
      });

      // Update dots active state
      portfolioDots.forEach((dot, i) => {
        if (i === currentIndex) {
          dot.classList.add('active');
        } else {
          dot.classList.remove('active');
        }
      });
    }

    function startAutoplay() {
      stopAutoplay();
      autoplayTimer = setInterval(() => {
        scrollToSlide(currentIndex + 1);
      }, 3500); // Auto-slide every 3.5 seconds
    }

    function stopAutoplay() {
      if (autoplayTimer) {
        clearInterval(autoplayTimer);
        autoplayTimer = null;
      }
    }

    // Arrow Nav Listeners
    if (portfolioNext) {
      portfolioNext.addEventListener('click', (e) => {
        e.preventDefault();
        scrollToSlide(currentIndex + 1);
        startAutoplay();
      });
    }

    if (portfolioPrev) {
      portfolioPrev.addEventListener('click', (e) => {
        e.preventDefault();
        scrollToSlide(currentIndex - 1);
        startAutoplay();
      });
    }

    // Dot Click Listeners
    portfolioDots.forEach((dot, i) => {
      dot.addEventListener('click', () => {
        scrollToSlide(i);
        startAutoplay();
      });
    });

    // Pause Autoplay on Hover / Touch
    portfolioTrack.addEventListener('mouseenter', stopAutoplay);
    portfolioTrack.addEventListener('mouseleave', startAutoplay);
    portfolioTrack.addEventListener('touchstart', stopAutoplay, { passive: true });
    portfolioTrack.addEventListener('touchend', startAutoplay);

    // Sync current index on manual scroll/swipe
    let isScrolling;
    portfolioTrack.addEventListener('scroll', () => {
      window.clearTimeout(isScrolling);
      isScrolling = setTimeout(() => {
        const cardWidth = getCardWidth();
        const nearestIndex = Math.round(portfolioTrack.scrollLeft / cardWidth);
        if (nearestIndex >= 0 && nearestIndex < totalCards) {
          currentIndex = nearestIndex;
          portfolioDots.forEach((dot, idx) => {
            if (idx === currentIndex) dot.classList.add('active');
            else dot.classList.remove('active');
          });
        }
      }, 100);
    });

    // Initialize Autoplay
    startAutoplay();
  }

    // 7. Proven Performance Interactive Tabs Switcher
    const provenTabs = document.querySelectorAll('.proven-tab-item');
    if (provenTabs.length > 0) {
      provenTabs.forEach(tab => {
        tab.addEventListener('click', () => {
          provenTabs.forEach(t => t.classList.remove('active'));
          tab.classList.add('active');
        });
      });
    }

    // 8. Custom Glowing Gold Cursor Lerp Mouse Follower
    const cursorDot = document.querySelector('.custom-cursor-dot');
    const cursorRing = document.querySelector('.custom-cursor-ring');

    if (cursorDot && cursorRing) {
      let mouseX = -100, mouseY = -100;
      let ringX = -100, ringY = -100;

      document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursorDot.style.left = `${mouseX}px`;
        cursorDot.style.top = `${mouseY}px`;
      });

      function animateCursor() {
        ringX += (mouseX - ringX) * 0.18;
        ringY += (mouseY - ringY) * 0.18;
        cursorRing.style.left = `${ringX}px`;
        cursorRing.style.top = `${ringY}px`;
        requestAnimationFrame(animateCursor);
      }
      animateCursor();

      const hoverables = document.querySelectorAll('a, button, .hero-card, .bento-card, .portfolio-card, .why-floating-badge, .hero-stat-item, .brand-logo-item, .nav-link, .mobile-nav-link, .text-gold');
      hoverables.forEach(el => {
        el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
        el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
      });
    }

    // 9. Intersection Observer Scroll Reveal & Exit Animation System
    const revealElements = document.querySelectorAll('[data-reveal]');

    if (revealElements.length > 0) {
      const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
          } else {
            // Re-trigger animation when scrolling away and back
            entry.target.classList.remove('revealed');
          }
        });
      }, {
        threshold: 0.12,
        rootMargin: "0px 0px -40px 0px"
      });

      revealElements.forEach(el => revealObserver.observe(el));
    }

    // 10. Interactive Back To Top Smooth Scroll
    const backToTopBtn = document.getElementById('backToTopBtn') || document.querySelector('.back-to-top-btn');
    if (backToTopBtn) {
      backToTopBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      });
    }

    // 11. Packages Billing Cycle Switcher (Monthly, Quarterly 15% OFF, Annual 25% OFF)
    const billingBtns = document.querySelectorAll('.billing-switch-btn');
    const priceElements = document.querySelectorAll('.pricing-price-val');

    if (billingBtns.length > 0 && priceElements.length > 0) {
      billingBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          billingBtns.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');

          const cycle = btn.getAttribute('data-cycle'); // 'monthly', 'quarterly', 'annual'

          priceElements.forEach(priceEl => {
            const monthlyPrice = parseInt(priceEl.getAttribute('data-monthly'), 10);
            let finalPrice = monthlyPrice;

            if (cycle === 'quarterly') {
              finalPrice = Math.round(monthlyPrice * 0.85); // 15% OFF
            } else if (cycle === 'annual') {
              finalPrice = Math.round(monthlyPrice * 0.75); // 25% OFF
            }

            priceEl.textContent = `₹${finalPrice.toLocaleString('en-IN')}`;
          });
        });
      });
    }

    // 12. Custom Package Addon Calculator
    const addonItems = document.querySelectorAll('.addon-card-item');
    const selectedListContainer = document.getElementById('builderSelectedList');
    const totalValEl = document.getElementById('builderTotalVal');
    const customProposalBtn = document.getElementById('getCustomProposalBtn');

    if (addonItems.length > 0 && totalValEl) {
      function updateCustomCalculator() {
        let total = 0;
        let count = 0;
        if (selectedListContainer) selectedListContainer.innerHTML = '';

        addonItems.forEach(item => {
          if (item.classList.contains('selected')) {
            count++;
            const name = item.getAttribute('data-name');
            const price = parseInt(item.getAttribute('data-price'), 10);
            total += price;

            if (selectedListContainer) {
              const row = document.createElement('div');
              row.className = 'builder-selected-item';
              row.innerHTML = `<span><i class="fa-solid fa-check text-gold"></i> ${name}</span> <span class="builder-selected-price">+₹${price.toLocaleString('en-IN')}</span>`;
              selectedListContainer.appendChild(row);
            }
          }
        });

        if (count === 0 && selectedListContainer) {
          selectedListContainer.innerHTML = '<p style="font-size:0.85rem; color:#94A3B8;">No add-ons selected yet. Click options on the left to build your package.</p>';
        }

        totalValEl.textContent = `₹${total.toLocaleString('en-IN')}`;

        if (customProposalBtn) {
          const isSub = window.location.pathname.split('/').filter(Boolean).length > 0 && !window.location.pathname.endsWith('index.html');
          const contactBase = isSub ? '../contact/' : 'contact/';
          customProposalBtn.href = `${contactBase}?custom_package=true&total=${total}`;
        }
      }

      addonItems.forEach(item => {
        item.addEventListener('click', (e) => {
          item.classList.toggle('selected');
          const checkbox = item.querySelector('.addon-checkbox');
          if (checkbox) {
            if (item.classList.contains('selected')) {
              checkbox.innerHTML = '<i class="fa-solid fa-check"></i>';
            } else {
              checkbox.innerHTML = '';
            }
          }
          updateCustomCalculator();
        });
      });

      // Initialize
      updateCustomCalculator();
    }

    // 13. Interactive 8-Second Lead Capture Call Back Modal
    function initCallBackModal() {
      if (localStorage.getItem('ashvik_modal_submitted') === 'true') {
        return;
      }
      if (sessionStorage.getItem('ashvik_modal_closed') === 'true') {
        return;
      }

      if (!document.getElementById('callBackModalOverlay')) {
        const modalHTML = `
          <div class="callback-modal-overlay" id="callBackModalOverlay">
            <div class="callback-modal-card">
              <button class="callback-modal-close" id="callBackModalClose" aria-label="Close Modal">
                <i class="fa-solid fa-xmark"></i>
              </button>
              <div class="callback-modal-badge">
                <span class="status-dot-pulse" style="background: #10B981; box-shadow: 0 0 8px #10B981;"></span>
                INSTANT 15-MIN CALLBACK
              </div>
              <h3 class="callback-modal-title">Request a <span class="text-gold">Call Back</span></h3>
              <p class="callback-modal-desc">Enter your details below and one of our senior growth experts will reach out to you shortly.</p>
              <form class="callback-modal-form" id="callBackModalForm">
                <div class="form-group" style="margin-bottom: 1rem;">
                  <div class="input-icon-wrapper">
                    <i class="fa-solid fa-user"></i>
                    <input type="text" class="form-input" id="cbName" placeholder="Your Full Name" required>
                  </div>
                </div>
                <div class="form-group" style="margin-bottom: 1.25rem;">
                  <div class="input-icon-wrapper">
                    <i class="fa-solid fa-phone"></i>
                    <input type="tel" class="form-input" id="cbPhone" placeholder="Your Mobile Number (+91 99935 15138)" required>
                  </div>
                </div>
                <button type="submit" class="btn btn-gold callback-submit-btn" style="width: 100%;">
                  <span>REQUEST CALL BACK</span>
                  <i class="fa-solid fa-phone-volume"></i>
                </button>
              </form>
              <div class="callback-modal-footer">
                <i class="fa-solid fa-lock"></i> 100% Confidential & Free Audit
              </div>
            </div>
          </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHTML);
      }

      const overlay = document.getElementById('callBackModalOverlay');
      const closeBtn = document.getElementById('callBackModalClose');
      const form = document.getElementById('callBackModalForm');

      setTimeout(() => {
        if (localStorage.getItem('ashvik_modal_submitted') !== 'true' && 
            sessionStorage.getItem('ashvik_modal_closed') !== 'true') {
          if (overlay) overlay.classList.add('show');
        }
      }, 8000);

      function closeModal() {
        if (overlay) overlay.classList.remove('show');
        sessionStorage.setItem('ashvik_modal_closed', 'true');
      }

      if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
      }

      if (overlay) {
        overlay.addEventListener('click', (e) => {
          if (e.target === overlay) closeModal();
        });
      }

      if (form) {
        form.addEventListener('submit', (e) => {
          e.preventDefault();
          const rawName = document.getElementById('cbName')?.value || '';
          const rawPhone = document.getElementById('cbPhone')?.value || '';
          const safeName = window.escapeHTML ? window.escapeHTML(rawName.trim()) : rawName.replace(/</g, "&lt;").replace(/>/g, "&gt;");
          const safePhone = window.escapeHTML ? window.escapeHTML(rawPhone.trim()) : rawPhone.replace(/</g, "&lt;").replace(/>/g, "&gt;");

          const modalCard = overlay.querySelector('.callback-modal-card');
          if (modalCard) {
            modalCard.innerHTML = `
              <div style="text-align: center; padding: 1rem 0;">
                <div style="width: 60px; height: 60px; border-radius: 50%; background: var(--primary-gold); color: #0A0C10; display: flex; align-items: center; justify-content: center; font-size: 1.75rem; margin: 0 auto 1.25rem; box-shadow: 0 0 20px rgba(255,199,0,0.4);">
                  <i class="fa-solid fa-check"></i>
                </div>
                <h3 style="font-size: 1.4rem; font-weight: 800; color: #FFFFFF; margin-bottom: 0.5rem;">Request Submitted!</h3>
                <p style="color: #94A3B8; font-size: 0.88rem; line-height: 1.5; margin-bottom: 1.25rem;">Thank you, <strong>${safeName}</strong>. Our growth team will call you shortly on <strong>${safePhone}</strong>.</p>
                <button class="btn btn-gold" id="cbSuccessDone" style="width: 100%;">DONE</button>
              </div>
            `;
          }

          localStorage.setItem('ashvik_modal_submitted', 'true');

          const doneBtn = document.getElementById('cbSuccessDone');
          if (doneBtn) {
            doneBtn.addEventListener('click', () => {
              if (overlay) overlay.classList.remove('show');
            });
          }
        });
      }
    }

    initCallBackModal();

    // 14. Floating 3-Button Quick Action Widget (WhatsApp, Instagram, Phone Call)
    function initFloatingQuickActions() {
      if (!document.getElementById('floatingQuickActionsStack')) {
        const floatingHTML = `
          <div class="floating-quick-actions-stack" id="floatingQuickActionsStack">
            <!-- 1. WhatsApp Button (Top) -->
            <a href="https://wa.me/919993515138" target="_blank" rel="noopener noreferrer" class="floating-action-btn btn-whatsapp" aria-label="Chat on WhatsApp">
              <i class="fa-brands fa-whatsapp"></i>
              <span class="floating-action-tooltip">Chat on WhatsApp</span>
            </a>

            <!-- 2. Instagram Button (Middle) -->
            <a href="https://www.instagram.com/ashvikmedia01?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer" class="floating-action-btn btn-instagram" aria-label="Follow on Instagram">
              <i class="fa-brands fa-instagram"></i>
              <span class="floating-action-tooltip">Follow on Instagram</span>
            </a>

            <!-- 3. Direct Phone Call Button (Bottom) -->
            <a href="tel:+919993515138" class="floating-action-btn btn-phone" aria-label="Direct Phone Call">
              <i class="fa-solid fa-phone"></i>
              <span class="floating-action-tooltip">Call +91 99935 15138</span>
            </a>
          </div>
        `;
        document.body.insertAdjacentHTML('beforeend', floatingHTML);
      }
    }

    initFloatingQuickActions();
  });

/* ==========================================================================
   SOCIAL MEDIA PAGE INTERACTIVE ENGINE
   ========================================================================== */
window.updateSocialCalc = function() {
  const budgetRange = document.getElementById('budgetRange');
  const budgetVal = document.getElementById('budgetVal');
  if (!budgetRange || !budgetVal) return;

  const budget = parseInt(budgetRange.value, 10) || 5000;
  budgetVal.innerText = '₹' + budget.toLocaleString('en-IN');

  // Dynamically update slider track fill gradient
  const min = parseInt(budgetRange.min, 10) || 100;
  const max = parseInt(budgetRange.max, 10) || 250000;
  const sliderPct = Math.min(100, Math.max(0, ((budget - min) / (max - min)) * 100));
  budgetRange.style.background = `linear-gradient(to right, #FFC700 0%, #FFC700 ${sliderPct}%, rgba(255,255,255,0.12) ${sliderPct}%, rgba(255,255,255,0.12) 100%)`;

  const activePlatBtn = document.querySelector('.calc-platform-btn.active');
  const platform = activePlatBtn ? activePlatBtn.dataset.platform : 'instagram';
  const platformName = activePlatBtn ? activePlatBtn.innerText.trim() : 'Instagram';
  const objectiveSelect = document.getElementById('calcObjective');
  const objective = objectiveSelect ? objectiveSelect.value : 'sales';
  const objectiveText = objectiveSelect ? objectiveSelect.options[objectiveSelect.selectedIndex].text : 'Direct E-Commerce Product Sales';

  // Realistic CPM and Conversion multipliers
  let multReach = 9.5;
  let multViews = 22.0;
  let multConv = 0.042;
  let roasVal = '5.4X';

  if (platform === 'google') { 
    multReach = 11.2; multViews = 26.5; multConv = 0.048; roasVal = '6.5X'; 
  } else if (platform === 'meta') { 
    multReach = 8.8; multViews = 18.5; multConv = 0.045; roasVal = '5.0X'; 
  } else if (platform === 'youtube') { 
    multReach = 7.5; multViews = 15.0; multConv = 0.038; roasVal = '5.2X'; 
  } else if (platform === 'linkedin') { 
    multReach = 4.2; multViews = 8.5; multConv = 0.068; roasVal = '7.2X'; 
  }

  if (objective === 'viral') { 
    multReach *= 1.6; multViews *= 2.0; multConv *= 0.5; roasVal = '4.6X';
  } else if (objective === 'leads') { 
    multReach *= 0.85; multConv *= 1.45; roasVal = '5.8X';
  } else if (objective === 'retargeting') { 
    multReach *= 0.65; multConv *= 2.2; roasVal = '7.8X';
  }

  const reach = Math.max(750, Math.round(budget * multReach));
  const views = Math.max(1500, Math.round(budget * multViews));
  const convMin = Math.max(5, Math.round(budget * multConv * 0.75));
  const convMax = Math.max(12, Math.round(budget * multConv * 1.25));

  const resReach = document.getElementById('resReach');
  const resViews = document.getElementById('resViews');
  const resConversions = document.getElementById('resConversions');
  const resROI = document.getElementById('resROI');

  if (resReach) resReach.innerText = reach.toLocaleString('en-IN') + '+';
  if (resViews) resViews.innerText = views.toLocaleString('en-IN') + '+';
  if (resConversions) resConversions.innerText = convMin.toLocaleString('en-IN') + ' - ' + convMax.toLocaleString('en-IN');
  if (resROI) resROI.innerText = roasVal;

  // Visual logarithmic fill bars
  const logPct = Math.min(100, Math.max(15, Math.round((Math.log10(budget) / Math.log10(max)) * 100)));
  const barReach = document.getElementById('barReach');
  const barViews = document.getElementById('barViews');
  const barConversions = document.getElementById('barConversions');
  if (barReach) barReach.style.width = logPct + '%';
  if (barViews) barViews.style.width = Math.min(100, logPct + 12) + '%';
  if (barConversions) barConversions.style.width = Math.min(100, logPct + 8) + '%';

  // Update WhatsApp Direct Action URL
  const waBtn = document.querySelector('.calc-results-col .btn-gold');
  if (waBtn) {
    const msg = `Hi Ashvik Media, I configured a campaign with ₹${budget.toLocaleString('en-IN')} budget on ${platformName} for "${objectiveText}" (Projected: ${reach.toLocaleString('en-IN')}+ Reach, ${roasVal} ROAS). Let's discuss launching this!`;
    waBtn.href = `https://wa.me/919993515138?text=${encodeURIComponent(msg)}`;
  }
};

// Platform Selection Buttons
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('budgetRange')) {
    window.updateSocialCalc();
  }

  const platBtns = document.querySelectorAll('.calc-platform-btn');
  platBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      platBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      window.updateSocialCalc();
    });
  });

  // Feed Tabs Filter
  const feedTabs = document.querySelectorAll('.feed-tab');
  const feedCards = document.querySelectorAll('.feed-card');
  feedTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      feedTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const cat = tab.dataset.filter;
      feedCards.forEach(card => {
        if (cat === 'all' || card.dataset.category === cat) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // Attach progress track listener to reel videos
  const reelVideos = document.querySelectorAll('.feed-reel-video');
  reelVideos.forEach(v => {
    v.addEventListener('timeupdate', () => {
      if (v.duration) {
        const pct = (v.currentTime / v.duration) * 100;
        const parentBox = v.closest('.video-media-box');
        if (parentBox) {
          const bar = parentBox.querySelector('.reel-progress-bar');
          if (bar) bar.style.width = pct + '%';
        }
      }
    });
    // If video loaded before listener
    if (v.readyState >= 2) {
      window.handleReelLoaded(v);
    }
  });
});

/* ==========================================================================
   VIRAL REELS & HIGH-ROAS SHOWCASE ENGINE (Autoplay, Mute Toggle, Lightbox)
   ========================================================================== */
window.handleReelLoaded = function(video) {
  if (!video) return;
  const parentBox = video.closest('.video-media-box');
  if (parentBox) {
    const loader = parentBox.querySelector('.reel-loader-overlay');
    if (loader) {
      loader.classList.add('hidden');
    }
  }
  video.play().catch(() => {});
};

window.toggleReelPlay = function(mediaBox) {
  if (!mediaBox) return;
  const video = mediaBox.querySelector('video');
  if (!video) return;

  if (video.paused) {
    video.play();
    mediaBox.classList.remove('paused');
  } else {
    video.pause();
    mediaBox.classList.add('paused');
  }
};

window.toggleReelMute = function(btn) {
  if (!btn) return;
  const parentBox = btn.closest('.video-media-box');
  if (!parentBox) return;
  const video = parentBox.querySelector('video');
  if (!video) return;

  const isCurrentlyMuted = video.muted;

  if (isCurrentlyMuted) {
    // USER IS ENABLING SOUND FOR THIS REEL:
    // 1. Automatically mute ALL other video reels on the page
    const allReelBoxes = document.querySelectorAll('.video-media-box');
    allReelBoxes.forEach(box => {
      const otherVid = box.querySelector('video');
      const otherBtn = box.querySelector('.mute-btn');
      if (otherVid && otherVid !== video) {
        otherVid.muted = true;
      }
      if (otherBtn && otherBtn !== btn) {
        otherBtn.classList.remove('active-unmuted');
        const otherIcon = otherBtn.querySelector('i');
        if (otherIcon) {
          otherIcon.className = 'fa-solid fa-volume-xmark';
        }
        otherBtn.title = 'Unmute Audio';
      }
    });

    // 2. Unmute current video & set active sound icon
    video.muted = false;
    btn.classList.add('active-unmuted');
    const icon = btn.querySelector('i');
    if (icon) {
      icon.className = 'fa-solid fa-volume-high';
    }
    btn.title = 'Mute Audio';
  } else {
    // USER IS MUTING CURRENT REEL
    video.muted = true;
    btn.classList.remove('active-unmuted');
    const icon = btn.querySelector('i');
    if (icon) {
      icon.className = 'fa-solid fa-volume-xmark';
    }
    btn.title = 'Unmute Audio';
  }
};

// Helper to dynamically resolve relative asset paths based on whether current page is in a subfolder
function resolveAssetPath(path) {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
    return path;
  }
  if (path.startsWith('../')) return path;

  const isSubfolder = document.querySelector('link[href^="../assets"]') !== null || 
                      document.querySelector('script[src^="../assets"]') !== null ||
                      window.location.pathname.includes('/ecommerce') ||
                      window.location.pathname.includes('/social-media') ||
                      window.location.pathname.includes('/graphics') ||
                      window.location.pathname.includes('/services') ||
                      window.location.pathname.includes('/about') ||
                      window.location.pathname.includes('/contact') ||
                      window.location.pathname.includes('/blog') ||
                      window.location.pathname.includes('/privacy-policy') ||
                      window.location.pathname.includes('/terms');

  let clean = path;
  if (clean.startsWith('./')) clean = clean.substring(2);
  if (clean.startsWith('/')) clean = clean.substring(1);

  return isSubfolder ? '../' + clean : clean;
}

window.openReelModal = function(src, type, title) {
  const modal = document.getElementById('reelModal');
  const overlay = document.getElementById('reelModalOverlay');
  const body = document.getElementById('reelModalBody');
  if (!modal || !overlay || !body) return;

  const resolvedSrc = resolveAssetPath(src);
  const fallbackImg = resolveAssetPath('assets/images/reel/1.jpg');

  let mediaHtml = '';
  if (type === 'video') {
    mediaHtml = `
      <div class="modal-media-wrap">
        <video src="${resolvedSrc}" controls autoplay playsinline loop style="width: 100%; height: 100%;"></video>
      </div>
    `;
  } else {
    mediaHtml = `
      <div class="modal-media-wrap">
        <img src="${resolvedSrc}" alt="${title}" onerror="this.onerror=null; this.src='${fallbackImg}';">
      </div>
    `;
  }

  body.innerHTML = `
    ${mediaHtml}
    <div class="modal-info-wrap">
      <div class="ad-badge-pill" style="align-self: flex-start;">${type === 'video' ? '🔥 VIRAL REEL SHOWCASE' : '⚡ HIGH-ROAS CREATIVE'}</div>
      <h3 class="modal-title">${title}</h3>
      <p style="font-size: 0.85rem; color: #CBD5E1; line-height: 1.45;">
        Want high-retention viral content, motion graphics, and high-converting ad creative built for your brand?
      </p>
      <div class="modal-cta-row">
        <a href="https://wa.me/919993515138?text=${encodeURIComponent('Hi Ashvik Media, I would like to create content like: ' + title)}" target="_blank" class="btn btn-gold">
          <i class="fa-brands fa-whatsapp"></i> Inquire on WhatsApp
        </a>
        <button onclick="closeReelModal()" class="btn btn-dark-outline">Close</button>
      </div>
    </div>
  `;

  overlay.classList.add('active');
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
};

window.closeReelModal = function() {
  const modal = document.getElementById('reelModal');
  const overlay = document.getElementById('reelModalOverlay');
  const body = document.getElementById('reelModalBody');
  if (body) {
    const video = body.querySelector('video');
    if (video) video.pause();
    body.innerHTML = '';
  }
  if (modal) modal.classList.remove('active');
  if (overlay) overlay.classList.remove('active');
  document.body.style.overflow = '';
};


/* ==========================================================================
   E-COMMERCE STORE ENGINE (Services, Selection Cart, WhatsApp Direct Checkout, LocalStorage Inquiries)
   ========================================================================== */
const ecomProducts = [
  {
    id: 'prod-1',
    title: 'Amazon Account Launch & Registration',
    category: 'launch',
    categoryName: 'Account & Launch',
    rating: 5.0,
    reviews: 64,
    badge: 'TOP SELLER',
    image: '../assets/images/product/1.jpg',
    desc: 'Complete end-to-end seller onboarding, GST & brand verification, category approval, brand registry, and initial catalog setup for high-speed launch.',
    highlights: ['Brand Registry', 'GST & Bank Setup', 'Fast-Track Launch']
  },
  {
    id: 'prod-2',
    title: 'Amazon Account Management',
    category: 'launch',
    categoryName: 'Account & Launch',
    rating: 4.9,
    reviews: 82,
    badge: 'POPULAR',
    image: '../assets/images/product/2.jpg',
    desc: 'Dedicated Amazon account management including daily seller central health monitoring, inventory replenishment alerts, pricing control, and case management.',
    highlights: ['Daily Health Check', 'Inventory Alerts', 'Case Support']
  },
  {
    id: 'prod-3',
    title: 'Amazon Advertising & PPC Management',
    category: 'ads',
    categoryName: 'Advertising & PPC',
    rating: 5.0,
    reviews: 95,
    badge: 'HIGH ROAS',
    image: '../assets/images/product/3.jpg',
    desc: 'Sponsored Products, Brands & Display campaign optimization with AI keyword harvesting, negative targeting, bid adjustments, and lowering TACoS/ACoS.',
    highlights: ['TACoS Reduction', 'AI Keyword Bidding', 'Sponsored Ads']
  },
  {
    id: 'prod-4',
    title: 'Amazon Storefront Creation & Design',
    category: 'creative',
    categoryName: 'Creative & Storefront',
    rating: 4.9,
    reviews: 58,
    badge: 'FEATURED',
    image: '../assets/images/product/4.jpg',
    desc: 'Bespoke multi-page immersive brand store design with dynamic product tiles, lifestyle banners, video showcases, and curated category collections.',
    highlights: ['Custom Storefront', 'Lifestyle Banners', 'Curated Pages']
  },
  {
    id: 'prod-6',
    title: 'Amazon Brand & Product-Specific Videos',
    category: 'creative',
    categoryName: 'Creative & Storefront',
    rating: 4.9,
    reviews: 71,
    badge: 'HIGH CONVERTING',
    image: '../assets/images/product/6.jpg',
    desc: 'High-impact 3D product renders, unboxing & feature walkthrough videos optimized specifically for Amazon video ads and main image carousel slots.',
    highlights: ['3D Product Video', 'High-ROAS Video Ads', 'Feature Showcase']
  },
  {
    id: 'prod-7',
    title: 'Cataloging - Listing On Multiple Portals',
    category: 'listing',
    categoryName: 'Listing & Multi-Portal',
    rating: 4.8,
    reviews: 53,
    badge: 'MULTI-CHANNEL',
    image: '../assets/images/product/7.jpg',
    desc: 'Multi-marketplace bulk catalog mapping and seamless listing synchronization across Amazon, Flipkart, Shopify, eBay, Walmart, and Meesho.',
    highlights: ['Multi-Marketplace', 'Bulk Catalog Sync', 'Zero Error Mapping']
  },
  {
    id: 'prod-8',
    title: 'Amazon Product Listing & SEO Optimization',
    category: 'listing',
    categoryName: 'Listing & Multi-Portal',
    rating: 5.0,
    reviews: 89,
    badge: 'BESTSELLER',
    image: '../assets/images/product/8.jpg',
    desc: 'High-ranking keyword indexed titles, persuasive bullet points, HTML descriptions, backend search terms, and mobile-optimized search conversion copy.',
    highlights: ['Keyword Indexing', 'High CTR Titles', 'A9 Algorithm SEO']
  },
  {
    id: 'prod-9',
    title: 'A+ Content (Enhanced Brand Content)',
    category: 'creative',
    categoryName: 'Creative & Storefront',
    rating: 5.0,
    reviews: 112,
    badge: 'MUST HAVE',
    image: '../assets/images/product/9.jpg',
    desc: '7 Premium custom A+ graphic modules, comparison charts, high-resolution lifestyle visual storytelling, and mobile-responsive EBC design layout.',
    highlights: ['7 Custom Modules', 'Comparison Matrix', '3X Conversions']
  }
];

let cart = JSON.parse(localStorage.getItem('ashvik_cart')) || [];
// Clean up any old broken image paths stored in localStorage
cart = cart.map(item => ({
  ...item,
  image: resolveAssetPath(item.image)
}));

window.renderStarRating = function(rating) {
  let starsHtml = '';
  for (let i = 1; i <= 5; i++) {
    if (rating >= i) {
      starsHtml += '<i class="fa-solid fa-star"></i>';
    } else if (rating >= i - 0.5) {
      starsHtml += '<i class="fa-solid fa-star-half-stroke"></i>';
    } else {
      starsHtml += '<i class="fa-regular fa-star"></i>';
    }
  }
  return starsHtml;
};

window.renderProducts = function(items = ecomProducts) {
  const grid = document.getElementById('productGrid');
  if (!grid) return;

  if (items.length === 0) {
    grid.innerHTML = `<div style="grid-column:1/-1; text-align:center; padding:3rem; color:var(--text-dark-secondary);">No services matching your search query or category filter.</div>`;
    return;
  }

  const fallbackSrc = resolveAssetPath('assets/images/product/1.jpg');

  grid.innerHTML = items.map(p => {
    const imgSrc = resolveAssetPath(p.image);
    return `
    <div class="product-card">
      <div class="product-card-top">
        ${p.badge ? `<div class="product-badge-tag"><i class="fa-solid fa-sparkles"></i> ${p.badge}</div>` : ''}
        <div class="product-img-box">
          <img src="${imgSrc}" alt="${p.title}" loading="lazy" onerror="this.onerror=null; this.src='${fallbackSrc}';">
          <button class="product-quickview-trigger" onclick="openQuickView('${p.id}')" title="Quick Overview">
            <i class="fa-solid fa-eye"></i> Quick View
          </button>
        </div>
      </div>
      <div class="product-content">
        <div class="product-meta-row">
          <span class="product-cat"><i class="fa-solid fa-circle" style="font-size:0.35rem; vertical-align:middle; margin-right:4px; color:var(--primary-gold);"></i>${p.categoryName || p.category.toUpperCase()}</span>
          <span class="product-trust-badge"><i class="fa-solid fa-shield-check"></i> Verified</span>
        </div>
        <h3 class="product-title" onclick="openQuickView('${p.id}')">${p.title}</h3>
        <div class="product-rating">
          <div class="stars">
            ${window.renderStarRating(p.rating)}
          </div>
          <span class="rating-num">${p.rating.toFixed(1)}</span>
          <span class="rating-count">(${p.reviews} verified reviews)</span>
        </div>
        <p class="product-desc">${p.desc}</p>

        <div class="product-highlights">
          ${(p.highlights || []).map(h => `<span class="highlight-pill"><i class="fa-solid fa-check text-gold"></i> ${h}</span>`).join('')}
        </div>

        <div class="product-actions">
          <button class="btn btn-gold product-add-btn" onclick="addToCart('${p.id}')">
            <i class="fa-solid fa-cart-plus"></i> Add To Cart
          </button>
          <button class="btn btn-dark-outline product-qv-btn" onclick="openQuickView('${p.id}')" title="Quick Overview">
            <i class="fa-solid fa-arrow-up-right-from-square"></i>
          </button>
        </div>
      </div>
    </div>
  `;
  }).join('');
};

window.filterProducts = function() {
  const query = document.getElementById('storeSearchInput')?.value.toLowerCase().trim() || '';
  const activePill = document.querySelector('.filter-pill.active');
  const cat = activePill ? activePill.dataset.category : 'all';
  const sortVal = document.getElementById('storeSortSelect')?.value || 'featured';

  let filtered = ecomProducts.filter(p => {
    const matchCat = cat === 'all' || p.category === cat;
    const matchQuery = p.title.toLowerCase().includes(query) || p.desc.toLowerCase().includes(query);
    return matchCat && matchQuery;
  });

  if (sortVal === 'name-az') filtered.sort((a,b) => a.title.localeCompare(b.title));
  else if (sortVal === 'rating') filtered.sort((a,b) => b.rating - a.rating);

  window.renderProducts(filtered);
};

window.sortProducts = function() {
  window.filterProducts();
};

window.toggleCartDrawer = function() {
  const drawer = document.getElementById('cartDrawer');
  const overlay = document.getElementById('cartOverlay');
  if (drawer && overlay) {
    drawer.classList.toggle('active');
    overlay.classList.toggle('active');
  }
};

window.addToCart = function(productId) {
  const item = ecomProducts.find(p => p.id === productId);
  if (!item) return;

  const existing = cart.find(c => c.id === productId);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...item, qty: 1 });
  }

  localStorage.setItem('ashvik_cart', JSON.stringify(cart));
  window.updateCartUI();
  window.toggleCartDrawer();
};

window.changeQty = function(index, delta) {
  if (cart[index]) {
    cart[index].qty += delta;
    if (cart[index].qty <= 0) {
      cart.splice(index, 1);
    }
  }
  localStorage.setItem('ashvik_cart', JSON.stringify(cart));
  window.updateCartUI();
};

window.removeFromCart = function(index) {
  if (cart[index]) {
    cart.splice(index, 1);
  }
  localStorage.setItem('ashvik_cart', JSON.stringify(cart));
  window.updateCartUI();
};

window.updateCartUI = function() {
  const countBadges = document.querySelectorAll('#cartCountBadge, #cartHeaderCount');
  const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
  countBadges.forEach(b => b.innerText = totalQty);

  const totalItemsCountEl = document.getElementById('cartTotalItemsCount');
  if (totalItemsCountEl) {
    totalItemsCountEl.innerText = `${totalQty} service${totalQty === 1 ? '' : 's'}`;
  }

  const body = document.getElementById('cartDrawerBody');
  if (!body) return;

  if (cart.length === 0) {
    body.innerHTML = `
      <div style="text-align:center; padding:3rem 1rem; color:var(--text-dark-secondary);">
        <i class="fa-solid fa-cart-shopping" style="font-size:3rem; color:var(--dark-border); margin-bottom:1rem;"></i>
        <p style="font-size:1rem; color:var(--text-dark-primary); margin-bottom:0.4rem;">Your cart is empty</p>
        <p style="font-size:0.85rem; color:var(--text-dark-secondary);">Add services from the catalog to build your custom package.</p>
        <button class="btn btn-gold" style="margin-top:1.2rem;" onclick="toggleCartDrawer()">Browse Services</button>
      </div>
    `;
    return;
  }

  const fallbackSrc = resolveAssetPath('assets/images/product/1.jpg');

  body.innerHTML = cart.map((item, idx) => {
    const imgSrc = resolveAssetPath(item.image);
    return `
    <div class="cart-item">
      <img src="${imgSrc}" alt="${item.title}" class="cart-item-img" onerror="this.onerror=null; this.src='${fallbackSrc}';">
      <div class="cart-item-info">
        <div class="cart-item-title">${item.title}</div>
        <div class="cart-item-tag">${item.categoryName || item.category}</div>
        <div class="cart-qty-ctrl">
          <button class="qty-btn" onclick="changeQty(${idx}, -1)" title="Decrease">-</button>
          <span style="font-size:0.85rem; color:#FFF; min-width:16px; text-align:center;">${item.qty}</span>
          <button class="qty-btn" onclick="changeQty(${idx}, 1)" title="Increase">+</button>
        </div>
      </div>
      <button class="cart-item-remove" onclick="removeFromCart(${idx})" title="Remove"><i class="fa-solid fa-trash"></i></button>
    </div>
  `;
  }).join('');
};

// WhatsApp Direct Checkout & LocalStorage Inquiry Persistence
window.executeWhatsAppCheckout = function() {
  if (cart.length === 0) {
    alert('Your service selection is empty! Please add at least one service before checking out.');
    return;
  }

  const name = document.getElementById('custName')?.value.trim();
  const phone = document.getElementById('custPhone')?.value.trim();
  const storeUrl = document.getElementById('custStore')?.value.trim() || 'Not Provided';
  const note = document.getElementById('custNote')?.value.trim() || 'None';

  if (!name) {
    alert('Please enter your Full Name.');
    document.getElementById('custName')?.focus();
    return;
  }

  if (!phone) {
    alert('Please enter your WhatsApp Phone Number.');
    document.getElementById('custPhone')?.focus();
    return;
  }

  const orderId = '#AM-ECOM-' + Math.floor(10000 + Math.random() * 90000);
  const totalServices = cart.reduce((sum, item) => sum + item.qty, 0);
  const dateStr = new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });

  let message = `🚀 *NEW E-COMMERCE SERVICE INQUIRY - ASHVIK MEDIA*\n`;
  message += `━━━━━━━━━━━━━━━━━━━━━\n`;
  message += `📋 *Reference ID:* ${orderId}\n`;
  message += `📅 *Date:* ${dateStr}\n\n`;
  message += `👤 *Client Details:*\n`;
  message += `• *Name:* ${name}\n`;
  message += `• *WhatsApp Phone:* ${phone}\n`;
  if (storeUrl !== 'Not Provided') {
    message += `• *Brand / Store Link:* ${storeUrl}\n`;
  }
  if (note !== 'None') {
    message += `• *Requirements / Notes:* ${note}\n`;
  }
  message += `\n📦 *Selected Services (${totalServices} items):*\n`;

  cart.forEach((item, i) => {
    message += `${i+1}. *${item.title}* (Qty: ${item.qty})\n`;
  });

  message += `\n━━━━━━━━━━━━━━━━━━━━━\n`;
  message += `💬 *Request:* Hi Ashvik Media Team, I would like to get a customized quote and execution plan for the above services. Please get back to me with the details!`;

  // 1. Save to LocalStorage inquiry history
  const orders = JSON.parse(localStorage.getItem('ashvik_orders')) || [];
  const newOrder = {
    id: orderId,
    date: dateStr,
    name: name,
    phone: phone,
    storeUrl: storeUrl,
    note: note,
    items: [...cart],
    totalServices: totalServices,
    status: 'Sent to WhatsApp'
  };
  orders.unshift(newOrder);
  localStorage.setItem('ashvik_orders', JSON.stringify(orders));

  // 2. Clear Cart & Close Drawer
  cart = [];
  localStorage.removeItem('ashvik_cart');
  window.updateCartUI();
  window.updateOrderCountBadge();

  // 3. Open WhatsApp link
  const waUrl = `https://wa.me/919993515138?text=${encodeURIComponent(message)}`;
  window.open(waUrl, '_blank');
  window.toggleCartDrawer();
};

window.openOrderHistoryModal = function() {
  const modal = document.getElementById('orderHistoryModal');
  const overlay = document.getElementById('orderModalOverlay');
  if (modal && overlay) {
    window.renderOrderHistory();
    modal.classList.add('active');
    overlay.classList.add('active');
  }
};

window.closeOrderHistoryModal = function() {
  const modal = document.getElementById('orderHistoryModal');
  const overlay = document.getElementById('orderModalOverlay');
  if (modal && overlay) {
    modal.classList.remove('active');
    overlay.classList.remove('active');
  }
};

window.renderOrderHistory = function() {
  const body = document.getElementById('orderModalBody');
  if (!body) return;

  const orders = JSON.parse(localStorage.getItem('ashvik_orders')) || [];
  window.updateOrderCountBadge();

  if (orders.length === 0) {
    body.innerHTML = `
      <div style="text-align:center; padding:2.5rem 1rem; color:var(--text-dark-secondary);">
        <i class="fa-solid fa-clock-rotate-left" style="font-size:2.5rem; color:var(--dark-border); margin-bottom:1rem;"></i>
        <p style="font-size:1rem; color:var(--text-dark-primary); margin-bottom:0.3rem;">No past inquiries found</p>
        <p style="font-size:0.85rem; color:var(--text-dark-secondary);">Your future WhatsApp service inquiries will be recorded here.</p>
      </div>
    `;
    return;
  }

  body.innerHTML = orders.map(o => `
    <div class="order-history-card">
      <div class="oh-header">
        <span class="oh-id">${o.id}</span>
        <span class="oh-status"><i class="fa-brands fa-whatsapp"></i> ${o.status}</span>
      </div>
      <div style="font-size:0.78rem; color:var(--text-dark-muted); margin-bottom:0.4rem;">Inquired on: ${o.date}</div>
      <div class="oh-items">
        ${o.items.map(it => `<div>• <strong>${it.title}</strong> (Qty: ${it.qty})</div>`).join('')}
      </div>
      <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid var(--dark-border); padding-top:0.6rem; margin-top:0.6rem;">
        <span style="font-size:0.85rem; color:var(--primary-gold); font-weight:600;"><i class="fa-solid fa-layer-group"></i> ${o.items.length} Services Selected</span>
        <a href="https://wa.me/919993515138?text=${encodeURIComponent("Hi Ashvik Media, I'm following up on my service inquiry " + o.id)}" target="_blank" class="btn btn-gold" style="padding:0.35rem 0.85rem; font-size:0.75rem;">
          Track on WhatsApp <i class="fa-brands fa-whatsapp"></i>
        </a>
      </div>
    </div>
  `).join('');
};

window.clearOrderHistory = function() {
  if (confirm('Are you sure you want to clear all inquiry history from LocalStorage?')) {
    localStorage.removeItem('ashvik_orders');
    window.renderOrderHistory();
  }
};

window.updateOrderCountBadge = function() {
  const orders = JSON.parse(localStorage.getItem('ashvik_orders')) || [];
  const badge = document.getElementById('orderCountBadge');
  if (badge) badge.innerText = orders.length;
};

window.openQuickView = function(id) {
  const item = ecomProducts.find(p => p.id === id);
  if (!item) return;

  const modal = document.getElementById('quickViewModal');
  const overlay = document.getElementById('quickViewOverlay');
  const title = document.getElementById('qvTitle');
  const body = document.getElementById('qvBody');

  if (modal && overlay && body) {
    const imgSrc = resolveAssetPath(item.image);
    const fallbackSrc = resolveAssetPath('assets/images/product/1.jpg');
    title.innerText = item.title;
    body.innerHTML = `
      <div class="quickview-grid">
        <div class="quickview-img-box">
          <img src="${imgSrc}" alt="${item.title}" loading="lazy" onerror="this.onerror=null; this.src='${fallbackSrc}';">
        </div>
        <div class="quickview-info">
          <div class="product-cat">${item.categoryName || item.category.toUpperCase()}</div>
          <div class="product-rating">
            <div class="stars" style="color:#F59E0B; display:inline-flex; gap:2px; margin-right:4px;">
              ${window.renderStarRating(item.rating)}
            </div>
            <span style="font-weight:700; color:#FFF;">${item.rating.toFixed(1)}</span>
            <span style="color:var(--text-dark-secondary); margin-left:0.3rem;">(${item.reviews} verified reviews)</span>
          </div>
          <p class="product-desc">${item.desc}</p>
          <div class="product-highlights" style="margin-bottom:1.2rem;">
            ${(item.highlights || []).map(h => `<span class="highlight-pill"><i class="fa-solid fa-check text-gold"></i> ${h}</span>`).join('')}
          </div>
          <button class="btn btn-gold quickview-btn" onclick="addToCart('${item.id}'); closeQuickView();">
            <span>ADD TO CART & PROCEED</span>
            <i class="fa-solid fa-cart-plus"></i>
          </button>
        </div>
      </div>
    `;
    modal.classList.add('active');
    overlay.classList.add('active');
  }
};

window.closeQuickView = function() {
  const modal = document.getElementById('quickViewModal');
  const overlay = document.getElementById('quickViewOverlay');
  if (modal && overlay) {
    modal.classList.remove('active');
    overlay.classList.remove('active');
  }
};

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('productGrid')) {
    window.renderProducts();
    window.updateCartUI();
    window.updateOrderCountBadge();

    const pills = document.querySelectorAll('.filter-pill');
    pills.forEach(p => {
      p.addEventListener('click', () => {
        pills.forEach(x => x.classList.remove('active'));
        p.classList.add('active');
        window.filterProducts();
      });
    });
  }
});


/* ==========================================================================
   GRAPHICS PAGE INTERACTIVE ENGINE (Before/After Slider & Package Builder)
   ========================================================================== */
function initBeforeAfterSlider() {
  const container = document.getElementById('beforeAfterSlider');
  const afterLayer = document.getElementById('baAfterLayer');
  const handle = document.getElementById('baHandle');
  if (!container || !afterLayer || !handle) return;

  let isDragging = false;

  const moveSlider = (clientX) => {
    const rect = container.getBoundingClientRect();
    let x = clientX - rect.left;
    if (x < 0) x = 0;
    if (x > rect.width) x = rect.width;
    const pct = (x / rect.width) * 100;
    afterLayer.style.width = pct + '%';
    handle.style.left = pct + '%';
  };

  container.addEventListener('mousedown', (e) => { isDragging = true; moveSlider(e.clientX); });
  window.addEventListener('mouseup', () => { isDragging = false; });
  window.addEventListener('mousemove', (e) => { if (isDragging) moveSlider(e.clientX); });

  container.addEventListener('touchstart', (e) => { isDragging = true; moveSlider(e.touches[0].clientX); }, { passive: true });
  window.addEventListener('touchend', () => { isDragging = false; });
  window.addEventListener('touchmove', (e) => { if (isDragging) moveSlider(e.touches[0].clientX); }, { passive: true });
}

window.calcGraphicsPackage = function() {
  const checkboxes = document.querySelectorAll('.gfx-check:checked');
  let total = 0;
  let names = [];

  checkboxes.forEach(cb => {
    total += parseInt(cb.value, 10);
    names.push(cb.dataset.name);
  });

  const listEl = document.getElementById('gfxSelectedList');
  const priceEl = document.getElementById('gfxTotalPrice');
  const timeEl = document.getElementById('gfxTimeframe');

  if (listEl) {
    if (names.length === 0) {
      listEl.innerHTML = `<div>No assets selected yet.</div>`;
    } else {
      listEl.innerHTML = names.map(n => `<div>• ${n}</div>`).join('');
    }
  }

  if (priceEl) priceEl.innerText = '₹' + total.toLocaleString('en-IN');
  if (timeEl) {
    if (total > 20000) timeEl.innerText = '7 - 10 Business Days';
    else if (total > 10000) timeEl.innerText = '4 - 6 Business Days';
    else timeEl.innerText = '2 - 4 Business Days';
  }
};

window.orderGraphicsWhatsApp = function() {
  const checkboxes = document.querySelectorAll('.gfx-check:checked');
  if (checkboxes.length === 0) {
    alert('Please select at least one graphic design service item.');
    return;
  }

  let total = 0;
  let items = [];
  checkboxes.forEach(cb => {
    total += parseInt(cb.value, 10);
    items.push(cb.dataset.name);
  });

  let msg = `🎨 *CUSTOM GRAPHIC DESIGN PACKAGE INQUIRY - ASHVIK MEDIA*\n`;
  msg += `----------------------------------\n`;
  msg += `*Selected Design Assets:*\n`;
  items.forEach(it => msg += `• ${it}\n`);
  msg += `\n*Estimated Investment:* ₹${total.toLocaleString('en-IN')}\n`;
  msg += `----------------------------------\n`;
  msg += `Hi Ashvik Media! I'd like to initiate this design project. Please provide further onboarding details.`;

  window.open(`https://wa.me/919993515138?text=${encodeURIComponent(msg)}`, '_blank');
};

/* Brand Style & Color Palette Generator Engine */
const vibeData = {
  luxury: {
    badge: '👑 LUXURY GOLD & BLACK SYSTEM',
    name: 'AURUM & CO.',
    tagline: '"Precision Craftsmanship Meets Modern Visual Elegance"',
    accentColor: '#FFC700',
    borderColor: '#FFC700',
    swatches: [
      { hex: '#FFC700', label: 'Primary Gold' },
      { hex: '#0A0C10', label: 'Deep Dark' },
      { hex: '#10B981', label: 'Emerald Accent' }
    ],
    font: 'Plus Jakarta Sans (Heading) + Inter (Body)',
    vibeDesc: 'High-contrast luxury theme designed for premium D2C brands, fine jewelry, fragrance, and high-ticket service providers.'
  },
  cyberpunk: {
    badge: '⚡ NEON CYBERPUNK WEB3 SYSTEM',
    name: 'SYNTHEX LABS',
    tagline: '"Futuristic Visual Identity For Next-Gen Tech & Web3"',
    accentColor: '#00F2FE',
    borderColor: '#00F2FE',
    swatches: [
      { hex: '#00F2FE', label: 'Electric Cyan' },
      { hex: '#FF007F', label: 'Neon Magenta' },
      { hex: '#0F172A', label: 'Cyber Slate' }
    ],
    font: 'Space Grotesk (Heading) + Fira Code (Data)',
    vibeDesc: 'High-energy glowing neon aesthetic crafted for tech startups, AI products, crypto exchanges, and gaming brands.'
  },
  organic: {
    badge: '🌿 MINIMALIST ORGANIC SYSTEM',
    name: 'VERDANT BOTANICALS',
    tagline: '"Earthy Warmth & Clean Sustainable Aesthetics"',
    accentColor: '#10B981',
    borderColor: '#10B981',
    swatches: [
      { hex: '#E2D8C3', label: 'Warm Oat' },
      { hex: '#047857', label: 'Forest Green' },
      { hex: '#D97706', label: 'Terracotta' }
    ],
    font: 'Playfair Display (Serif) + Outfit (Clean Body)',
    vibeDesc: 'Soft natural tones and elegant typography engineered for eco-friendly skincare, wellness, and organic D2C brands.'
  },
  corporate: {
    badge: '💼 CORPORATE ELITE EXECUTIVE',
    name: 'VANGUARD CAPITAL',
    tagline: '"Authority, Trust, & High-Conversion Precision"',
    accentColor: '#2563EB',
    borderColor: '#2563EB',
    swatches: [
      { hex: '#2563EB', label: 'Royal Blue' },
      { hex: '#F8FAFC', label: 'Pure Platinum' },
      { hex: '#1E293B', label: 'Executive Navy' }
    ],
    font: 'Cabinet Grotesk (Heading) + Plus Jakarta (Body)',
    vibeDesc: 'Clean corporate minimalism engineered for fintech, SaaS, legal, real estate, and B2B enterprise firms.'
  }
};

let activeVibeKey = 'luxury';

window.updateBrandVibe = function(vibeKey) {
  const data = vibeData[vibeKey];
  if (!data) return;
  activeVibeKey = vibeKey;

  const card = document.getElementById('mockupCard');
  const badge = document.getElementById('mockupBadge');
  const name = document.getElementById('mockupName');
  const tagline = document.getElementById('mockupTagline');
  const swatchesGrid = document.getElementById('swatchesGrid');
  const vibeSpecBox = document.getElementById('vibeSpecBox');
  const btn = document.getElementById('mockupBtn');

  if (card && badge && name && tagline && swatchesGrid && vibeSpecBox) {
    card.style.borderColor = data.borderColor;
    badge.innerText = data.badge;
    badge.style.background = data.accentColor;
    badge.style.color = (vibeKey === 'organic' || vibeKey === 'corporate') ? '#FFF' : '#000';

    name.innerText = data.name;
    name.style.color = (vibeKey === 'cyberpunk') ? '#00F2FE' : 'var(--text-dark-primary)';
    tagline.innerText = data.tagline;

    swatchesGrid.innerHTML = data.swatches.map(s => `
      <div class="swatch-box" onclick="navigator.clipboard.writeText('${s.hex}'); alert('Copied hex code ${s.hex} to clipboard!');">
        <div class="swatch-color-circle" style="background:${s.hex};"></div>
        <div class="swatch-hex">${s.hex}</div>
        <div class="swatch-label">${s.label}</div>
      </div>
    `).join('');

    vibeSpecBox.innerHTML = `
      <div><strong>Recommended Font Pairing:</strong> ${data.font}</div>
      <div style="margin-top:0.4rem;"><strong>Design Psychology:</strong> ${data.vibeDesc}</div>
    `;

    if (btn) {
      btn.style.background = data.accentColor;
      btn.style.color = (vibeKey === 'organic' || vibeKey === 'corporate') ? '#FFF' : '#000';
    }
  }
};

window.orderCurrentVibeWhatsApp = function() {
  const data = vibeData[activeVibeKey];
  const msg = `Hi Ashvik Media! I explored your Interactive Brand Generator and love the *${data.badge}* (${data.name}) style. I want to build a brand identity system in this aesthetic!`;
  window.open(`https://wa.me/919993515138?text=${encodeURIComponent(msg)}`, '_blank');
};

window.openGraphicModal = function(title, desc, cat, color = '#FFC700', font = 'Plus Jakarta Sans', impact = '+340% Brand Trust') {
  const modal = document.getElementById('graphicModal');
  const overlay = document.getElementById('graphicModalOverlay');
  const tEl = document.getElementById('gmTitle');
  const bEl = document.getElementById('gmBody');
  const wabtn = document.getElementById('gmWabtn');

  if (modal && overlay && bEl) {
    tEl.innerText = title;
    bEl.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;">
        <span style="font-size:0.8rem; font-weight:800; color:${color}; text-transform:uppercase;">Category: ${cat}</span>
        <span style="background:rgba(255,255,255,0.06); padding:0.2rem 0.6rem; border-radius:var(--radius-pill); font-size:0.75rem; color:var(--text-dark-primary);"><i class="fa-solid fa-chart-line text-gold"></i> ${impact}</span>
      </div>
      <div style="background:rgba(255,255,255,0.03); border:1px solid var(--dark-border); border-radius:var(--radius-md); padding:2.5rem 1.5rem; text-align:center; margin-bottom:1.2rem;">
        <i class="fa-solid fa-wand-magic-sparkles" style="font-size:3.8rem; color:${color}; margin-bottom:1rem;"></i>
        <h4 style="font-size:1.2rem; color:var(--text-dark-primary);">${title}</h4>
      </div>
      <p style="font-size:0.95rem; color:var(--text-dark-secondary); line-height:1.6; margin-bottom:1.2rem;">${desc}</p>
      
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.8rem; background:rgba(0,0,0,0.3); padding:1rem; border-radius:var(--radius-md); font-size:0.85rem; color:var(--text-dark-secondary);">
        <div><strong style="color:#FFF;">Primary Accent:</strong> ${color}</div>
        <div><strong style="color:#FFF;">Typography Specs:</strong> ${font}</div>
        <div><strong style="color:#FFF;">Formats Included:</strong> AI, EPS, SVG, 4K PNG</div>
        <div><strong style="color:#FFF;">Turnaround:</strong> 3 - 5 Days</div>
      </div>
    `;
    
    if (wabtn) {
      wabtn.href = `https://wa.me/919993515138?text=${encodeURIComponent("Hi Ashvik Media! I'm interested in getting custom graphic design built similar to: " + title)}`;
    }

    modal.classList.add('active');
    overlay.classList.add('active');
  }
};

window.closeGraphicModal = function() {
  const modal = document.getElementById('graphicModal');
  const overlay = document.getElementById('graphicModalOverlay');
  if (modal && overlay) {
    modal.classList.remove('active');
    overlay.classList.remove('active');
  }
};

document.addEventListener('DOMContentLoaded', () => {
  initBeforeAfterSlider();
  window.calcGraphicsPackage();

  if (document.getElementById('brandPreviewStage')) {
    window.updateBrandVibe('luxury');

    const vibeBtns = document.querySelectorAll('.vibe-btn');
    vibeBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        vibeBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        window.updateBrandVibe(btn.dataset.vibe);
      });
    });
  }

  // Graphics Category Filter Tabs
  const gTabs = document.querySelectorAll('.graphics-tab');
  const gCards = document.querySelectorAll('.graphic-item-card');
  gTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      gTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const cat = tab.dataset.filter;
      gCards.forEach(card => {
        if (cat === 'all' || card.dataset.category === cat) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
});

/* ==========================================================================
   ASHVIK MEDIA - ENTERPRISE CYBER-SHIELD & ERROR RESILIENCE ENGINE
   - XSS & HTML Injection Sanitizer
   - Global Uncaught Error & Promise Rejection Shield
   - Real-Time Online/Offline Network Monitor & Dynamic Status Pill
   - Form Anti-Bot Honeypot & Rate-Limiting Protection
   - External Link Hardening (Anti-Tabnabbing)
   - LocalStorage Integrity & Bounds Defense
   ========================================================================== */

// 1. XSS & HTML Sanitization Core
window.escapeHTML = function(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

window.sanitizeInput = function(str, maxLength = 300) {
  if (typeof str !== 'string') return '';
  let cleaned = str.trim();
  // Strip control chars and potential script vectors
  cleaned = cleaned.replace(/[\u0000-\u001F\u007F-\u009F]/g, '');
  cleaned = cleaned.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  cleaned = cleaned.replace(/javascript\s*:/gi, '');
  cleaned = cleaned.replace(/on\w+\s*=/gi, '');
  if (cleaned.length > maxLength) {
    cleaned = cleaned.substring(0, maxLength);
  }
  return window.escapeHTML(cleaned);
};

// 2. Global Unhandled Error & Promise Rejection Boundary
window.addEventListener('error', function(e) {
  // Prevent third-party script crashes from breaking Ashvik interactive components
  console.warn('[Ashvik CyberShield] Intercepted runtime exception:', e.message);
  // Prevent browser default crash overlay if any
  return true;
});

window.addEventListener('unhandledrejection', function(e) {
  console.warn('[Ashvik CyberShield] Intercepted unhandled promise rejection:', e.reason);
  if (e && e.preventDefault) e.preventDefault();
});

// 3. Real-Time Network Connectivity Observer (Offline / Online Status Banner)
(function initNetworkShield() {
  let toastEl = null;

  function showNetworkToast(status) {
    if (!toastEl) {
      toastEl = document.createElement('div');
      toastEl.id = 'ashvikNetworkToast';
      toastEl.style.cssText = `
        position: fixed;
        bottom: 24px;
        left: 50%;
        transform: translateX(-50%) translateY(100px);
        background: rgba(10, 12, 16, 0.95);
        border: 1px solid var(--primary-gold, #FFC700);
        box-shadow: 0 10px 30px rgba(0,0,0,0.6), 0 0 15px rgba(255,199,0,0.25);
        border-radius: 9999px;
        padding: 0.65rem 1.4rem;
        display: flex;
        align-items: center;
        gap: 0.65rem;
        font-family: var(--font-primary, 'Plus Jakarta Sans', sans-serif);
        font-size: 0.85rem;
        font-weight: 600;
        color: #FFFFFF;
        z-index: 999999;
        transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s ease;
        opacity: 0;
        pointer-events: none;
        backdrop-filter: blur(12px);
      `;
      document.body.appendChild(toastEl);
    }

    if (status === 'offline') {
      toastEl.style.borderColor = '#EF4444';
      toastEl.style.boxShadow = '0 10px 30px rgba(0,0,0,0.6), 0 0 15px rgba(239,68,68,0.3)';
      toastEl.innerHTML = `
        <span style="width:8px; height:8px; border-radius:50%; background:#EF4444; box-shadow:0 0 8px #EF4444; display:inline-block;"></span>
        <span>You are currently offline. Checking connection...</span>
      `;
      toastEl.style.opacity = '1';
      toastEl.style.transform = 'translateX(-50%) translateY(0)';
    } else if (status === 'online') {
      toastEl.style.borderColor = '#10B981';
      toastEl.style.boxShadow = '0 10px 30px rgba(0,0,0,0.6), 0 0 15px rgba(16,185,129,0.3)';
      toastEl.innerHTML = `
        <span style="width:8px; height:8px; border-radius:50%; background:#10B981; box-shadow:0 0 8px #10B981; display:inline-block;"></span>
        <span>Connection restored! You are back online.</span>
      `;
      toastEl.style.opacity = '1';
      toastEl.style.transform = 'translateX(-50%) translateY(0)';
      setTimeout(() => {
        toastEl.style.opacity = '0';
        toastEl.style.transform = 'translateX(-50%) translateY(100px)';
      }, 3500);
    }
  }

  window.addEventListener('offline', () => showNetworkToast('offline'));
  window.addEventListener('online', () => showNetworkToast('online'));
})();

// 4. Form Cyber-Shield (Anti-Bot Honeypot & Submission Rate-Limiter)
document.addEventListener('DOMContentLoaded', () => {
  const allForms = document.querySelectorAll('form');
  const submitTimestamps = new WeakMap();

  allForms.forEach(form => {
    // Inject invisible honeypot field if not already present
    if (!form.querySelector('.am-shield-hp')) {
      const hp = document.createElement('input');
      hp.type = 'text';
      hp.name = 'am_website_verify_token';
      hp.className = 'am-shield-hp';
      hp.setAttribute('tabindex', '-1');
      hp.setAttribute('autocomplete', 'off');
      hp.style.cssText = 'position:absolute; width:1px; height:1px; opacity:0; pointer-events:none; left:-9999px;';
      form.appendChild(hp);
    }

    form.addEventListener('submit', (e) => {
      // 1. Check honeypot
      const hpField = form.querySelector('.am-shield-hp');
      if (hpField && hpField.value.trim() !== '') {
        console.warn('[Ashvik CyberShield] Automated bot attempt blocked.');
        e.preventDefault();
        e.stopPropagation();
        return false;
      }

      // 2. Form Submission Throttling (Debounce / Rate Limit 3 seconds)
      const now = Date.now();
      const lastSubmit = submitTimestamps.get(form) || 0;
      if (now - lastSubmit < 3000) {
        console.warn('[Ashvik CyberShield] Form submission rate-limit triggered.');
        e.preventDefault();
        return false;
      }
      submitTimestamps.set(form, now);
    }, true);
  });

  // 5. External Link Security Hardening (Anti-Tabnabbing)
  const links = document.querySelectorAll('a[href^="http://"], a[href^="https://"]');
  const currentHost = window.location.hostname;
  links.forEach(link => {
    try {
      const url = new URL(link.href);
      if (url.hostname !== currentHost && url.hostname !== 'ashvikmedia.com') {
        const existingRel = link.getAttribute('rel') || '';
        const relParts = new Set(existingRel.split(/\s+/).filter(Boolean));
        relParts.add('noopener');
        relParts.add('noreferrer');
        link.setAttribute('rel', Array.from(relParts).join(' '));
      }
    } catch (err) {
      // Ignore malformed hrefs
    }
  });

  // 6. Service Worker Registration for 404 Error Recovery & Offline Support
  if ('serviceWorker' in navigator && window.location.protocol.startsWith('http')) {
    window.addEventListener('load', () => {
      const swPath = resolveAssetPath('sw.js');
      navigator.serviceWorker.register(swPath).catch(() => {
        navigator.serviceWorker.register('/sw.js').catch(() => {});
      });
    });
  }
});


