document.addEventListener('DOMContentLoaded', () => {
  // ==========================================================================
  // 1. Sticky Header scroll behavior
  // ==========================================================================
  const header = document.querySelector('.header');
  const isHomePage = document.body.classList.contains('home-page');
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('sticky');
      // For pages that are light-first (like dedicated stock system or contact), we can keep it light
      if (document.body.classList.contains('light-first-page')) {
        header.classList.add('sticky-light');
      }
    } else {
      header.classList.remove('sticky');
      header.classList.remove('sticky-light');
    }
  });

  // ==========================================================================
  // 2. Mobile Menu / Hamburger Toggle
  // ==========================================================================
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');

  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      hamburger.classList.toggle('active');
      
      // Transform hamburger to X
      const spans = hamburger.querySelectorAll('span');
      if (hamburger.classList.contains('active')) {
        spans[0].style.transform = 'rotate(45deg) translate(6px, 6px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
      } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
      }
    });

    // Close menu when clicking link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
        hamburger.querySelectorAll('span').forEach(span => span.style.transform = 'none');
        hamburger.querySelectorAll('span')[1].style.opacity = '1';
      });
    });
  }

  // ==========================================================================
  // 3. Scroll Reveal Animation using IntersectionObserver
  // ==========================================================================
  const revealElements = document.querySelectorAll('.scroll-reveal');
  
  if ('IntersectionObserver' in window && revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-visible');
          observer.unobserve(entry.target); // Reveal only once
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(element => {
      revealObserver.observe(element);
    });
  } else {
    // Fallback if IntersectionObserver is not supported
    revealElements.forEach(element => {
      element.classList.add('reveal-visible');
    });
  }

  // ==========================================================================
  // 4. Contact Form Validation and Toast System
  // ==========================================================================
  const contactForm = document.getElementById('contactForm');
  const toastContainer = document.getElementById('toastContainer');

  // Helper to create and show Toast
  function showToast(message, type = 'info') {
    if (!toastContainer) return;
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    // Icon selection
    let icon = 'ℹ️';
    if (type === 'success') icon = '✓';
    if (type === 'error') icon = '⚠️';
    
    toast.innerHTML = `<span>${icon}</span><p>${message}</p>`;
    toastContainer.appendChild(toast);
    
    // Trigger animation
    setTimeout(() => {
      toast.classList.add('show');
    }, 50);
    
    // Auto remove toast
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        toast.remove();
      }, 400);
    }, 4500);
  }

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const nomeInput = document.getElementById('nome');
      const emailInput = document.getElementById('email');
      const assuntoInput = document.getElementById('assunto');
      const mensagemInput = document.getElementById('mensagem');
      
      // Simple validation
      if (!nomeInput.value.trim()) {
        showToast('Por favor, insira o seu nome.', 'error');
        nomeInput.focus();
        return;
      }
      
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailInput.value.trim() || !emailPattern.test(emailInput.value)) {
        showToast('Por favor, insira um e-mail válido.', 'error');
        emailInput.focus();
        return;
      }

      if (!assuntoInput.value.trim()) {
        showToast('Por favor, informe o assunto.', 'error');
        assuntoInput.focus();
        return;
      }

      if (!mensagemInput.value.trim()) {
        showToast('Por favor, escreva a sua mensagem.', 'error');
        mensagemInput.focus();
        return;
      }

      // Display sending toast
      showToast('Enviando mensagem para contato@webcoagency.site...', 'info');
      
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Enviando... <span class="arrow">→</span>';

      // Simulate API submit to contato@webcoagency.site
      setTimeout(() => {
        showToast('Mensagem enviada com sucesso! Entraremos em contato em breve.', 'success');
        
        // Reset form
        contactForm.reset();
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      }, 1500);
    });
  }
});
