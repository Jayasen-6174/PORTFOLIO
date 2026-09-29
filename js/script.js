/* ===================================================================
   JAYA SEN - PORTFOLIO INTERACTIVITY SCRIPT
   External JavaScript File: js/script.js
   Theme toggle, dynamic typing, scroll animations, playable demo,
   clipboard copy, project filters, and stats counter.
   =================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  if (window.__portfolioScriptLoaded) return;
  window.__portfolioScriptLoaded = true;

  // 1. Theme Toggle (Dark & Light Mode)
  initThemeToggle();

  // 2. Mobile Navigation Toggle
  initMobileNav();

  // 3. Dynamic Typewriter Effect in Hero
  initTypewriter();

  // 4. Navbar Sticky / Scrollspy
  initScrollspy();

  // 5. Animated Counters
  initStatsCounter();

  // 6. Project Filters
  initProjectFilters();

  // 7. Interactive Playable Number Guessing Game (Modal)
  initGuessingGame();

  // 8. Contact Form & Quick Copy
  initContactFeatures();

  // 9. Scroll to Top
  initScrollToTop();
});

/* -------------------------------------------------------------------
   1. Theme Toggle
------------------------------------------------------------------- */
function initThemeToggle() {
  const toggleBtn = document.getElementById('theme-toggle-btn');
  const themeIcon = toggleBtn ? toggleBtn.querySelector('i') : null;
  const currentTheme = localStorage.getItem('theme') || 'dark';

  document.documentElement.setAttribute('data-theme', currentTheme);
  updateThemeIcon(currentTheme);

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const activeTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = activeTheme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      updateThemeIcon(newTheme);
    });
  }

  function updateThemeIcon(theme) {
    if (!themeIcon) return;
    if (theme === 'light') {
      themeIcon.className = 'fa-solid fa-moon';
      toggleBtn.setAttribute('title', 'Switch to Dark Mode');
      toggleBtn.setAttribute('aria-label', 'Switch to Dark Mode');
    } else {
      themeIcon.className = 'fa-solid fa-sun';
      toggleBtn.setAttribute('title', 'Switch to Light Mode');
      toggleBtn.setAttribute('aria-label', 'Switch to Light Mode');
    }
  }
}

/* -------------------------------------------------------------------
   2. Mobile Navigation Menu
------------------------------------------------------------------- */
function initMobileNav() {
  const menuToggle = document.getElementById('menu-toggle-btn');
  const navLinks = document.getElementById('nav-links');

  if (!menuToggle || !navLinks) return;

  menuToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    menuToggle.querySelector('i').className = isOpen ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
  });

  // Close menu when a navigation link is clicked
  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      menuToggle.querySelector('i').className = 'fa-solid fa-bars';
    });
  });

  // Close when clicking outside
  document.addEventListener('click', (e) => {
    if (!navLinks.contains(e.target) && !menuToggle.contains(e.target) && navLinks.classList.contains('open')) {
      navLinks.classList.remove('open');
      menuToggle.querySelector('i').className = 'fa-solid fa-bars';
    }
  });
}

/* -------------------------------------------------------------------
   3. Dynamic Typewriter Effect
------------------------------------------------------------------- */
function initTypewriter() {
  const textEl = document.getElementById('typewriter-text');
  if (!textEl) return;

  const roles = [
    'Python Full Stack Developer',
    'Django & REST API Specialist',
    'Software Developer',
    'Frontend & Web Creator',
    'Generative AI Trained Developer'
  ];

  let roleIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  const typeSpeed = 90;
  const deleteSpeed = 45;
  const delayBetweenWords = 1800;

  function type() {
    const currentRole = roles[roleIdx];

    if (isDeleting) {
      textEl.textContent = currentRole.substring(0, charIdx - 1);
      charIdx--;
    } else {
      textEl.textContent = currentRole.substring(0, charIdx + 1);
      charIdx++;
    }

    let currentSpeed = isDeleting ? deleteSpeed : typeSpeed;

    if (!isDeleting && charIdx === currentRole.length) {
      currentSpeed = delayBetweenWords;
      isDeleting = true;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      roleIdx = (roleIdx + 1) % roles.length;
      currentSpeed = 350;
    }

    setTimeout(type, currentSpeed);
  }

  type();
}

/* -------------------------------------------------------------------
   4. Scrollspy & Sticky Navbar
------------------------------------------------------------------- */
function initScrollspy() {
  const navbar = document.getElementById('navbar');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;

    // Navbar background
    if (navbar) {
      if (scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }

    // Active link highlighting
    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  });
}

/* -------------------------------------------------------------------
   5. Animated Stats Counter
------------------------------------------------------------------- */
function initStatsCounter() {
  const statNumbers = document.querySelectorAll('.stat-number');
  let started = false;

  function startCount() {
    statNumbers.forEach(stat => {
      const target = +stat.getAttribute('data-target');
      const suffix = stat.getAttribute('data-suffix') || '';
      let count = 0;
      const speed = target > 10 ? 30 : 60;
      const increment = Math.ceil(target / (1000 / speed)) || 1;

      const timer = setInterval(() => {
        count += increment;
        if (count >= target) {
          count = target;
          stat.textContent = count + suffix;
          clearInterval(timer);
        } else {
          stat.textContent = count + suffix;
        }
      }, speed);
    });
  }

  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !started) {
      startCount();
      started = true;
    }
  }, { threshold: 0.5 });

  const statsStrip = document.getElementById('stats-strip');
  if (statsStrip) {
    observer.observe(statsStrip);
  }
}

/* -------------------------------------------------------------------
   6. Project Category Filters
------------------------------------------------------------------- */
function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'flex';
          card.style.opacity = '0';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transition = 'opacity 0.4s ease';
          }, 20);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* -------------------------------------------------------------------
   7. Playable Guessing Number Game (Modal)
