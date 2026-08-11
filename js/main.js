gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

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
function initAnchorScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const target = document.querySelector(link.getAttribute("href"));

      if (!target) {
        return;
      }

      event.preventDefault();
      gsap.to(window, {
        duration: prefersReducedMotion ? 0 : 0.9,
        ease: "power2.inOut",
        scrollTo: { y: target, autoKill: true }, // autoKill lets a manual scroll take over
      });
    });
  });
}

function initHero() {
  const wordmark = document.querySelector(".hero__wordmark");
  const swooshes = document.querySelectorAll(".hero__swoosh");

  if (prefersReducedMotion) {
    return; // elements visible by default
  }

  gsap.set([wordmark, ...swooshes], { opacity: 0, y: 30 });

  gsap
    .timeline()
    .to(swooshes, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" })
    .to(wordmark, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }, "-=0.3");
}

async function loadTitleSvg(mountName, url) {
  const mount = document.querySelector(`[data-title-svg-mount="${mountName}"]`);

  if (!mount) {
    return;
  }

  const response = await fetch(url);
  mount.innerHTML = await response.text();
}
function initDrawnTitle(title, triggerSelector) {
  const paths = title ? title.querySelectorAll(".svg-title") : [];
  const shadowPaths = title ? title.querySelectorAll(".svg-title-shadow") : [];
  const trigger = title ? title.querySelector(triggerSelector) : null;

  if (!title || !trigger || !paths.length) {
    return;
  }

  [...paths, ...shadowPaths].forEach((path) => {
    const length = path.getTotalLength();
    path.style.strokeDasharray = length;
    path.style.strokeDashoffset = length;
  });

  if (prefersReducedMotion) {
    return;
  }

  ScrollTrigger.create({
    trigger,
    start: "top bottom",
    once: true,
    onEnter: () => {
      const tweenOptions = {
        strokeDashoffset: 0,
        duration: 1.8,
        ease: "power2.out",
        stagger: 0.05,
      };
      gsap.to(paths, tweenOptions);
      gsap.to(shadowPaths, tweenOptions);
    },
  });
}

function initAboutTitle() {
  initDrawnTitle(document.querySelector(".about__title-img"), ".about__title-svg--about");
}

function initContactTitle() {
  initDrawnTitle(document.querySelector(".contact__title-img"), ".contact__title-svg--lets");
}

function initAboutKeywords() {
  const keywords = document.querySelectorAll(".keyword");

  if (prefersReducedMotion) {
    keywords.forEach((el) => el.classList.add("keyword--revealed"));
    return;
  }

  keywords.forEach((el) => {
    ScrollTrigger.create({
      trigger: el,
      start: "top 80%",
      once: true,
      onEnter: () => el.classList.add("keyword--revealed"),
    });
  });
}

