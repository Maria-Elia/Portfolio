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
      const href = link.getAttribute("href");
      // dock these titles at the top instead of the section's own top (which includes decorative padding)
      const dock = {
        "#about": { selector: ".about__title-img", offsetY: 0 },
        "#skills": { selector: ".skills__title-img", offsetY: -100 },
        "#projects": { selector: ".project-spotlight__badge", offsetY: 0 },
      }[href];
      const target = dock ? document.querySelector(dock.selector) : document.querySelector(href);

      if (!target) {
        return;
      }

      event.preventDefault();
      gsap.to(window, {
        duration: prefersReducedMotion ? 0 : 0.9,
        ease: "power2.inOut",
        scrollTo: { y: target, offsetY: dock ? dock.offsetY : 0, autoKill: true }, // autoKill lets a manual scroll take over
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

function initProjectsTitle() {
  initDrawnTitle(document.querySelector(".project-spotlight__badge"), ".project-spotlight__badge-svg");
}

function initSkillsTitle() {
  const title = document.querySelector(".skills__title-img");

  if (!title) {
    return;
  }

  const slant = 16;

  const setClip = (v) => {
    const rightTop = -slant + v * (100 + slant * 2);
    const rightBottom = rightTop - slant;
    title.style.clipPath = `polygon(0% 0%, ${rightTop}% 0%, ${rightBottom}% 100%, 0% 100%)`;
  };

  if (prefersReducedMotion) {
    title.style.clipPath = "none";
    return;
  }

  setClip(0);

  ScrollTrigger.create({
    trigger: title,
    start: "top bottom",
    once: true,
    onEnter: () => {
      gsap.to(
        { v: 0 },
        {
          v: 1,
          duration: 3.2,
          ease: "power2.inOut",
          onUpdate() {
            setClip(this.targets()[0].v);
          },
        },
      );
    },
  });
}

const STAR_PATH_D = "M50,5 Q54,40 95,50 Q54,60 50,95 Q46,60 5,50 Q46,40 50,5 Z";

const SKILLS_DATA = [
  {
    cat: "languages",
    label: "Languages",
    constellation: "Auriga",
    color: "var(--pink-primary)",
    skills: ["JavaScript", "TypeScript", "Python", "Java", "HTML", "CSS"],
  },
  {
    cat: "frameworks",
    label: "Frameworks & Engines",
    constellation: "Corvus",
    color: "var(--blue-accent)",
    nameColor: "var(--blue-text)",
    skills: ["React", "Node.js", "GSAP", "Unity"],
  },
  {
    cat: "tools",
    label: "Data & Dev Tools",
    constellation: "Cygnus",
    color: "var(--teal-blue)",
    nameColor: "var(--teal-text)",
    skills: ["MongoDB", "MariaDB", "PostgreSQL", "Git", "VS Code", "Docker"],
  },
  {
    cat: "ai",
    label: "AI Tools",
    constellation: "Triangulum",
    color: "var(--purple-mid)",
    skills: ["Claude", "ChatGPT", "GitHub Copilot"],
  },
];
const CONSTELLATION_TEMPLATES = {
  // Triangulum
  ai: {
    viewBox: "0 0 280 150",
    points: [
      { x: 40, y: 95 },
      { x: 160, y: 15 },
      { x: 110, y: 140, narrowLabelMaxWidth: 140 },
    ],
    edges: [
      [0, 1],
      [1, 2],
      [2, 0],
    ],
  },
  // Corvus (the Crow)
  frameworks: {
    viewBox: "0 0 300 130",
    points: [
      { x: 60, y: 105 },
      { x: 90, y: 25 },
      { x: 230, y: 15 },
      { x: 205, y: 100 },
    ],
    edges: [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 0],
    ],
  },
  // Auriga
  languages: {
    viewBox: "0 0 360 170",
    points: [
      { x: 55, y: 130 },
      { x: 25, y: 75 },
      { x: 145, y: 10 },
      { x: 270, y: 10, labelSide: "right" }, // Java
      { x: 325, y: 75, labelSide: "right", labelMaxWidth: 95 }, // HTML
      { x: 240, y: 150, labelSide: "right" }, // CSS
    ],
    edges: [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 4],
      [4, 5],
      [5, 0],
    ],
  },
  // Cygnus
  tools: {
    viewBox: "0 0 360 260",
    points: [
      { x: 200, y: 15 },
      { x: 245, y: 60 },
      { x: 30, y: 110 },
      { x: 230, y: 140 },
      { x: 350, y: 120, labelSide: "right", labelMaxWidth: 160 }, // VS Code
      { x: 195, y: 235 },
    ],
    edges: [
      [0, 1],
      [1, 3],
      [3, 2],
      [3, 4],
      [3, 5],
    ],
  },
};

