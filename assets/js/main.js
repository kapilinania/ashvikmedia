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
          customProposalBtn.href = `contact.html?custom_package=true&total=${total}`;
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
          const name = document.getElementById('cbName').value;
          const phone = document.getElementById('cbPhone').value;

          const modalCard = overlay.querySelector('.callback-modal-card');
          if (modalCard) {
            modalCard.innerHTML = `
              <div style="text-align: center; padding: 1rem 0;">
                <div style="width: 60px; height: 60px; border-radius: 50%; background: var(--primary-gold); color: #0A0C10; display: flex; align-items: center; justify-content: center; font-size: 1.75rem; margin: 0 auto 1.25rem; box-shadow: 0 0 20px rgba(255,199,0,0.4);">
                  <i class="fa-solid fa-check"></i>
                </div>
                <h3 style="font-size: 1.4rem; font-weight: 800; color: #FFFFFF; margin-bottom: 0.5rem;">Request Submitted!</h3>
                <p style="color: #94A3B8; font-size: 0.88rem; line-height: 1.5; margin-bottom: 1.25rem;">Thank you, <strong>${name}</strong>. Our growth team will call you shortly on <strong>${phone}</strong>.</p>
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
            <a href="https://instagram.com/ashvikmedia" target="_blank" rel="noopener noreferrer" class="floating-action-btn btn-instagram" aria-label="Follow on Instagram">
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

  const budget = parseInt(budgetRange.value, 10);
  budgetVal.innerText = '₹' + budget.toLocaleString('en-IN');

  const activePlatBtn = document.querySelector('.calc-platform-btn.active');
  const platform = activePlatBtn ? activePlatBtn.dataset.platform : 'instagram';
  const objective = document.getElementById('calcObjective')?.value || 'sales';

  // Multipliers based on platform & objective
  let multReach = 7.4;
  let multViews = 16.8;
  let multConv = 0.035;
  let roasVal = '5.2X';

  if (platform === 'google') { multReach = 8.5; multViews = 20.0; multConv = 0.042; roasVal = '6.4X'; }
  else if (platform === 'meta') { multReach = 6.5; multViews = 12.0; multConv = 0.048; roasVal = '4.8X'; }
  else if (platform === 'youtube') { multReach = 5.8; multViews = 10.5; multConv = 0.040; roasVal = '5.0X'; }
  else if (platform === 'linkedin') { multReach = 3.2; multViews = 6.0; multConv = 0.065; roasVal = '7.1X'; }

  if (objective === 'viral') { multReach *= 1.5; multViews *= 1.8; multConv *= 0.6; }
  else if (objective === 'leads') { multReach *= 0.8; multConv *= 1.4; }

  const reach = Math.round(budget * multReach);
  const views = Math.round(budget * multViews);
  const convMin = Math.round(budget * multConv * 0.8);
  const convMax = Math.round(budget * multConv * 1.2);

  document.getElementById('resReach').innerText = reach.toLocaleString('en-IN') + '+';
  document.getElementById('resViews').innerText = views.toLocaleString('en-IN') + '+';
  document.getElementById('resConversions').innerText = convMin + ' - ' + convMax;
  document.getElementById('resROI').innerText = roasVal;

  const maxBudget = 250000;
  const pct = Math.min(100, Math.max(20, Math.round((budget / maxBudget) * 100)));
  const barReach = document.getElementById('barReach');
  const barViews = document.getElementById('barViews');
  const barConversions = document.getElementById('barConversions');
  if (barReach) barReach.style.width = pct + '%';
  if (barViews) barViews.style.width = Math.min(100, pct + 15) + '%';
  if (barConversions) barConversions.style.width = Math.min(100, pct + 10) + '%';
};

// Platform Selection Buttons
document.addEventListener('DOMContentLoaded', () => {
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
});


/* ==========================================================================
   E-COMMERCE STORE ENGINE (Products, Cart, WhatsApp Checkout, LocalStorage Order History)
   ========================================================================== */
const ecomProducts = [
  {
    id: 'p1',
    title: 'Shopify E-Com Scaling Blueprint Theme',
    category: 'shopify',
    price: 4999,
    originalPrice: 9999,
    rating: 5.0,
    reviews: 48,
    badge: 'BESTSELLER',
    icon: 'fa-bag-shopping',
    desc: 'High-converting custom Shopify theme loaded with sticky add-to-cart, countdown timers, up-sell slide drawer, and 0.9s load speed.'
  },
  {
    id: 'p2',
    title: 'Amazon A+ Content & Brand Store Kit',
    category: 'amazon',
    price: 7999,
    originalPrice: 14999,
    rating: 4.9,
    reviews: 62,
    badge: 'HOT',
    icon: 'fa-amazon',
    desc: '7 Premium module Amazon A+ EBC visual designs, keyword-rich listing copy, and storefront banners built for 3.2X higher sales.'
  },
  {
    id: 'p3',
    title: 'Complete D2C E-Commerce Growth Bundle',
    category: 'scaling',
    price: 24999,
    originalPrice: 45000,
    rating: 5.0,
    reviews: 89,
    badge: 'FEATURED BUNDLE',
    icon: 'fa-chart-line',
    desc: 'Full suite solution: Shopify Store Build + Meta/Google Ad Creatives + 20 Viral Short Video Hooks + WhatsApp Order Automation.'
  },
  {
    id: 'p4',
    title: 'High-Conversion Checkout & CRO Audit Pack',
    category: 'cro',
    price: 6499,
    originalPrice: 11999,
    rating: 4.8,
    reviews: 31,
    badge: 'POPULAR',
    icon: 'fa-bolt',
    desc: 'Full UI/UX audit of your checkout funnel, cart abandonment recovery email templates, and speed optimization checklist.'
  },
  {
    id: 'p5',
    title: 'Shopify Custom Subscription Store Template',
    category: 'shopify',
    price: 8999,
    originalPrice: 16999,
    rating: 4.9,
    reviews: 24,
    badge: 'NEW',
    icon: 'fa-repeat',
    desc: 'Specialized layout for recurring subscription products, box delivery, customer portal, and tiered loyalty rewards.'
  },
  {
    id: 'p6',
    title: 'E-Commerce Performance Marketing Toolkit',
    category: 'scaling',
    price: 12999,
    originalPrice: 22000,
    rating: 5.0,
    reviews: 57,
    badge: 'PRO TOOLKIT',
    icon: 'fa-bullseye',
    desc: 'Meta & Google Ads audience targeting templates, high-ROAS ad copies, UTM tracking sheet, and retargeting workflows.'
  }
];

let cart = JSON.parse(localStorage.getItem('ashvik_cart')) || [];
let appliedDiscountPct = 0;

window.renderProducts = function(items = ecomProducts) {
  const grid = document.getElementById('productGrid');
  if (!grid) return;

  if (items.length === 0) {
    grid.innerHTML = `<div style="grid-column:1/-1; text-align:center; padding:3rem; color:var(--text-dark-secondary);">No products matching your search query or filter.</div>`;
    return;
  }

  grid.innerHTML = items.map(p => `
    <div class="product-card">
      ${p.badge ? `<div class="product-badge-tag">${p.badge}</div>` : ''}
      <div class="product-img-box">
        <i class="fa-brands ${p.icon.startsWith('fa-amazon') ? 'fa-amazon' : 'fa-solid ' + p.icon}"></i>
      </div>
      <div class="product-content">
        <div class="product-cat">${p.category.toUpperCase()}</div>
        <h3 class="product-title">${p.title}</h3>
        <div class="product-rating">
          <i class="fa-solid fa-star"></i>
          <i class="fa-solid fa-star"></i>
          <i class="fa-solid fa-star"></i>
          <i class="fa-solid fa-star"></i>
          <i class="fa-solid fa-star"></i>
          <span style="color:var(--text-dark-secondary); margin-left:0.3rem;">(${p.rating} / ${p.reviews} reviews)</span>
        </div>
        <p class="product-desc">${p.desc}</p>

        <div class="product-price-row">
          <span class="price-current">₹${p.price.toLocaleString('en-IN')}</span>
          <span class="price-original">₹${p.originalPrice.toLocaleString('en-IN')}</span>
        </div>

        <div class="product-actions">
          <button class="btn btn-gold" style="flex-grow:1; font-size:0.85rem;" onclick="addToCart('${p.id}')">
            <i class="fa-solid fa-cart-plus"></i> Add To Cart
          </button>
          <button class="btn btn-dark-outline" style="padding:0.6rem 0.8rem;" onclick="openQuickView('${p.id}')" title="Quick View">
            <i class="fa-solid fa-eye"></i>
          </button>
        </div>
      </div>
    </div>
  `).join('');
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

  if (sortVal === 'price-low') filtered.sort((a,b) => a.price - b.price);
  else if (sortVal === 'price-high') filtered.sort((a,b) => b.price - a.price);
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

window.applyPromoCode = function() {
  const code = document.getElementById('promoInput')?.value.trim().toUpperCase();
  if (code === 'ASHVIK10') {
    appliedDiscountPct = 0.10;
    alert('🎉 Promo Code ASHVIK10 Applied! 10% Discount calculated.');
  } else {
    alert('Invalid promo code. Try "ASHVIK10" for 10% off!');
    appliedDiscountPct = 0;
  }
  window.updateCartUI();
};

window.updateCartUI = function() {
  const countBadges = document.querySelectorAll('#cartCountBadge, #cartHeaderCount');
  const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
  countBadges.forEach(b => b.innerText = totalQty);

  const body = document.getElementById('cartDrawerBody');
  if (!body) return;

  if (cart.length === 0) {
    body.innerHTML = `
      <div style="text-align:center; padding:3rem 1rem; color:var(--text-dark-secondary);">
        <i class="fa-solid fa-cart-shopping" style="font-size:3rem; color:var(--dark-border); margin-bottom:1rem;"></i>
        <p>Your cart is empty.</p>
        <button class="btn btn-gold" style="margin-top:1rem;" onclick="toggleCartDrawer()">Browse Store</button>
      </div>
    `;
    document.getElementById('cartSubtotalVal').innerText = '₹0';
    document.getElementById('cartTotalVal').innerText = '₹0';
    document.getElementById('discountRow').style.display = 'none';
    return;
  }

  body.innerHTML = cart.map((item, idx) => `
    <div class="cart-item">
      <div class="cart-item-icon"><i class="fa-solid ${item.icon}"></i></div>
      <div class="cart-item-info">
        <div class="cart-item-title">${item.title}</div>
        <div class="cart-item-price">₹${item.price.toLocaleString('en-IN')}</div>
        <div class="cart-qty-ctrl">
          <button class="qty-btn" onclick="changeQty(${idx}, -1)">-</button>
          <span style="font-size:0.85rem; color:#FFF; min-width:16px; text-align:center;">${item.qty}</span>
          <button class="qty-btn" onclick="changeQty(${idx}, 1)">+</button>
        </div>
      </div>
      <button class="cart-item-remove" onclick="removeFromCart(${idx})" title="Remove"><i class="fa-solid fa-trash"></i></button>
    </div>
  `).join('');

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const discountAmt = subtotal * appliedDiscountPct;
  const total = subtotal - discountAmt;

  document.getElementById('cartSubtotalVal').innerText = '₹' + subtotal.toLocaleString('en-IN');
  if (appliedDiscountPct > 0) {
    document.getElementById('discountRow').style.display = 'flex';
    document.getElementById('cartDiscountVal').innerText = '-₹' + discountAmt.toLocaleString('en-IN');
  } else {
    document.getElementById('discountRow').style.display = 'none';
  }
  document.getElementById('cartTotalVal').innerText = '₹' + total.toLocaleString('en-IN');
};

// WhatsApp Direct Checkout & LocalStorage Order Persistence
window.executeWhatsAppCheckout = function() {
  if (cart.length === 0) {
    alert('Your cart is empty! Please add products before checking out.');
    return;
  }

  const name = document.getElementById('custName')?.value.trim() || 'Valued Customer';
  const phone = document.getElementById('custPhone')?.value.trim() || 'Not Provided';
  const note = document.getElementById('custNote')?.value.trim() || 'N/A';

  const orderId = '#AM-' + Math.floor(10000 + Math.random() * 90000);
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const discountAmt = subtotal * appliedDiscountPct;
  const total = subtotal - discountAmt;
  const dateStr = new Date().toLocaleString();

  let message = `🛒 *NEW E-COMMERCE STORE ORDER - ASHVIK MEDIA*\n`;
  message += `----------------------------------\n`;
  message += `*Order ID:* ${orderId}\n`;
  message += `*Date:* ${dateStr}\n\n`;
  message += `*Customer Details:*\n`;
  message += `• Name: ${name}\n`;
  message += `• WhatsApp Phone: ${phone}\n`;
  message += `• Notes / Requirements: ${note}\n\n`;
  message += `*Order Items:*\n`;

  cart.forEach((item, i) => {
    message += `${i+1}. ${item.title} (x${item.qty}) - ₹${(item.price * item.qty).toLocaleString('en-IN')}\n`;
  });

  message += `\n----------------------------------\n`;
  message += `*Subtotal:* ₹${subtotal.toLocaleString('en-IN')}\n`;
  if (appliedDiscountPct > 0) {
    message += `*Discount (ASHVIK10):* -₹${discountAmt.toLocaleString('en-IN')}\n`;
  }
  message += `*Total Amount:* ₹${total.toLocaleString('en-IN')}\n`;
  message += `----------------------------------\n`;
  message += `Thank you! Please confirm my order placement.`;

  // 1. Save to LocalStorage order history
  const orders = JSON.parse(localStorage.getItem('ashvik_orders')) || [];
  const newOrder = {
    id: orderId,
    date: dateStr,
    name: name,
    phone: phone,
    items: [...cart],
    total: total,
    status: 'Sent to WhatsApp'
  };
  orders.unshift(newOrder);
  localStorage.setItem('ashvik_orders', JSON.stringify(orders));

  // 2. Clear Cart
  cart = [];
  localStorage.removeItem('ashvik_cart');
  window.updateCartUI();
  window.updateOrderCountBadge();

  // 3. Open WhatsApp link
  const waUrl = `https://wa.me/919993515138?text=${encodeURIComponent(message)}`;
  window.open(waUrl, '_blank');
  window.toggleCartDrawer();
  alert(`Order ${orderId} saved to local storage and redirected to WhatsApp!`);
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
      <div style="text-align:center; padding:2rem; color:var(--text-dark-secondary);">
        <i class="fa-solid fa-clock-rotate-left" style="font-size:2.5rem; color:var(--dark-border); margin-bottom:1rem;"></i>
        <p>No previous order history found in local storage.</p>
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
      <div style="font-size:0.78rem; color:var(--text-dark-muted); margin-bottom:0.4rem;">Placed on: ${o.date}</div>
      <div class="oh-items">
        ${o.items.map(it => `<div>• ${it.title} (x${it.qty}) - ₹${(it.price * it.qty).toLocaleString('en-IN')}</div>`).join('')}
      </div>
      <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid var(--dark-border); padding-top:0.6rem;">
        <span style="font-weight:800; color:var(--primary-gold);">Total Paid: ₹${o.total.toLocaleString('en-IN')}</span>
        <a href="https://wa.me/919993515138?text=Hi%20Ashvik%20Media,%20I'm%20inquiring%20about%20my%20order%20${o.id}" target="_blank" class="btn btn-gold" style="padding:0.3rem 0.8rem; font-size:0.75rem;">
          Track / Re-Order <i class="fa-brands fa-whatsapp"></i>
        </a>
      </div>
    </div>
  `).join('');
};

window.clearOrderHistory = function() {
  if (confirm('Are you sure you want to clear all order history from LocalStorage?')) {
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
    title.innerText = item.title;
    body.innerHTML = `
      <div style="display:flex; gap:1.5rem; flex-wrap:wrap; align-items:center;">
        <div style="width:120px; height:120px; background:#181E29; border-radius:var(--radius-md); display:flex; align-items:center; justify-content:center; font-size:3rem; color:var(--primary-gold);">
          <i class="fa-solid ${item.icon}"></i>
        </div>
        <div style="flex-grow:1;">
          <div class="product-cat">${item.category}</div>
          <div style="font-size:1.8rem; font-weight:800; color:var(--primary-gold); margin:0.4rem 0;">₹${item.price.toLocaleString('en-IN')} <span style="font-size:1rem; color:var(--text-dark-muted); text-decoration:line-through;">₹${item.originalPrice.toLocaleString('en-IN')}</span></div>
          <p style="font-size:0.9rem; color:var(--text-dark-secondary); line-height:1.5;">${item.desc}</p>
          <button class="btn btn-gold" style="margin-top:1.2rem; width:100%;" onclick="addToCart('${item.id}'); closeQuickView();">
            ADD TO CART & CHECKOUT VIA WHATSAPP <i class="fa-solid fa-cart-plus"></i>
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