------------------------------------------------------------------- */
function initGuessingGame() {
  const openBtn = document.getElementById('open-game-demo-btn');
  const modalOverlay = document.getElementById('game-modal-overlay');
  const closeBtn = document.getElementById('close-game-modal');
  const guessInput = document.getElementById('player-guess-input');
  const submitBtn = document.getElementById('submit-guess-btn');
  const feedbackEl = document.getElementById('game-feedback-msg');
  const resetBtn = document.getElementById('reset-game-btn');
  const attemptsEl = document.getElementById('game-attempts-count');
  const bestScoreEl = document.getElementById('game-best-score');

  let secretNumber = generateRandomNumber();
  let attempts = 0;
  let gameOver = false;
  let bestScore = localStorage.getItem('guessing_game_best') || '-';

  if (bestScoreEl) {
    bestScoreEl.textContent = bestScore;
  }

  function generateRandomNumber() {
    return Math.floor(Math.random() * 100) + 1;
  }

  function openModal() {
    if (modalOverlay) {
      modalOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
      if (guessInput) {
        guessInput.value = '';
        guessInput.focus();
      }
    }
  }

  function closeModal() {
    if (modalOverlay) {
      modalOverlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  function handleGuess() {
    if (gameOver || !guessInput) return;

    const userGuess = parseInt(guessInput.value, 10);

    if (isNaN(userGuess) || userGuess < 1 || userGuess > 100) {
      feedbackEl.textContent = '⚠️ Please enter a number between 1 and 100.';
      feedbackEl.style.color = '#f59e0b';
      return;
    }

    attempts++;
    if (attemptsEl) attemptsEl.textContent = attempts;

    if (userGuess === secretNumber) {
      gameOver = true;
      feedbackEl.innerHTML = `🎉 Correct! You found <strong>${secretNumber}</strong> in ${attempts} ${attempts === 1 ? 'try' : 'tries'}!`;
      feedbackEl.style.color = '#10b981';

      if (bestScore === '-' || attempts < parseInt(bestScore, 10)) {
        bestScore = attempts;
        localStorage.setItem('guessing_game_best', bestScore);
        if (bestScoreEl) bestScoreEl.textContent = bestScore;
      }
    } else if (userGuess > secretNumber) {
      feedbackEl.textContent = '📉 Too High! Try a smaller number.';
      feedbackEl.style.color = '#38bdf8';
    } else {
      feedbackEl.textContent = '📈 Too Low! Try a bigger number.';
      feedbackEl.style.color = '#a855f7';
    }

    guessInput.value = '';
    guessInput.focus();
  }

  function resetGame() {
    secretNumber = generateRandomNumber();
    attempts = 0;
    gameOver = false;
    if (attemptsEl) attemptsEl.textContent = '0';
    if (feedbackEl) {
      feedbackEl.textContent = 'Game reset! Start guessing...';
      feedbackEl.style.color = 'var(--text-secondary)';
    }
    if (guessInput) {
      guessInput.value = '';
      guessInput.focus();
    }
  }

  if (openBtn) openBtn.addEventListener('click', openModal);
  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (submitBtn) submitBtn.addEventListener('click', handleGuess);
  if (resetBtn) resetBtn.addEventListener('click', resetGame);

  if (guessInput) {
    guessInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        handleGuess();
      }
    });
  }

  // Close on outside click
  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        closeModal();
      }
    });
  }

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay && modalOverlay.classList.contains('active')) {
      closeModal();
    }
  });
}

/* -------------------------------------------------------------------
   8. Contact Features (Form & Copy to Clipboard)
------------------------------------------------------------------- */
function initContactFeatures() {
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('contact-name').value.trim();
      const email = document.getElementById('contact-email').value.trim();
      const message = document.getElementById('contact-message').value.trim();

      if (!name || !email || !message) {
        showToast('Please fill in all required fields.', 'error');
        return;
      }

      // Simulate sending
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';
      submitBtn.disabled = true;

      setTimeout(() => {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        contactForm.reset();

        if (formStatus) {
          formStatus.textContent = '✨ Thank you! Your message has been sent successfully.';
          formStatus.classList.add('success');
          setTimeout(() => {
            formStatus.classList.remove('success');
            formStatus.textContent = '';
          }, 6000);
        }

        showToast('Message sent! Jaya will get back to you soon.');
      }, 900);
    });
  }

  // Copy Buttons
  document.querySelectorAll('.copy-trigger').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const textToCopy = btn.getAttribute('data-copy-text');
      if (textToCopy) {
        navigator.clipboard.writeText(textToCopy).then(() => {
          showToast(`Copied "${textToCopy}" to clipboard!`);
        }).catch(() => {
          showToast('Failed to copy. Please copy manually.');
        });
      }
    });
  });
}

/* -------------------------------------------------------------------
   Helper: Toast Notification
------------------------------------------------------------------- */
function showToast(message, type = 'success') {
  let toast = document.getElementById('toast-notice');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast-notice';
    toast.className = 'toast-notice';
    document.body.appendChild(toast);
  }

  const icon = type === 'error' ? 'fa-triangle-exclamation' : 'fa-circle-check';
  toast.innerHTML = `<i class="fa-solid ${icon}"></i> <span>${message}</span>`;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3500);
}

/* -------------------------------------------------------------------
   9. Scroll to Top
------------------------------------------------------------------- */
function initScrollToTop() {
  const scrollBtn = document.getElementById('scroll-top-btn');
  if (!scrollBtn) return;

  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 400) {
      scrollBtn.classList.add('visible');
    } else {
      scrollBtn.classList.remove('visible');
    }
  });

  scrollBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}
