/* ============================================================
       1. DARK / LIGHT MODE TOGGLE
    ============================================================ */
    const html = document.documentElement;
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon   = document.getElementById('themeIcon');

    // Load saved preference
    const savedTheme = localStorage.getItem('theme') || 'dark';
    html.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    themeToggle.addEventListener('click', () => {
      const current = html.getAttribute('data-theme');
      const next    = current === 'dark' ? 'light' : 'dark';
      html.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
      updateThemeIcon(next);
    });

    function updateThemeIcon(theme) {
      themeIcon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }

    /* ============================================================
       2. NAVBAR SCROLL EFFECT & ACTIVE LINKS
    ============================================================ */
    const navbar = document.getElementById('navbar');

    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 20);
      updateActiveLink();
      toggleBackToTop();
    });

    function updateActiveLink() {
      const sections = document.querySelectorAll('section[id]');
      const scrollPos = window.scrollY + 90;
      sections.forEach(sec => {
        const link = document.querySelector(`.nav-links a[href="#${sec.id}"]`);
        if (!link) return;
        const top = sec.offsetTop;
        const bottom = top + sec.offsetHeight;
        link.classList.toggle('active', scrollPos >= top && scrollPos < bottom);
      });
    }

    /* ============================================================
       3. HAMBURGER MOBILE MENU
    ============================================================ */
    const hamburger   = document.getElementById('hamburger');
    const mobileMenu  = document.getElementById('mobileMenu');

    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      mobileMenu.classList.toggle('open');
    });

    function closeMenu() {
      hamburger.classList.remove('active');
      mobileMenu.classList.remove('open');
    }

    /* Close mobile menu on outside click */
    document.addEventListener('click', (e) => {
      if (!navbar.contains(e.target) && !mobileMenu.contains(e.target)) {
        closeMenu();
      }
    });

    /* ============================================================
       4. TYPING EFFECT — HERO
    ============================================================ */
    const typingEl = document.getElementById('typingText');
    const roles = [
      'MERN Stack Developer',
      'Full Stack Developer',
      'React Developer',
      'Node.js Developer',
      'Problem Solver',
    ];
    let rIdx = 0, cIdx = 0, deleting = false;

    function type() {
      const current = roles[rIdx];
      if (deleting) {
        typingEl.textContent = current.substring(0, --cIdx);
      } else {
        typingEl.textContent = current.substring(0, ++cIdx);
      }

      if (!deleting && cIdx === current.length) {
        // Pause at end, then start deleting
        setTimeout(() => { deleting = true; type(); }, 1800);
        return;
      }
      if (deleting && cIdx === 0) {
        deleting = false;
        rIdx = (rIdx + 1) % roles.length;
      }

      setTimeout(type, deleting ? 60 : 100);
    }
    setTimeout(type, 1000);

    /* ============================================================
       5. INTERSECTION OBSERVER — SCROLL ANIMATIONS
    ============================================================ */
    const fadeEls = document.querySelectorAll('.fade-up, .fade-left, .fade-right');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    fadeEls.forEach(el => observer.observe(el));

    /* ============================================================
       6. SKILL BAR ANIMATION — triggered by Intersection Observer
    ============================================================ */
    const skillSection = document.getElementById('skills');
    let barsAnimated = false;

    const skillObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !barsAnimated) {
        barsAnimated = true;
        document.querySelectorAll('.skill-fill').forEach(bar => {
          const w = bar.getAttribute('data-width');
          setTimeout(() => { bar.style.width = w + '%'; }, 100);
        });
      }
    }, { threshold: 0.2 });

    skillObserver.observe(skillSection);

    /* ============================================================
       7. BACK TO TOP BUTTON
    ============================================================ */
    const backToTop = document.getElementById('backToTop');

    function toggleBackToTop() {
      backToTop.classList.toggle('visible', window.scrollY > 500);
    }

    /* ============================================================
       8. CONTACT FORM VALIDATION
    ============================================================ */
    const form = document.getElementById('contactForm');

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let valid = true;

      // Name
      const name = document.getElementById('fname');
      const nameErr = document.getElementById('fnameErr');
      if (!name.value.trim()) {
        name.classList.add('error');
        nameErr.classList.add('visible');
        valid = false;
      } else {
        name.classList.remove('error');
        nameErr.classList.remove('visible');
      }

      // Email
      const email = document.getElementById('femail');
      const emailErr = document.getElementById('femailErr');
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.value.trim())) {
        email.classList.add('error');
        emailErr.classList.add('visible');
        valid = false;
      } else {
        email.classList.remove('error');
        emailErr.classList.remove('visible');
      }

      // Subject
      const subject = document.getElementById('fsubject');
      const subjectErr = document.getElementById('fsubjectErr');
      if (!subject.value.trim()) {
        subject.classList.add('error');
        subjectErr.classList.add('visible');
        valid = false;
      } else {
        subject.classList.remove('error');
        subjectErr.classList.remove('visible');
      }

      // Message
      const message = document.getElementById('fmessage');
      const messageErr = document.getElementById('fmessageErr');
      if (!message.value.trim()) {
        message.classList.add('error');
        messageErr.classList.add('visible');
        valid = false;
      } else {
        message.classList.remove('error');
        messageErr.classList.remove('visible');
      }

      if (!valid) return;

      const btn = document.getElementById('submitBtn');
      btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
      btn.disabled = true;

      const payload = {
        name: name.value.trim(),
        email: email.value.trim(),
        subject: subject.value.trim(),
        message: message.value.trim(),
      };

      const fallbackMailto = () => {
        const receiver = 'rajputprincesingh536@gmail.com';
        const subjectValue = encodeURIComponent(subject.value.trim());
        const bodyValue = encodeURIComponent(
          `${name.value.trim()}

${message.value.trim()}

Reply to: ${email.value.trim()}`
        );
        const mailtoLink = `mailto:${receiver}?subject=${subjectValue}&body=${bodyValue}`;
        const tempLink = document.createElement('a');
        tempLink.href = mailtoLink;
        tempLink.style.display = 'none';
        document.body.appendChild(tempLink);
        tempLink.click();
        document.body.removeChild(tempLink);
      };

      fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
        .then(response => {
          if (!response.ok) throw new Error('backend');
          return response.json();
        })
        .then(() => {
          showToast('Message sent successfully. Thank you!', 'success');
          form.reset();
        })
        .catch(() => {
          fallbackMailto();
          showToast('Backend unavailable, opening mail app as backup.', 'success');
        })
        .finally(() => {
          btn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
          btn.disabled = false;
        });
    });

    // Remove error on input
    document.querySelectorAll('.form-control').forEach(input => {
      input.addEventListener('input', () => {
        input.classList.remove('error');
        const errId = input.id + 'Err';
        const errEl = document.getElementById(errId);
        if (errEl) errEl.classList.remove('visible');
      });
    });

    /* ============================================================
       9. TOAST NOTIFICATION
    ============================================================ */
    function showToast(msg, type = 'success') {
      const toast    = document.getElementById('toast');
      const toastMsg = document.getElementById('toast-msg');
      const icon     = toast.querySelector('i');

      toastMsg.textContent = msg;
      toast.className = `toast ${type}`;
      icon.className  = type === 'success' ? 'fas fa-check-circle' : 'fas fa-exclamation-circle';

      toast.classList.add('show');
      setTimeout(() => toast.classList.remove('show'), 4000);
    }

    /* ============================================================
       10. SMOOTH SCROLL FOR ALL ANCHOR LINKS
    ============================================================ */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });

    /* ============================================================
       11. STAGGER DELAY for grid children (projects, achievements, social)
    ============================================================ */
    ['projects-grid', 'achievements-grid', 'social-grid'].forEach(cls => {
      document.querySelectorAll(`.${cls} > *`).forEach((el, i) => {
        el.style.transitionDelay = `${i * 0.07}s`;
      });
    });

    /* ============================================================
       12. UPDATE GITHUB STATS THEME ON THEME CHANGE
    ============================================================ */
    function updateGithubTheme() {
      const isDark = html.getAttribute('data-theme') === 'dark';
      const bgColor = isDark ? '0d1117' : 'f0f4ff';
      const textColor = isDark ? 'c9d1d9' : '0d1117';

      document.querySelectorAll('.github-stats-img').forEach(img => {
        img.src = img.src
          .replace(/bg_color=[^&]+/, `bg_color=${bgColor}`)
          .replace(/text_color=[^&]+/, `text_color=${textColor}`)
          .replace(/background=[^&]+/, `background=${bgColor}`);
      });
    }

    themeToggle.addEventListener('click', () => {
      setTimeout(updateGithubTheme, 100);
    });

    /* ============================================================
       13. INITIAL ACTIVE LINK
    ============================================================ */
    updateActiveLink();