function buildConstellationSvg(template, skills) {
  const svgNS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(svgNS, "svg");
  svg.setAttribute("viewBox", template.viewBox);
  svg.setAttribute("aria-hidden", "true");
  svg.classList.add("skills__constellation-svg");

  const points = template.points;
  const edges = template.edges || points.map((_, i) => [i, i + 1]).slice(0, -1);
  const viewBoxWidth = Number(template.viewBox.split(" ")[2]);

  const lineGroup = document.createElementNS(svgNS, "g");
  lineGroup.classList.add("skills__constellation-lines");
  edges.forEach(([a, b]) => {
    const line = document.createElementNS(svgNS, "line");
    line.setAttribute("x1", points[a].x);
    line.setAttribute("y1", points[a].y);
    line.setAttribute("x2", points[b].x);
    line.setAttribute("y2", points[b].y);
    line.classList.add("skills__constellation-line");
    lineGroup.appendChild(line);
  });
  svg.appendChild(lineGroup);

  points.forEach((point, i) => {
    const star = document.createElementNS(svgNS, "g");
    star.classList.add("skills__star");
    star.setAttribute("transform", `translate(${point.x - 50}, ${point.y - 50})`);

    const mark = document.createElementNS(svgNS, "path");
    mark.setAttribute("d", STAR_PATH_D);
    mark.classList.add("skills__star-mark");
    mark.style.animationDelay = `${(Math.random() * 2.4).toFixed(2)}s`;
    star.appendChild(mark);
    svg.appendChild(star);

    const roomRight = viewBoxWidth - (point.x + 10) - LABEL_EDGE_MARGIN;
    const roomLeft = point.x - 10 - LABEL_EDGE_MARGIN;
    const anchorLeft = point.labelSide ? point.labelSide === "left" : roomRight < roomLeft;

    const label = document.createElementNS(svgNS, "text");
    label.classList.add("skills__star-label");
    label.setAttribute("x", anchorLeft ? point.x - 10 : point.x + 10);
    label.setAttribute("y", point.y + 4);
    if (anchorLeft) {
      label.setAttribute("text-anchor", "end");
    }
    label.textContent = skills[i];
    label.dataset.maxWidth =
      point.labelMaxWidth ?? Math.max(anchorLeft ? roomLeft : roomRight, LABEL_EDGE_MARGIN);
    svg.appendChild(label);
  });

  return svg;
}

const LABEL_EDGE_MARGIN = 6;

const LABEL_MIN_FONT_PX = 9;
const LABEL_COLLISION_PAD = 2;
const LABEL_SHRINK_STEP = 0.92;
function fitLabelToEdge(label) {
  label.removeAttribute("textLength");
  label.removeAttribute("lengthAdjust");
  const maxWidth = Number(label.dataset.maxWidth);
  const natural = label.getComputedTextLength();
  if (natural > maxWidth) {
    label.setAttribute("textLength", maxWidth);
    label.setAttribute("lengthAdjust", "spacingAndGlyphs");
  }
}

