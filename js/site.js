/* ============================================================
   2026 UCON Advocacy Auction — shared site behavior
   Loaded on every page. Keep this framework-free and dependency-free.
   ============================================================ */
(function () {
  "use strict";

  /* ---- Mobile hamburger menu ---- */
  var hamburgerBtn = document.getElementById("hamburgerBtn");
  var mobileMenu = document.getElementById("mobileMenu");
  if (hamburgerBtn && mobileMenu) {
    hamburgerBtn.addEventListener("click", function () {
      var isOpen = mobileMenu.classList.toggle("open");
      hamburgerBtn.classList.toggle("open", isOpen);
      hamburgerBtn.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
    mobileMenu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        mobileMenu.classList.remove("open");
        hamburgerBtn.classList.remove("open");
        hamburgerBtn.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---- Desktop nav dropdowns ("Sponsor an Item", "About") ----
     CSS handles hover/focus-within already; this adds click-to-toggle for
     touch devices and closes the menu on outside click or Escape.
     Some toggles (e.g. "Sponsor an Item") are real links to their own page,
     so only their chevron button should intercept the click to peek the
     submenu - the rest of the label should navigate normally. Toggles with
     no page of their own (e.g. "About") keep the old behavior: the whole
     button opens/closes the submenu. ---- */
  document.querySelectorAll(".nav-dropdown").forEach(function (dd) {
    var toggle = dd.querySelector(".nav-dropdown-toggle");
    if (!toggle) return;
    var chevBtn = dd.querySelector(".nav-dropdown-chev-btn");
    function toggleOpen(e) {
      e.stopPropagation();
      e.preventDefault();
      var isOpen = dd.classList.toggle("open");
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    }
    if (chevBtn) {
      chevBtn.addEventListener("click", toggleOpen);
      chevBtn.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") toggleOpen(e);
      });
    } else {
      toggle.addEventListener("click", function (e) {
        e.stopPropagation();
        var isOpen = dd.classList.toggle("open");
        toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
      });
    }
  });
  document.addEventListener("click", function (e) {
    document.querySelectorAll(".nav-dropdown.open").forEach(function (dd) {
      if (!dd.contains(e.target)) {
        dd.classList.remove("open");
        var t = dd.querySelector(".nav-dropdown-toggle");
        if (t) t.setAttribute("aria-expanded", "false");
      }
    });
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      document.querySelectorAll(".nav-dropdown.open").forEach(function (dd) {
        dd.classList.remove("open");
        var t = dd.querySelector(".nav-dropdown-toggle");
        if (t) t.setAttribute("aria-expanded", "false");
      });
    }
  });

  /* ---- Mark current-page nav links (belt-and-suspenders on top of the
     server-authored "active" class) ---- */
  var here = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-btn, .mobile-menu a").forEach(function (a) {
    var href = a.getAttribute("href");
    if (href === here) {
      a.classList.add("active");
      a.setAttribute("aria-current", "page");
    }
  });

  /* ---- FAQ / accordion ----
     .acc-item is a native <details> element (see auction.css) — the browser
     handles open/close, keyboard operation, and accessible state on its own.
     No JS needed here at all, which also means the FAQ works with
     JavaScript disabled. */

  /* ---- Scroll-to-top button ---- */
  var scrollBtn = document.getElementById("scrollTopBtn");
  if (scrollBtn) {
    window.addEventListener("scroll", function () {
      scrollBtn.classList.toggle("visible", window.scrollY > 500);
    }, { passive: true });
    scrollBtn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ---- Sticky nav background swap once scrolled past a transparent hero ---- */
  var header = document.getElementById("site-header");
  if (header && header.classList.contains("nav-over-hero")) {
    window.addEventListener("scroll", function () {
      header.classList.toggle("scrolled", window.scrollY > 40);
    }, { passive: true });
  }

  /* ---- Simple countdown (used on Home + Tickets pages) ----
     Any element with [data-countdown-to="2026-11-07T17:00:00-08:00"] containing
     child nodes with data-cd="d|h|m|s" gets live-updated. */
  function tick() {
    document.querySelectorAll("[data-countdown-to]").forEach(function (box) {
      var target = new Date(box.getAttribute("data-countdown-to")).getTime();
      var diff = Math.max(0, target - Date.now());
      var d = Math.floor(diff / 86400000);
      var h = Math.floor((diff % 86400000) / 3600000);
      var m = Math.floor((diff % 3600000) / 60000);
      var s = Math.floor((diff % 60000) / 1000);
      var map = { d: d, h: h, m: m, s: s };
      Object.keys(map).forEach(function (key) {
        var el = box.querySelector('[data-cd="' + key + '"]');
        if (el) el.textContent = String(map[key]).padStart(2, "0");
      });
    });
  }
  if (document.querySelector("[data-countdown-to]")) {
    tick();
    setInterval(tick, 1000);
  }

  /* ---- Lightweight lightbox for any .p-tile / .photo gallery ---- */
  var lastFocusedTile = null;
  document.addEventListener("click", function (e) {
    var tile = e.target.closest("[data-lightbox]");
    if (!tile) return;
    var src = tile.getAttribute("data-lightbox");
    var lb = document.getElementById("lightbox");
    if (!lb) return;
    var innerImg = tile.querySelector("img");
    var img = lb.querySelector("img");
    img.src = src;
    img.alt = (innerImg && innerImg.alt) || tile.getAttribute("aria-label") || "";
    lastFocusedTile = tile;
    lb.classList.add("open");
    var closeBtn = lb.querySelector(".lightbox-close");
    if (closeBtn) closeBtn.focus();
  });
  var lightbox = document.getElementById("lightbox");
  if (lightbox) {
    function closeLightbox() {
      lightbox.classList.remove("open");
      if (lastFocusedTile) lastFocusedTile.focus();
    }
    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox || e.target.closest(".lightbox-close")) {
        closeLightbox();
      }
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && lightbox.classList.contains("open")) closeLightbox();
    });
  }
})();
