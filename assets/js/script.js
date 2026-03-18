'use strict';

/* =============================================
   NAVBAR TOGGLE (MOBILE)
   ============================================= */
const header = document.querySelector("[data-header]");
const navToggleBtn = document.querySelector("[data-nav-toggle-btn]");

navToggleBtn.addEventListener("click", function () {
  header.classList.toggle("nav-active");
  this.classList.toggle("active");
});

const navbarLinks = document.querySelectorAll("[data-nav-link]");
for (let i = 0; i < navbarLinks.length; i++) {
  navbarLinks[i].addEventListener("click", function () {
    header.classList.remove("nav-active");
    navToggleBtn.classList.remove("active");
  });
}


/* =============================================
   HEADER + BACK TO TOP ON SCROLL
   ============================================= */
const backTopBtn = document.querySelector("[data-back-to-top]");

window.addEventListener("scroll", function () {
  if (window.scrollY >= 100) {
    header.classList.add("active");
    backTopBtn.classList.add("active");
  } else {
    header.classList.remove("active");
    backTopBtn.classList.remove("active");
  }
});

// Scroll spy
const sections = document.querySelectorAll("section[id]");
window.addEventListener("scroll", function () {
  const scrollY = window.pageYOffset;
  sections.forEach(function (section) {
    const sectionHeight = section.offsetHeight;
    const sectionTop = section.offsetTop - 70;
    const sectionId = section.getAttribute("id");
    if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
      const activeLink = document.querySelector(".navbar-link.active");
      if (activeLink) activeLink.classList.remove("active");
      const newLink = document.querySelector('.navbar-link[href="#' + sectionId + '"]');
      if (newLink) newLink.classList.add("active");
    }
  });
});


/* =============================================
   PARTICLE CONSTELLATION SYSTEM
   ============================================= */
(function () {
  const canvas = document.getElementById("particles");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  let width, height, particles, mouse;
  const PARTICLE_COUNT = 80;
  const CONNECTION_DIST = 150;
  const MOUSE_RADIUS = 200;

  mouse = { x: -9999, y: -9999 };

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  function createParticles() {
    particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.2
      });
    }
  }

  function drawParticle(p) {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(100, 200, 255, " + p.opacity + ")";
    ctx.fill();
  }

  function drawConnection(a, b, dist) {
    var opacity = 1 - dist / CONNECTION_DIST;
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.strokeStyle = "rgba(120, 180, 255, " + (opacity * 0.3) + ")";
    ctx.lineWidth = 0.5;
    ctx.stroke();
  }

  function update() {
    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];

      // Mouse attraction
      var dx = mouse.x - p.x;
      var dy = mouse.y - p.y;
      var dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < MOUSE_RADIUS) {
        var force = (MOUSE_RADIUS - dist) / MOUSE_RADIUS * 0.02;
        p.vx += dx * force * 0.01;
        p.vy += dy * force * 0.01;
      }

      // Damping
      p.vx *= 0.99;
      p.vy *= 0.99;

      p.x += p.vx;
      p.y += p.vy;

      // Wrap edges
      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;
    }
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);
    update();

    // Draw connections
    for (var i = 0; i < particles.length; i++) {
      for (var j = i + 1; j < particles.length; j++) {
        var dx = particles[i].x - particles[j].x;
        var dy = particles[i].y - particles[j].y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < CONNECTION_DIST) {
          drawConnection(particles[i], particles[j], dist);
        }
      }
    }

    // Draw particles
    for (var k = 0; k < particles.length; k++) {
      drawParticle(particles[k]);
    }

    requestAnimationFrame(draw);
  }

  window.addEventListener("resize", function () {
    resize();
  });

  document.addEventListener("mousemove", function (e) {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  document.addEventListener("mouseleave", function () {
    mouse.x = -9999;
    mouse.y = -9999;
  });

  resize();
  createParticles();
  draw();
})();


/* =============================================
   ANIMATED COUNTERS (IntersectionObserver)
   ============================================= */
(function () {
  var counters = document.querySelectorAll(".counter[data-target]");
  if (!counters.length) return;

  function animateCounter(el) {
    var target = parseInt(el.getAttribute("data-target"), 10);
    var duration = 2000;
    var start = 0;
    var startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      // Ease-out cubic
      var ease = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(ease * target);
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target;
      }
    }

    requestAnimationFrame(step);
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(function (el) {
    observer.observe(el);
  });
})();