function labelsOverlap(a, b, pad) {
  return (
    a.x < b.x + b.width + pad &&
    b.x < a.x + a.width + pad &&
    a.y < b.y + b.height + pad &&
    b.y < a.y + a.height + pad
  );
}

function anyLabelsOverlap(svgs) {
  return svgs.some((svg) => {
    const labels = [...svg.querySelectorAll(".skills__star-label")];
    for (let i = 0; i < labels.length; i += 1) {
      for (let j = i + 1; j < labels.length; j += 1) {
        if (labelsOverlap(labels[i].getBBox(), labels[j].getBBox(), LABEL_COLLISION_PAD)) {
          return true;
        }
      }
    }
    return false;
  });
}

function fitAllConstellationLabels() {
  const svgs = [...document.querySelectorAll(".skills__constellation-svg")];
  const labels = svgs.flatMap((svg) => [...svg.querySelectorAll(".skills__star-label")]);

  labels.forEach((label) => {
    label.style.fontSize = "";
  });
  labels.forEach((label) => {
    label.dataset.baseFontSize = getComputedStyle(label).fontSize;
  });

  const smallestBase = Math.min(...labels.map((label) => parseFloat(label.dataset.baseFontSize)));

  let scale = 1;
  const MAX_PASSES = 40;
  for (let pass = 0; pass < MAX_PASSES; pass += 1) {
    labels.forEach((label) => {
      const base = parseFloat(label.dataset.baseFontSize);
      label.style.fontSize = `${Math.max(base * scale, LABEL_MIN_FONT_PX)}px`;
    });
    labels.forEach(fitLabelToEdge);

    const atFloor = smallestBase * scale <= LABEL_MIN_FONT_PX;
    if (atFloor || !anyLabelsOverlap(svgs)) {
      return;
    }
    scale *= LABEL_SHRINK_STEP;
  }
}

function fitSkillsLayout() {
  const wrap = document.querySelector(".skills__constellations");
  const inner = document.querySelector(".skills__inner");
  const title = document.querySelector(".skills__title-img");
  const langs = document.querySelector('.skills__constellation[data-cat="languages"]');
  const ai = document.querySelector('.skills__constellation[data-cat="ai"]');

  if (!wrap || !inner || !title || !langs || !ai) {
    return;
  }

  wrap.style.marginTop = "";
  wrap.style.setProperty("--skills-scale", 1);

  const titleRect = title.getBoundingClientRect();
  const langsRect = langs.getBoundingClientRect();
  const titleOverlap = titleRect.bottom - langsRect.top;
  if (titleOverlap > 0) {
    wrap.style.marginTop = `${titleOverlap + 8}px`;
  }

  const SCALE_STEP = 0.96;
  const MIN_SCALE = 0.55;
  let scale = 1;
  for (let pass = 0; pass < 20; pass += 1) {
    const innerRect = inner.getBoundingClientRect();
    const aiRect = ai.getBoundingClientRect();
    if (aiRect.bottom <= innerRect.bottom - 4 || scale <= MIN_SCALE) {
      break;
    }
    scale = Math.max(scale * SCALE_STEP, MIN_SCALE);
    wrap.style.setProperty("--skills-scale", scale);
  }
}

const NARROW_QUERY = "(max-width: 800px)";
const NARROW_VIEWBOXES = {
  ai: "0 0 220 150",
  frameworks: "45 0 200 130",
};

