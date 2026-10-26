/**
 * Aleandro Giancana — Autobiografia & Vetrina Professionale
 * Interazioni minimaliste: lettura, navigazione, capitoli, FAQ, lightbox e DM Instagram
 */

(function () {
  'use strict';

  const INSTAGRAM_URL = 'https://www.instagram.com/aleandrogiancana/';

  // 1. Dynamic Year
  const yearSpan = document.getElementById('yearSpan');
  if (yearSpan) {
    yearSpan.textContent = String(new Date().getFullYear());
  }

  // 2. Scroll Progress, Sticky Header & Floating Instagram Pill
  const readingProgress = document.getElementById('readingProgress');
  const siteHeader = document.getElementById('siteHeader');
  const floatingIgBar = document.getElementById('floatingIgBar');
  const contactSection = document.getElementById('contatto');

  function handleScrollUI() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;

    if (readingProgress && docHeight > 0) {
      const pct = Math.min(100, Math.max(0, (scrollTop / docHeight) * 100));
      readingProgress.style.width = pct.toFixed(2) + '%';
    }

    if (siteHeader) {
      siteHeader.classList.toggle('is-scrolled', scrollTop > 18);
    }

    if (floatingIgBar) {
      let inContactZone = false;
      if (contactSection) {
        const rect = contactSection.getBoundingClientRect();
        inContactZone = rect.top < window.innerHeight * 0.78 && rect.bottom > 100;
      }
      const shouldShow = scrollTop > 420 && !inContactZone;
      floatingIgBar.classList.toggle('is-visible', shouldShow);
    }
  }

  window.addEventListener('scroll', handleScrollUI, { passive: true });
  handleScrollUI();

  // 3. Mobile Navigation Drawer
  const navToggle = document.getElementById('navToggle');
  const siteNav = document.getElementById('siteNav');

  function closeMobileNav() {
    if (!navToggle || !siteNav) return;
    navToggle.setAttribute('aria-expanded', 'false');
    siteNav.classList.remove('is-open');
  }

  if (navToggle && siteNav) {
    navToggle.addEventListener('click', function () {
      const expanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!expanded));
      siteNav.classList.toggle('is-open', !expanded);
    });

    siteNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeMobileNav);
    });
  }

  // 4. Reveal on Scroll (IntersectionObserver with instant fallback)
  const revealElements = document.querySelectorAll('.reveal, .reveal-delay');
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    revealElements.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    revealElements.forEach(function (el) {
      el.classList.add('in-view');
    });
  }

  // 5. Sticky Chapter Rail Active Tracking
  const railLinks = document.querySelectorAll('.rail-link');
  const chapterCards = document.querySelectorAll('.chapter-card[id]');

  if ('IntersectionObserver' in window && railLinks.length && chapterCards.length) {
    const chapterObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            const activeId = '#' + entry.target.id;
            railLinks.forEach(function (link) {
              link.classList.toggle('active', link.getAttribute('href') === activeId);
            });
          }
        });
      },
      { rootMargin: '-28% 0px -55% 0px', threshold: 0 }
    );

    chapterCards.forEach(function (card) {
      chapterObserver.observe(card);
    });
  }

  // 6. Accessible FAQ Accordion
  const accordionTriggers = document.querySelectorAll('.accordion-trigger');

  accordionTriggers.forEach(function (trigger) {
    trigger.addEventListener('click', function () {
      const isExpanded = trigger.getAttribute('aria-expanded') === 'true';
      const panel = trigger.nextElementSibling;

      // Close other panels smoothly
      accordionTriggers.forEach(function (other) {
        if (other !== trigger) {
          other.setAttribute('aria-expanded', 'false');
          const otherPanel = other.nextElementSibling;
          if (otherPanel) {
            otherPanel.style.maxHeight = null;
          }
        }
      });

      trigger.setAttribute('aria-expanded', String(!isExpanded));
      if (panel) {
        if (!isExpanded) {
          panel.style.maxHeight = panel.scrollHeight + 24 + 'px';
        } else {
          panel.style.maxHeight = null;
        }
      }
    });
  });

  // 7. Interactive Quick DM Composer (@aleandrogiancana)
  const presetChips = document.querySelectorAll('.preset-chip');
  const dmTextarea = document.getElementById('dmTextarea');
  const copyOpenIgBtn = document.getElementById('copyOpenIgBtn');
  const composerFeedback = document.getElementById('composerFeedback');

  presetChips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      presetChips.forEach(function (c) {
        c.classList.remove('active');
      });
      chip.classList.add('active');
      const msg = chip.getAttribute('data-msg');
      if (dmTextarea && msg) {
        dmTextarea.value = msg;
      }
      if (composerFeedback) {
        composerFeedback.textContent = '';
      }
    });
  });

  function copyTextToClipboard(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    }
    return new Promise(function (resolve) {
      const temp = document.createElement('textarea');
      temp.value = text;
      temp.setAttribute('readonly', '');
      temp.style.position = 'fixed';
      temp.style.opacity = '0';
      document.body.appendChild(temp);
      temp.select();
      try {
        document.execCommand('copy');
      } catch (_) {
        // Ignore clipboard fallback errors
      }
      document.body.removeChild(temp);
      resolve();
    });
  }

  if (copyOpenIgBtn && dmTextarea) {
    copyOpenIgBtn.addEventListener('click', function () {
      const message = dmTextarea.value.trim();
      copyTextToClipboard(message).then(function () {
        if (composerFeedback) {
          composerFeedback.textContent = '✓ Messaggio copiato! Incollalo ora nella chat di @aleandrogiancana.';
        }
        window.open(INSTAGRAM_URL, '_blank', 'noopener,noreferrer');
      });
    });
  }

  // 8. Minimalist Image Lightbox
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxOverlay = document.getElementById('lightboxOverlay');
  const zoomableImages = document.querySelectorAll('.zoomable-img');

  function openLightbox(src, alt, caption) {
    if (!lightbox || !lightboxImg) return;
    lightboxImg.src = src;
    lightboxImg.alt = alt || '';
    if (lightboxCaption) {
      lightboxCaption.textContent = caption || alt || '';
    }
    lightbox.hidden = false;
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!lightbox || lightbox.hidden) return;
    lightbox.hidden = true;
    if (lightboxImg) lightboxImg.src = '';
    document.body.style.overflow = '';
  }

  zoomableImages.forEach(function (img) {
    img.addEventListener('click', function () {
      openLightbox(
        img.getAttribute('src'),
        img.getAttribute('alt'),
        img.getAttribute('data-caption')
      );
    });
  });

  document.querySelectorAll('.photo-expand-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const parent = btn.parentElement;
      const img = parent ? parent.querySelector('.zoomable-img') : null;
      if (img) {
        openLightbox(
          img.getAttribute('src'),
          img.getAttribute('alt'),
          img.getAttribute('data-caption')
        );
      }
    });
  });

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxOverlay) lightboxOverlay.addEventListener('click', closeLightbox);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      closeLightbox();
      closeMobileNav();
    }
  });
})();