/* =============================================
   3D TILT EFFECT ON CARDS
   ============================================= */
(function () {
  var tiltCards = document.querySelectorAll("[data-tilt]");
  if (!tiltCards.length) return;

  tiltCards.forEach(function (card) {
    card.addEventListener("mousemove", function (e) {
      var rect = card.getBoundingClientRect();
      var x = e.clientX - rect.left;
      var y = e.clientY - rect.top;
      var centerX = rect.width / 2;
      var centerY = rect.height / 2;

      var rotateX = (y - centerY) / centerY * -8;
      var rotateY = (x - centerX) / centerX * 8;

      card.style.transform = "perspective(1000px) rotateX(" + rotateX + "deg) rotateY(" + rotateY + "deg) scale(1.02)";
      card.style.transition = "transform 0.1s ease";
    });

    card.addEventListener("mouseleave", function () {
      card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)";
      card.style.transition = "transform 0.5s cubic-bezier(0.25, 0.8, 0.25, 1)";
    });
  });
})();


/* =============================================
   CUSTOM MAGNETIC CURSOR
   ============================================= */
(function () {
  var cursorGlow = document.getElementById("cursorGlow");
  if (!cursorGlow || window.matchMedia("(pointer: coarse)").matches) return;

  var cx = -100, cy = -100;
  var tx = -100, ty = -100;

  document.addEventListener("mousemove", function (e) {
    tx = e.clientX;
    ty = e.clientY;
    cursorGlow.classList.add("active");
  });

  document.addEventListener("mouseleave", function () {
    cursorGlow.classList.remove("active");
  });

  // Hover detection for interactive elements
  var interactiveSelectors = "a, button, .btn, .project-card, .cp-platform-card, .cert-card, .achievement-item, .skills-tab-btn, .filter-btn, input, textarea";

  document.addEventListener("mouseover", function (e) {
    if (e.target.closest(interactiveSelectors)) {
      cursorGlow.classList.add("hover");
    }
  });

  document.addEventListener("mouseout", function (e) {
    if (e.target.closest(interactiveSelectors)) {
      cursorGlow.classList.remove("hover");
    }
  });

  function animateCursor() {
    // Lerp for smooth follow
    cx += (tx - cx) * 0.15;
    cy += (ty - cy) * 0.15;
    cursorGlow.style.left = cx + "px";
    cursorGlow.style.top = cy + "px";
    requestAnimationFrame(animateCursor);
  }

  animateCursor();
})();


/* =============================================
   ENHANCED SCROLL REVEAL (IntersectionObserver)
   ============================================= */
(function () {
  var revealSelectors = '.about-card, .about-right, .skills-item, .project-card, .cert-card, .achievement-item, .edu-card, .section-subtitle, .section-title, .section-text, .contact-item, .resume-contact-link, .resume-tab-btn, .experience-card, .cp-platform-card, .cp-summary-bar';

  var revealElements = document.querySelectorAll(revealSelectors);

  var animationTypes = [
    'fadeInUp', 'slideInLeft', 'slideInRight', 'scaleIn'
  ];

  function getAnimation(el) {
    if (el.classList.contains('about-card') || el.classList.contains('experience-card') || el.classList.contains('cert-card')) {
      return 'slideInLeft';
    }
    if (el.classList.contains('about-right') || el.classList.contains('edu-card') || el.classList.contains('contact-item')) {
      return 'slideInRight';
    }
    if (el.classList.contains('project-card') || el.classList.contains('cp-platform-card')) {
      return 'scaleIn';
    }
    return 'fadeInUp';
  }

  // Set initial hidden state
  revealElements.forEach(function (el) {
    el.style.opacity = '0';
    el.style.animation = 'none';
  });

  var revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        var el = entry.target;
        var anim = getAnimation(el);
        var delay = 0;

        // Calculate stagger based on siblings
        var parent = el.parentElement;
        if (parent) {
          var siblings = Array.from(parent.children);
          var index = siblings.indexOf(el);
          delay = index * 0.1;
        }

        el.style.animation = anim + ' 0.7s cubic-bezier(0.175, 0.885, 0.32, 1.275) ' + delay + 's forwards';
        revealObserver.unobserve(el);
      }
    });
  }, { threshold: 0.1 });

  revealElements.forEach(function (el) {
    revealObserver.observe(el);
  });
})();


/* =============================================
   SMOOTH TYPED TEXT EFFECT
   ============================================= */