function updateTightViewBoxes() {
  const isNarrow = window.matchMedia(NARROW_QUERY).matches;

  Object.entries(NARROW_VIEWBOXES).forEach(([cat, narrowViewBox]) => {
    const mount = document.querySelector(`.skills__constellation[data-cat="${cat}"]`);
    const svg = mount ? mount.querySelector(".skills__constellation-svg") : null;
    const template = CONSTELLATION_TEMPLATES[cat];

    if (!mount || !svg || !template) {
      return;
    }

    const activeViewBox = isNarrow ? narrowViewBox : template.viewBox;
    const [minX, , viewBoxWidth] = activeViewBox.split(" ").map(Number);

    svg.setAttribute("viewBox", activeViewBox);
    mount.classList.toggle("skills__constellation--tight", isNarrow);

    const labels = svg.querySelectorAll(".skills__star-label");
    template.points.forEach((point, i) => {
      const label = labels[i];

      if (!label) {
        return;
      }

      const roomRight = minX + viewBoxWidth - (point.x + 10) - LABEL_EDGE_MARGIN;
      const roomLeft = point.x - minX - 10 - LABEL_EDGE_MARGIN;
      const anchorLeft = point.labelSide ? point.labelSide === "left" : roomRight < roomLeft;

      label.setAttribute("x", anchorLeft ? point.x - 10 : point.x + 10);
      if (anchorLeft) {
        label.setAttribute("text-anchor", "end");
      } else {
        label.removeAttribute("text-anchor");
      }
      const narrowOverride = isNarrow ? point.narrowLabelMaxWidth : undefined;
      label.dataset.maxWidth =
        narrowOverride ??
        point.labelMaxWidth ??
        Math.max(anchorLeft ? roomLeft : roomRight, LABEL_EDGE_MARGIN);
    });
  });
}

const SKILL_FONT_RANGE_QUERY = "(max-width: 460px) and (min-width: 320px)";
const SKILL_FONT_SMALL_QUERY = "(max-width: 369px)";
const SKILL_FONT_TARGET_PX = 15;
const SKILL_FONT_TARGET_PX_SMALL = 12.5;

function applyFlatSkillFontSize() {
  const inRange = window.matchMedia(SKILL_FONT_RANGE_QUERY).matches;
  const targetPx = window.matchMedia(SKILL_FONT_SMALL_QUERY).matches
    ? SKILL_FONT_TARGET_PX_SMALL
    : SKILL_FONT_TARGET_PX;

  document.querySelectorAll(".skills__constellation-svg").forEach((svg) => {
    const labels = svg.querySelectorAll(".skills__star-label");

    if (!inRange) {
      labels.forEach((label) => {
        label.style.fontSize = "";
      });
      return;
    }

    const viewBoxWidth = svg.viewBox.baseVal.width;
    const svgWidthPx = svg.getBoundingClientRect().width;

    if (!viewBoxWidth || !svgWidthPx) {
      return;
    }

    const userUnits = targetPx * (viewBoxWidth / svgWidthPx);
    labels.forEach((label) => {
      label.style.fontSize = `${userUnits}px`;
      fitLabelToEdge(label);
    });
  });
}

function buildConstellations() {
  SKILLS_DATA.forEach((entry) => {
    const mount = document.querySelector(`.skills__constellation[data-cat="${entry.cat}"]`);

    if (!mount) {
      return;
    }

    const template = CONSTELLATION_TEMPLATES[entry.cat];

    if (!template) {
      console.warn(`No constellation template for ${entry.cat}`);
      return;
    }

    mount.style.setProperty("--cat-color", entry.color);
    mount.style.setProperty("--cat-name-color", entry.nameColor || entry.color);

    const caption = document.createElement("span");
    caption.className = "skills__constellation-label";
    caption.setAttribute("aria-hidden", "true");
    caption.textContent = entry.label;
    mount.appendChild(caption);

    if (entry.constellation) {
      const name = document.createElement("span");
      name.className = "skills__constellation-name";
      name.setAttribute("aria-hidden", "true");
      name.textContent = entry.constellation;
      mount.appendChild(name);
    }

    const svg = buildConstellationSvg(template, entry.skills);
    mount.appendChild(svg);
  });

  const refitAll = () => {
    updateTightViewBoxes();
    fitAllConstellationLabels();
    applyFlatSkillFontSize();
    fitSkillsLayout();
  };

  refitAll();

  if (document.fonts) {
    document.fonts.ready.then(refitAll);
  }

  setTimeout(refitAll, 300);
  setTimeout(refitAll, 1000);

  let resizeTimer;
  const scheduleRefit = () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(refitAll, 120);
  };
  window.addEventListener("resize", scheduleRefit);
  if (window.visualViewport) {
    window.visualViewport.addEventListener("resize", scheduleRefit);
  }

  const skillsInner = document.querySelector(".skills__inner");
  if (window.ResizeObserver && skillsInner) {
    new ResizeObserver(scheduleRefit).observe(skillsInner);
  }
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
function initSkillsParallax() {
  if (prefersReducedMotion) {
    return;
  }

  const vw = () => window.innerWidth / 100;

  gsap.to(".skills__big-star--one", {
    y: () => -8 * vw(),
    ease: "none",
    scrollTrigger: { trigger: ".skills", start: "top bottom", end: "bottom top", scrub: 0.4 },
  });
  gsap.to(".skills__big-star--two", {
    y: () => 12 * vw(),
    ease: "none",
    scrollTrigger: { trigger: ".skills", start: "top bottom", end: "bottom top", scrub: 0.6 },
  });
}

