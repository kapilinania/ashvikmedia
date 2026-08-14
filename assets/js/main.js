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
  });


