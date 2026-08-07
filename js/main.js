function initNav() {
  const toggle = document.querySelector('.nav-toggle');
  const overlay = document.querySelector('.nav-overlay');

  toggle.addEventListener('click', () => {
    const isOpen = overlay.classList.toggle('nav-overlay--open');
    toggle.classList.toggle('nav-toggle--active', isOpen);
    toggle.setAttribute('aria-expanded', String(isOpen));
  });

  overlay.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      overlay.classList.remove('nav-overlay--open');
      toggle.classList.remove('nav-toggle--active');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initNav();
});
