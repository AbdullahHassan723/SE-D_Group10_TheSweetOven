/**
 * Shared vanilla JavaScript for navigation toggle (no Bootstrap JS),
 * safe localStorage helpers, light/cozy theme toggle, and live basket badge sync.
 */
(function () {
  "use strict";

  var CART_STORAGE_KEY = "sweetOvenCart";
  var THEME_STORAGE_KEY = "sweetOvenTheme";
  var memoryTheme = "light";

  function safeGetStorage(key) {
    try {
      return window.localStorage ? window.localStorage.getItem(key) : null;
    } catch (error) {
      return null;
    }
  }

  function safeSetStorage(key, value) {
    try {
      if (window.localStorage) {
        window.localStorage.setItem(key, value);
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  }

  function safeRemoveStorage(key) {
    try {
      if (window.localStorage) {
        window.localStorage.removeItem(key);
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  }

  function getTheme() {
    var saved = safeGetStorage(THEME_STORAGE_KEY);
    if (saved === "cozy" || saved === "light") {
      memoryTheme = saved;
      return saved;
    }
    return document.documentElement.getAttribute("data-theme") === "cozy" ? "cozy" : memoryTheme;
  }

  function applyTheme(theme) {
    var normalized = theme === "cozy" ? "cozy" : "light";
    memoryTheme = normalized;

    if (normalized === "cozy") {
      document.documentElement.setAttribute("data-theme", "cozy");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }

    safeSetStorage(THEME_STORAGE_KEY, normalized);

    var toggleBtn = document.getElementById("themeToggleBtn");
    if (toggleBtn) {
      var isCozy = normalized === "cozy";
      toggleBtn.setAttribute("aria-pressed", String(isCozy));
      toggleBtn.setAttribute(
        "aria-label",
        isCozy ? "Switch to light cream theme" : "Switch to cozy dark theme"
      );
      toggleBtn.textContent = isCozy ? "Light Theme" : "Cozy Theme";
    }
  }

  function initThemeToggle() {
    var toggleBtn = document.getElementById("themeToggleBtn");
    applyTheme(getTheme());

    if (!toggleBtn) {
      return;
    }

    toggleBtn.addEventListener("click", function () {
      var nextTheme = getTheme() === "cozy" ? "light" : "cozy";
      applyTheme(nextTheme);
    });
  }

  function initNavbarToggle() {
    var toggleBtn = document.querySelector(".navbar-toggler");
    var navCollapse = document.getElementById("mainNavbar");

    if (!toggleBtn || !navCollapse) {
      return;
    }

    toggleBtn.addEventListener("click", function () {
      var isExpanded = navCollapse.classList.toggle("show");
      toggleBtn.setAttribute("aria-expanded", String(isExpanded));
    });

    // Close mobile menu when a nav link is selected
    var navLinks = navCollapse.querySelectorAll(".nav-link");
    navLinks.forEach(function (link) {
      link.addEventListener("click", function () {
        if (navCollapse.classList.contains("show")) {
          navCollapse.classList.remove("show");
          toggleBtn.setAttribute("aria-expanded", "false");
        }
      });
    });

    // Allow Escape key to close an open mobile menu
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && navCollapse.classList.contains("show")) {
        navCollapse.classList.remove("show");
        toggleBtn.setAttribute("aria-expanded", "false");
        toggleBtn.focus();
      }
    });
  }

  function getSavedCartCount() {
    var raw = safeGetStorage(CART_STORAGE_KEY);
    if (!raw) {
      return 0;
    }
    try {
      var parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) {
        return 0;
      }
      return parsed.reduce(function (total, item) {
        var qty = Number(item && item.quantity);
        return total + (Number.isFinite(qty) && qty > 0 ? qty : 0);
      }, 0);
    } catch (error) {
      return 0;
    }
  }

  function updateNavCartBadge() {
    var badge = document.getElementById("navCartCount");
    if (!badge) {
      return;
    }
    var count = getSavedCartCount();
    badge.textContent = String(count);
    badge.setAttribute("aria-label", count + " items in cart");
  }

  document.addEventListener("DOMContentLoaded", function () {
    initThemeToggle();
    initNavbarToggle();
    updateNavCartBadge();
  });

  // Expose helpers so page scripts can share safe storage & badge updates
  window.SweetOvenNav = {
    updateCartBadge: updateNavCartBadge,
    safeGetStorage: safeGetStorage,
    safeSetStorage: safeSetStorage,
    safeRemoveStorage: safeRemoveStorage,
    getTheme: getTheme,
    setTheme: applyTheme
  };
})();
