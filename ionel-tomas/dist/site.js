'use strict';
const form = document.querySelector('#request-form');
const result = document.querySelector('#form-result');
document.querySelectorAll('[data-service], [data-urgent]').forEach(link => {
  link.addEventListener('click', () => {
    if (link.dataset.service) form.elements.service.value = link.dataset.service;
    if (link.dataset.urgent) form.elements.urgency.value = 'urgenta';
    result.hidden = true;
  });
});
form.addEventListener('submit', event => {
  event.preventDefault();
  if (!form.reportValidity()) return;
  result.textContent = 'Formular completat corect. Acesta este un test: solicitarea nu a fost trimisă și datele nu au fost salvate. La lansare, formularul va fi conectat la contactul lui Ionel.';
  result.hidden = false;
  result.focus({ preventScroll: true });
  result.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'nearest' });
});
form.addEventListener('input', () => { result.hidden = true; });
const mobileContact = document.querySelector('.mobile-contact');
if ('IntersectionObserver' in window) {
  new IntersectionObserver(entries => {
    mobileContact.classList.toggle('is-hidden', entries[0].isIntersecting);
  }, { threshold: 0.1 }).observe(form);
}
