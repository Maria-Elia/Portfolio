gsap.registerPlugin(ScrollTrigger);

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function initNav() {
  const toggle = document.querySelector(".nav-toggle");
  const overlay = document.querySelector(".nav-overlay");

  toggle.addEventListener("click", () => {
    const isOpen = overlay.classList.toggle("nav-overlay--open");
    toggle.classList.toggle("nav-toggle--active", isOpen);
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  overlay.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      overlay.classList.remove("nav-overlay--open");
      toggle.classList.remove("nav-toggle--active");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

function initHero() {
  const wordmark = document.querySelector(".hero__wordmark");
  const subtitle = document.querySelector(".hero__subtitle");
  const swoosh = document.querySelector(".hero__swoosh");
  const doodleLeft = document.querySelector(".hero__doodle--left");
  const doodleRight = document.querySelector(".hero__doodle--right");

  if (prefersReducedMotion) {
    return; // elements visible by default
  }

  gsap.set([wordmark, subtitle, swoosh], { opacity: 0, y: 30 });

  gsap
    .timeline()
    .to(swoosh, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" })
    .to(wordmark, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }, "-=0.3")
    .to(subtitle, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }, "-=0.3");

  gsap.to(doodleLeft, {
    yPercent: 20,
    scrollTrigger: {
      trigger: ".hero",
      start: "top top",
      end: "bottom top",
      scrub: true,
    },
  });

  gsap.to(doodleRight, {
    yPercent: -20,
    scrollTrigger: {
      trigger: ".hero",
      start: "top top",
      end: "bottom top",
      scrub: true,
    },
  });
}

function initAboutKeywords() {
  const keywords = document.querySelectorAll('.keyword');

  if (prefersReducedMotion) {
    keywords.forEach((el) => el.classList.add('keyword--revealed'));
    return;
  }

  keywords.forEach((el) => {
    ScrollTrigger.create({
      trigger: el,
      start: 'top 80%',
      onEnter: () => el.classList.add('keyword--revealed'),
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initNav();
  initHero();
  initAboutKeywords();
});
