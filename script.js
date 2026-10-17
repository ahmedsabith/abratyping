const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');
if (menuToggle && nav) {
  menuToggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
    menuToggle.textContent = isOpen ? '×' : '☰';
  });
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    nav.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Open navigation');
    menuToggle.textContent = '☰';
  }));
}

const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();

// Animate the sticky header after a small scroll without relying on scroll libraries.
const header = document.querySelector('.site-header');
let scrollTicking = false;
const updateHeader = () => {
  if (header) header.classList.toggle('is-scrolled', window.scrollY > 18);
  scrollTicking = false;
};
window.addEventListener('scroll', () => {
  if (!scrollTicking) {
    window.requestAnimationFrame(updateHeader);
    scrollTicking = true;
  }
}, { passive: true });
updateHeader();

// Respect reduced-motion preferences; otherwise reveal sections and cards as they enter view.
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!reduceMotion && 'IntersectionObserver' in window) {
  document.body.classList.add('motion-ready');
  const revealTargets = [
    '.section-heading', '.services-grid', '.about-visual', '.about-copy',
    '.center-heading', '.benefit-grid', '.testimonial-heading', '.testimonial-grid',
    '.testimonial-footer', '.contact-copy', '.contact-form', '.footer-main'
  ].flatMap(selector => Array.from(document.querySelectorAll(selector)));
  revealTargets.forEach(el => {
    if (el.classList.contains('services-grid') || el.classList.contains('benefit-grid') || el.classList.contains('testimonial-grid')) {
      el.classList.add('reveal-stagger');
      Array.from(el.children).forEach((child, index) => {
        child.classList.add('reveal');
        child.style.setProperty('--reveal-delay', `${Math.min(index % 4, 3) * 85}ms`);
      });
    } else {
      el.classList.add('reveal');
      if (el.classList.contains('about-visual') || el.classList.contains('contact-copy')) el.classList.add('reveal-left');
      if (el.classList.contains('about-copy') || el.classList.contains('contact-form')) el.classList.add('reveal-right');
    }
  });
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -35px 0px' });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

// Existing enquiry flow: validate, compose the message, then open WhatsApp for the visitor to send.
const form = document.getElementById('enquiry-form');
if (form) {
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const name = String(data.get('name') || '').trim();
    const phone = String(data.get('phone') || '').trim();
    const service = String(data.get('service') || '').trim();
    const message = String(data.get('message') || '').trim();
    const text = [
      'Hello ABRA Businessmen Services, I would like to make an enquiry.',
      '',
      `Name: ${name}`,
      phone ? `Phone: ${phone}` : '',
      `Service: ${service}`,
      `Details: ${message}`
    ].filter(Boolean).join('\n');
    const status = document.getElementById('form-status');
    if (status) status.textContent = 'Opening WhatsApp with your enquiry. Please review and send the message there.';
    window.open(`https://wa.me/971545104716?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
  });
}