function initMarquee() {
  //  hovering holds the row still
  document.querySelectorAll(".marquee-row").forEach((row) => {
    const list = row.querySelector(".marquee-row__list");
    const setPaused = (paused) => {
      gsap.getTweensOf(list).forEach((tween) => (paused ? tween.pause() : tween.resume()));
    };

    row.addEventListener("mouseenter", () => setPaused(true));
    row.addEventListener("mouseleave", () => setPaused(false));
  });

  gsap.matchMedia().add(
    {
      motionOK: "(prefers-reduced-motion: no-preference)",
      isTablet: "(max-width: 1024px)",
      isPhone: "(max-width: 768px)",
      isSmallPhone: "(max-width: 480px)",
    },
    (context) => {
      if (!context.conditions.motionOK) {
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
    },
  );
}
function initCloudParallax() {
  if (prefersReducedMotion || CSS.supports("animation-timeline", "view()")) {
    return;
  }

  const vw = () => window.innerWidth / 100;

  gsap.set(".about__cloud--back", { scaleX: -1 });
  const layers = [
    { selector: ".about__cloud--front", travel: 9 },
    { selector: ".about__cloud--mid", travel: 5.5 },
    { selector: ".about__cloud--back", travel: 2.5 },
  ];

  const timeline = gsap.timeline({
    scrollTrigger: {
      trigger: ".about",
      start: "top bottom",
      end: "top top",
      scrub: 0.35,
      invalidateOnRefresh: true,
    },
  });

  layers.forEach(({ selector, travel }) => {
    timeline.fromTo(
      selector,
      { y: () => travel * vw() },
      { y: () => -travel * vw(), ease: "power2.inOut" },
      0,
    );
  });
}
function initDecorGating() {
  if (prefersReducedMotion) {
    return;
  }

  document.querySelectorAll(".hero, .about, .contact").forEach((section) => {
    section.classList.add("decor-idle");

    ScrollTrigger.create({
      trigger: section,
      start: "top bottom",
      end: "bottom top",
      onToggle: (self) => section.classList.toggle("decor-idle", !self.isActive),
    });
  });
}

function initSectionReveals() {
  if (prefersReducedMotion) {
    return; // everything is visible by default
  }

  const reveal = (targets, trigger) => {
    gsap.from(targets, {
      autoAlpha: 0,
      y: 24,
      duration: 0.6,
      stagger: 0.08,
      ease: "power2.out",
      scrollTrigger: { trigger, start: "top 80%", once: true },
    });
  };

  reveal(".projects__heading-block > *", ".projects__heading-block");
  reveal([".contact__arc", ".contact__cta", ".contact__social"], ".contact");
}

function pickSpot(top, left, isClear) {
  let topPct = 0;
  let leftPct = 0;

  for (let attempt = 0; attempt < 40; attempt++) {
    topPct = top[0] + Math.random() * (top[1] - top[0]);
    leftPct = left[0] + Math.random() * (left[1] - left[0]);
    if (!isClear || isClear(leftPct, topPct)) break;
  }

  return { topPct, leftPct };
}

function scatterTwinkles(container, count, isClear) {
  for (let i = 0; i < count; i++) {
    const twinkle = document.createElement("span");
    twinkle.className = "twinkle";
    const size = 0.4 + Math.random() * 0.6;
    const spot = pickSpot([0, 100], [0, 100], isClear);
    twinkle.style.width = `${size}rem`;
    twinkle.style.height = `${size}rem`;
    twinkle.style.top = `${spot.topPct}%`;
    twinkle.style.left = `${spot.leftPct}%`;
    twinkle.style.animationDelay = `${Math.random() * 2.4}s`;
    container.appendChild(twinkle);
  }
}
function scatterStars(
  container,
  { count, className, minSize, maxSize, top = [0, 100], left = [0, 100], isClear },
) {
  for (let i = 0; i < count; i++) {
    const star = document.createElement("span");
    star.className = className;
    const size = minSize + Math.random() * (maxSize - minSize); // in rem
    const spot = pickSpot(top, left, isClear);
    star.style.width = `${size}rem`;
    star.style.height = `${size}rem`;
    star.style.top = `${spot.topPct}%`;
    star.style.left = `${spot.leftPct}%`;
    star.style.animationDelay = `${Math.random() * 3.6}s`;
    container.appendChild(star);
  }
}

function initTwinkles() {
  scatterTwinkles(document.querySelector(".contact__twinkles"), 30);
}

function initHeroTwinkles() {
  scatterTwinkles(document.querySelector(".hero__twinkles"), 44);
}

function initHeroStars() {
  scatterStars(document.querySelector(".hero__star-field"), {
    count: 18,
    className: "hero__mini-star",
    minSize: 0.7,
    maxSize: 2.4,
  });
}
function buildPortraitClearTest() {
  const img = document.querySelector(".about__illustration-img");
  const sectionRect = document.querySelector(".about").getBoundingClientRect();
  const imgRect = img.getBoundingClientRect();
  let ctx;

  try {
    const canvas = document.createElement("canvas");
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    ctx = canvas.getContext("2d", { willReadFrequently: true });
    ctx.drawImage(img, 0, 0);
    ctx.getImageData(0, 0, 1, 1);
  } catch {
    return null;
  }

  return (leftPct, topPct) => {
    const x = sectionRect.left + (sectionRect.width * leftPct) / 100;
    const y = sectionRect.top + (sectionRect.height * topPct) / 100;
    const px = Math.round(((x - imgRect.left) / imgRect.width) * ctx.canvas.width);
    const py = Math.round(((y - imgRect.top) / imgRect.height) * ctx.canvas.height);

    if (px < 0 || py < 0 || px >= ctx.canvas.width || py >= ctx.canvas.height) {
      return true;
    }

    return ctx.getImageData(px, py, 1, 1).data[3] < 20;
  };
}

function initAboutSparkles() {
  const img = document.querySelector(".about__illustration-img");

  if (!img.complete) {
    img.addEventListener("load", initAboutSparkles, { once: true });
    img.addEventListener("error", initAboutSparkles, { once: true });
    return;
  }

  const isClear = img.naturalWidth ? buildPortraitClearTest() : null;

  scatterTwinkles(document.querySelector(".about__twinkles"), 60, isClear);
  scatterStars(document.querySelector(".about__sparkles"), {
    count: 40,
    className: "about__sparkle",
    minSize: 0.8,
    maxSize: 2.2,
    isClear,
  });
  scatterStars(document.querySelector(".about__inner-sparkles"), {
    count: 18,
    className: "about__sparkle",
    minSize: 0.6,
    maxSize: 1.6,
  });
}

function initPreloader(onHidden) {
  const preloader = document.querySelector(".preloader");
  const delay = prefersReducedMotion ? 0 : 400;

  window.addEventListener("load", () => {
    ScrollTrigger.refresh();

    setTimeout(() => {
      preloader.classList.add("preloader--hidden");
      onHidden();
    }, delay);
  });
}

function initCloudWipe() {
  const wipe = document.querySelector(".cloud-wipe");
  const back = wipe.querySelector(".cloud-wipe__layer--back");
  const mid = wipe.querySelector(".cloud-wipe__layer--mid");
  const front = wipe.querySelector(".cloud-wipe__layer--front");

  if (prefersReducedMotion) {
    wipe.remove();
    return;
  }

  gsap.set([back, mid, front], { yPercent: 0 });

  gsap
    .timeline({ onComplete: () => wipe.remove() })
    .to(back, { yPercent: 45, duration: 0.45, ease: "none" }) // back catches up to mid
    .to([back, mid], { yPercent: "+=25", duration: 0.25, ease: "none" }) // back+mid catch up to front
    .to([back, mid, front], { yPercent: "+=170", duration: 1.7, ease: "none" }); // all exit together, same constant speed
}

document.addEventListener("DOMContentLoaded", async () => {
  initPreloader(initCloudWipe);
  initNav();
  initAnchorScroll();
  initDecorGating(); // first, so its triggers refresh in page order
  initHero();
  initHeroTwinkles();
  initHeroStars();
  await Promise.all([
    loadTitleSvg("about", "assets/svg/about-title.svg"),
    loadTitleSvg("contact", "assets/svg/contact-title.svg"),
  ]);
  initAboutTitle();
  initContactTitle();
  initAboutKeywords();
  initAboutSparkles();
  initCloudParallax();
  initMarquee();
  initSectionReveals(); // after the title triggers, so they refresh in page order
  initTwinkles();
});