function initSkillsConstellations() {
  if (prefersReducedMotion) {
    return;
  }

  document.querySelectorAll(".skills__constellation").forEach((cluster) => {
    const lines = cluster.querySelectorAll(".skills__constellation-line");
    const stars = cluster.querySelectorAll(".skills__star");
    const labels = cluster.querySelectorAll(".skills__star-label");
    const caption = cluster.querySelector(".skills__constellation-label");

    lines.forEach((line) => {
      const length = line.getTotalLength();
      line.style.strokeDasharray = length;
      line.style.strokeDashoffset = length;
    });

    gsap.set(stars, { autoAlpha: 0 });
    gsap.set(labels, { autoAlpha: 0, y: 6 });
    gsap.set(caption, { autoAlpha: 0, y: 6 });

    ScrollTrigger.create({
      trigger: cluster,
      start: "top bottom",
      once: true,
      onEnter: () => {
        gsap
          .timeline()
          .to(caption, { autoAlpha: 1, y: 0, duration: 0.5, ease: "power2.out" })
          .to(
            lines,
            { strokeDashoffset: 0, duration: 0.8, stagger: 0.15, ease: "power2.out" },
            "-=0.2",
          )
          .to(stars, { autoAlpha: 1, duration: 0.4, stagger: 0.1, ease: "power2.out" }, "-=0.6")
          .to(
            labels,
            { autoAlpha: 1, y: 0, duration: 0.4, stagger: 0.1, ease: "power2.out" },
            "-=0.5",
          );
      },
    });
  });
}

function initDecorGating() {
  if (prefersReducedMotion) {
    return;
  }

  document.querySelectorAll(".hero, .about, .skills, .contact").forEach((section) => {
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

  reveal([".contact__arc", ".contact__flip-wrap"], ".contact");
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
  scatterTwinkles(document.querySelector(".skills__twinkles"), 26);
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
  buildConstellations();
  await Promise.all([
    loadTitleSvg("about", "assets/svg/about-title.svg"),
    loadTitleSvg("contact", "assets/svg/contact-title.svg"),
    loadTitleSvg("cat-paw", "assets/svg/cat-paw.svg"),
    loadTitleSvg("skills", "assets/svg/skills-title-cropped.svg"),
    loadTitleSvg("projects", "assets/svg/projects-title.svg"),
  ]);
  initAboutTitle();
  initSkillsTitle();
  initContactTitle();
  initProjectsTitle();
  initAboutKeywords();
  initAboutSparkles();
  initCloudParallax();
  initSkillsParallax();
  initSkillsConstellations();
  initSectionReveals(); // after the title triggers, so they refresh in page order
  initTwinkles();
});
