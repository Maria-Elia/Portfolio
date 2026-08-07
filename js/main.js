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
  const swooshes = document.querySelectorAll(".hero__swoosh");
  const doodleLeft = document.querySelector(".hero__doodle--left");
  const doodleRight = document.querySelector(".hero__doodle--right");

  if (prefersReducedMotion) {
    return; // elements visible by default
  }

  gsap.set([wordmark, subtitle, ...swooshes], { opacity: 0, y: 30 });

  gsap
    .timeline()
    .to(swooshes, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" })
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

function initMarquee() {
  if (prefersReducedMotion) {
    return; // rows stay static
  }

  document.querySelectorAll(".marquee-row").forEach((row) => {
    const list = row.querySelector(".marquee-row__list");
    const direction = row.dataset.direction === "right" ? 1 : -1;
    const distance = list.scrollWidth / 2; // list content is duplicated, so half its width is one full loop

    gsap.fromTo(
      list,
      { x: direction === -1 ? 0 : -distance },
      {
        x: direction === -1 ? -distance : 0,
        duration: 25,
        ease: "none",
        repeat: -1,
      },
    );
  });
}

function scatterTwinkles(container, count) {
  for (let i = 0; i < count; i++) {
    const twinkle = document.createElement("span");
    twinkle.className = "twinkle";
    twinkle.style.top = `${Math.random() * 100}%`;
    twinkle.style.left = `${Math.random() * 100}%`;
    twinkle.style.animationDelay = `${Math.random() * 2.4}s`;
    container.appendChild(twinkle);
  }
}

function initTwinkles() {
  scatterTwinkles(document.querySelector(".contact__twinkles"), 30);
}

function initHeroTwinkles() {
  scatterTwinkles(document.querySelector(".hero__twinkles"), 20);
}

function initPreloader() {
  const preloader = document.querySelector(".preloader");
  const delay = prefersReducedMotion ? 0 : 400;

  window.addEventListener("load", () => {
    setTimeout(() => {
      preloader.classList.add("preloader--hidden");
    }, delay);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initPreloader();
  initNav();
  initHero();
  initHeroTwinkles();
  initAboutKeywords();
  initMarquee();
  initTwinkles();
});