(function () {
  var typedEl = document.querySelector(".hero-role");
  if (!typedEl) return;

  var roles = [
    "DSA Enthusiast",
    "Competitive Programmer",
    "Cloud Engineer",
    "Full Stack Developer"
  ];

  var roleIndex = 0;
  var charIndex = 0;
  var isDeleting = false;
  var typeSpeed = 80;

  function type() {
    var currentRole = roles[roleIndex];
    var displayText;

    if (isDeleting) {
      charIndex--;
      displayText = currentRole.substring(0, charIndex);
    } else {
      charIndex++;
      displayText = currentRole.substring(0, charIndex);
    }

    typedEl.textContent = displayText;

    var nextSpeed = typeSpeed;

    if (!isDeleting && charIndex === currentRole.length) {
      nextSpeed = 2000; // Pause at end
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      nextSpeed = 400; // Pause before typing next
    } else if (isDeleting) {
      nextSpeed = 40; // Delete faster
    }

    setTimeout(type, nextSpeed);
  }

  // Start after a short delay
  setTimeout(type, 1500);
})();


/* =============================================
   PARALLAX ON HERO AVATAR
   ============================================= */
var heroAvatar = document.querySelector(".hero-avatar");
if (heroAvatar) {
  document.addEventListener("mousemove", function (e) {
    var x = (window.innerWidth / 2 - e.clientX) / 50;
    var y = (window.innerHeight / 2 - e.clientY) / 50;
    heroAvatar.style.transform = "translateX(" + x + "px) translateY(" + y + "px)";
  });
}


/* =============================================
   SKILLS TAB FILTER
   ============================================= */
var skillsTabBtns = document.querySelectorAll(".skills-tab-btn");
var skillsItems = document.querySelectorAll(".skills-item[data-category]");
skillsTabBtns.forEach(function (btn) {
  btn.addEventListener("click", function () {
    skillsTabBtns.forEach(function (b) { b.classList.remove("active"); });
    this.classList.add("active");
    var filter = this.getAttribute("data-filter");
    skillsItems.forEach(function (item) {
      if (filter === "all" || item.getAttribute("data-category") === filter) {
        item.classList.remove("hidden");
      } else {
        item.classList.add("hidden");
      }
    });
  });
});


/* =============================================
   PROJECT FILTER
   ============================================= */
var filterBtns = document.querySelectorAll(".filter-btn");
var projectCards = document.querySelectorAll(".project-card[data-category]");
filterBtns.forEach(function (btn) {
  btn.addEventListener("click", function () {
    filterBtns.forEach(function (b) { b.classList.remove("active"); });
    this.classList.add("active");
    var filter = this.getAttribute("data-filter");
    projectCards.forEach(function (card) {
      if (filter === "all" || card.getAttribute("data-category") === filter) {
        card.classList.remove("hidden");
      } else {
        card.classList.add("hidden");
      }
    });
  });
});


/* =============================================
   RESUME TABS
   ============================================= */
var resumeTabBtns = document.querySelectorAll(".resume-tab-btn");
var resumeTabContents = document.querySelectorAll(".resume-tab-content");
resumeTabBtns.forEach(function (btn) {
  btn.addEventListener("click", function () {
    resumeTabBtns.forEach(function (b) { b.classList.remove("active"); });
    resumeTabContents.forEach(function (c) { c.classList.remove("active"); });
    this.classList.add("active");
    var tabId = "tab-" + this.getAttribute("data-tab");
    var target = document.getElementById(tabId);
    if (target) target.classList.add("active");
  });
});


/* =============================================
   THEME TOGGLE WITH PERSISTENCE
   ============================================= */
var themeToggleBtn = document.querySelector("[data-theme-btn]");
if (themeToggleBtn) {
  var darkIcon = themeToggleBtn.querySelector(".dark-icon");
  var lightIcon = themeToggleBtn.querySelector(".light-icon");
  var savedTheme = localStorage.getItem("theme");

  if (savedTheme === "light") {
    document.body.classList.add("light-theme");
    if (darkIcon) darkIcon.style.display = "block";
    if (lightIcon) lightIcon.style.display = "none";
  }

  themeToggleBtn.addEventListener("click", function () {
    document.body.classList.toggle("light-theme");
    var isLight = document.body.classList.contains("light-theme");

    if (darkIcon) darkIcon.style.display = isLight ? "block" : "none";
    if (lightIcon) lightIcon.style.display = isLight ? "none" : "block";

    localStorage.setItem("theme", isLight ? "light" : "dark");
  });
}
