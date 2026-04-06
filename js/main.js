document.addEventListener('DOMContentLoaded', () => {

  // ===========================
  // Header scroll effect
  // ===========================
  const header = document.getElementById('siteHeader');

  const handleScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 50);
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // ===========================
  // Mobile menu
  // ===========================
  const hamburger = document.getElementById('hamburger');
  const mainNav = document.getElementById('mainNav');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    mainNav.classList.toggle('open');
    document.body.style.overflow = mainNav.classList.contains('open') ? 'hidden' : '';
  });

  mainNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      mainNav.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // ===========================
  // Scroll reveal (IntersectionObserver)
  // ===========================
  const reveals = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  );

  reveals.forEach(el => revealObserver.observe(el));

  // ===========================
  // Counter animation for stats
  // ===========================
  const statNumbers = document.querySelectorAll('.stat-number[data-target]');

  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  statNumbers.forEach(el => counterObserver.observe(el));

  function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    const duration = 2000;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target);
      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = target;
      }
    }

    requestAnimationFrame(update);
  }

  // ===========================
  // Hero particles
  // ===========================
  const particleContainer = document.getElementById('heroParticles');
  const particleCount = 40;

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.top = Math.random() * 100 + '%';
    particle.style.setProperty('--duration', (3 + Math.random() * 5) + 's');
    particle.style.setProperty('--delay', (Math.random() * 5) + 's');
    particle.style.setProperty('--max-opacity', (0.15 + Math.random() * 0.35).toString());
    particle.style.setProperty('--tx', (Math.random() * 40 - 20) + 'px');
    particle.style.setProperty('--ty', (Math.random() * -40 - 10) + 'px');

    const size = 1 + Math.random() * 2;
    particle.style.width = size + 'px';
    particle.style.height = size + 'px';

    particleContainer.appendChild(particle);
  }

  // ===========================
  // Smooth anchor scrolling
  // ===========================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const headerOffset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-height'), 10) || 72;
        const top = target.getBoundingClientRect().top + window.scrollY - headerOffset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ===========================
  // Dashboard bar animation on scroll
  // ===========================
  const dashMock = document.querySelector('.dashboard-mock');
  if (dashMock) {
    const dashObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            dashMock.classList.add('animate');
            dashObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );
    dashObserver.observe(dashMock);
  }

  // ===========================
  // Robot SVG hover parallax
  // ===========================
  document.querySelectorAll('.robot-visual').forEach(visual => {
    visual.addEventListener('mousemove', (e) => {
      const rect = visual.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      const svg = visual.querySelector('.robot-svg');
      if (svg) {
        svg.style.transform = `perspective(600px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg)`;
      }
    });

    visual.addEventListener('mouseleave', () => {
      const svg = visual.querySelector('.robot-svg');
      if (svg) {
        svg.style.transition = 'transform 0.5s ease';
        svg.style.transform = 'perspective(600px) rotateY(0) rotateX(0)';
        setTimeout(() => { svg.style.transition = ''; }, 500);
      }
    });
  });

  // ===========================
  // Contact Modal Logic
  // ===========================
  const contactModal = document.getElementById('contactModal');
  const closeModalBtn = document.getElementById('closeModal');
  const contactForm = document.getElementById('contactForm');
  const openContactBtns = document.querySelectorAll('.js-open-contact');

  if (contactModal && contactForm) {
    // Open modal
    openContactBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        contactModal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
      });
    });

    // Close modal
    const closeModal = () => {
      contactModal.classList.remove('active');
      document.body.style.overflow = '';
      // Reset form and errors
      contactForm.reset();
      document.querySelectorAll('.form-group.error').forEach(el => el.classList.remove('error'));
    };

    if (closeModalBtn) {
      closeModalBtn.addEventListener('click', closeModal);
    }

    // Close on outside click
    contactModal.addEventListener('click', (e) => {
      if (e.target === contactModal) {
        closeModal();
      }
    });

    // Form Validation and Submission
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;

      // Required fields
      const requiredFields = ['firstName', 'lastName', 'company', 'email', 'phone'];
      requiredFields.forEach(id => {
        const input = document.getElementById(id);
        if (input) {
          const group = input.closest('.form-group');
          if (!input.value.trim()) {
            group.classList.add('error');
            isValid = false;
          } else {
            group.classList.remove('error');
          }
        }
      });

      // Checkbox
      const privacy = document.getElementById('privacy');
      if (privacy) {
        const privacyGroup = privacy.closest('.checkbox-group');
        if (!privacy.checked) {
          privacyGroup.classList.add('error');
          isValid = false;
        } else {
          privacyGroup.classList.remove('error');
        }
      }

      if (isValid) {
        // Collect data
        const firstName = document.getElementById('firstName').value.trim();
        const lastName = document.getElementById('lastName').value.trim();
        const company = document.getElementById('company').value.trim();
        const email = document.getElementById('email').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const intent = document.getElementById('intent').value;
        const message = document.getElementById('message').value.trim();

        // Construct mailto link
        const targetEmail = '1944199339@qq.com';
        const subject = encodeURIComponent(`官网联系表单 - ${intent} - ${company}`);
        const body = encodeURIComponent(
          `您好，\n\n` +
          `收到来自官网的新联系表单提交：\n\n` +
          `姓名：${lastName} ${firstName}\n` +
          `公司/机构：${company}\n` +
          `邮箱：${email}\n` +
          `电话：${phone}\n` +
          `意向：${intent}\n\n` +
          `留言内容：\n${message || '无'}\n`
        );

        // Open email client
        window.location.href = `mailto:${targetEmail}?subject=${subject}&body=${body}`;
        
        // Close modal after slight delay
        setTimeout(closeModal, 500);
      }
    });

    // Remove error state on input
    contactForm.querySelectorAll('input, textarea, select').forEach(input => {
      input.addEventListener('input', () => {
        const group = input.closest('.form-group');
        if (group && group.classList.contains('error')) {
          group.classList.remove('error');
        }
      });
    });
  }

});
