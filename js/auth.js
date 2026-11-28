/* ==========================================================================
   The Sweet Oven - Shared Authentication Helper (js/auth.js)
   Provides current-user lookup and updates the header "Login" link to
   "Hi, <name> | Logout" on any page that includes this script.
   ========================================================================== */

(function (global) {
  "use strict";

  var USERS_STORAGE_KEY = "sweetOvenUsers";
  var CURRENT_USER_KEY = "sweetOvenCurrentUser";
  var LEGACY_DEMO_EMAIL = "ayesha@mail.com";

  function safeParseJSON(raw, fallback) {
    if (!raw) return fallback;
    try {
      return JSON.parse(raw);
    } catch (err) {
      return fallback;
    }
  }

  function normalizeEmail(email) {
    return String(email || "").trim().toLowerCase();
  }

  function cleanupLegacyData() {
    try {
      var rawUsers = localStorage.getItem(USERS_STORAGE_KEY);
      if (rawUsers !== null) {
        var parsedUsers = safeParseJSON(rawUsers, []);
        if (!Array.isArray(parsedUsers)) {
          localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify([]));
        } else {
          var changed = false;
          var cleanedUsers = [];

          for (var i = 0; i < parsedUsers.length; i += 1) {
            var u = parsedUsers[i];
            if (!u || typeof u !== "object") {
              changed = true;
              continue;
            }
            var email = normalizeEmail(u.email);
            if (!email || email === LEGACY_DEMO_EMAIL) {
              changed = true;
              continue;
            }
            var pts = Number(u.points);
            if (!Number.isFinite(pts) || pts === 120 || pts < 0) {
              if (pts === 120 || !Number.isFinite(pts) || pts < 0) {
                changed = true;
              }
              pts = 0;
            }
            var fullName = String(u.fullName || u.name || "").trim();
            if (!u.fullName && u.name) {
              changed = true;
            }
            cleanedUsers.push({
              fullName: fullName,
              email: email,
              phone: String(u.phone || "").trim(),
              password: String(u.password || ""),
              points: pts
            });
          }

          if (changed) {
            localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(cleanedUsers));
          }
        }
      }

      var rawCurrent = localStorage.getItem(CURRENT_USER_KEY);
      if (rawCurrent !== null) {
        var current = safeParseJSON(rawCurrent, null);
        if (!current || typeof current !== "object" || normalizeEmail(current.email) === LEGACY_DEMO_EMAIL) {
          localStorage.removeItem(CURRENT_USER_KEY);
        } else {
          var curPts = Number(current.points);
          var curName = String(current.fullName || current.name || "").trim();
          var curEmail = normalizeEmail(current.email);
          if (!curEmail || !curName) {
            localStorage.removeItem(CURRENT_USER_KEY);
          } else if (curPts === 120 || !Number.isFinite(curPts) || curPts < 0 || (!current.fullName && current.name)) {
            localStorage.setItem(
              CURRENT_USER_KEY,
              JSON.stringify({
                fullName: curName,
                email: curEmail,
                phone: String(current.phone || "").trim(),
                points: !Number.isFinite(curPts) || curPts === 120 || curPts < 0 ? 0 : curPts
              })
            );
          }
        }
      }
    } catch (err) {
      // Ignore storage access errors
    }
  }

  function getCurrentUser() {
    cleanupLegacyData();
    try {
      var user = safeParseJSON(localStorage.getItem(CURRENT_USER_KEY), null);
      if (!user || typeof user !== "object") {
        return null;
      }
      var email = normalizeEmail(user.email);
      var fullName = String(user.fullName || user.name || "").trim();
      if (!email || !fullName) {
        return null;
      }
      var points = Number(user.points);
      return {
        fullName: fullName,
        email: email,
        phone: String(user.phone || "").trim(),
        points: Number.isFinite(points) && points >= 0 ? points : 0
      };
    } catch (err) {
      return null;
    }
  }

  function setCurrentUser(user) {
    if (!user || !user.email) return;
    var points = Number(user.points);
    var payload = {
      fullName: String(user.fullName || user.name || "").trim(),
      email: normalizeEmail(user.email),
      phone: String(user.phone || "").trim(),
      points: Number.isFinite(points) && points >= 0 ? points : 0
    };
    try {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(payload));
    } catch (err) {
      // Ignore storage write errors
    }
    updateHeaderAuthUI();
  }

  function logoutUser() {
    try {
      localStorage.removeItem(CURRENT_USER_KEY);
    } catch (err) {
      // Ignore storage errors
    }
    updateHeaderAuthUI();
    try {
      document.dispatchEvent(new CustomEvent("sweetoven:logout"));
    } catch (err) {
      // Fallback for older environments
    }
  }

  function updateHeaderAuthUI() {
    var navList = document.querySelector(".site-header .navbar-nav");
    if (!navList) return;

    var loginLink = navList.querySelector('a.nav-link[href$="login.html"]');
    var authNavItem = navList.querySelector("[data-auth-nav-item='true']");

    if (!authNavItem && loginLink) {
      authNavItem = loginLink.closest(".nav-item") || loginLink.parentElement;
      if (authNavItem) {
        authNavItem.setAttribute("data-auth-nav-item", "true");
        authNavItem.setAttribute("data-login-href", loginLink.getAttribute("href") || "login.html");
        authNavItem.setAttribute("data-login-active", loginLink.classList.contains("active") ? "true" : "false");
      }
    }

    if (!authNavItem) return;

    var user = getCurrentUser();
    var loginHref = authNavItem.getAttribute("data-login-href") || "login.html";
    var isLoginActive = authNavItem.getAttribute("data-login-active") === "true";

    authNavItem.textContent = "";

    if (user) {
      var wrapper = document.createElement("div");
      wrapper.className = "nav-link nav-auth-status d-inline-flex align-items-center gap-2";

      var greetingSpan = document.createElement("span");
      greetingSpan.textContent = "Hi, " + user.fullName;

      var sepSpan = document.createElement("span");
      sepSpan.setAttribute("aria-hidden", "true");
      sepSpan.textContent = "|";

      var logoutBtn = document.createElement("button");
      logoutBtn.type = "button";
      logoutBtn.className = "nav-auth-logout-btn";
      logoutBtn.textContent = "Logout";
      logoutBtn.setAttribute("aria-label", "Logout " + user.fullName);
      logoutBtn.addEventListener("click", function () {
        logoutUser();
      });

      wrapper.appendChild(greetingSpan);
      wrapper.appendChild(sepSpan);
      wrapper.appendChild(logoutBtn);
      authNavItem.appendChild(wrapper);
    } else {
      var link = document.createElement("a");
      link.className = isLoginActive ? "nav-link active" : "nav-link";
      if (isLoginActive) {
        link.setAttribute("aria-current", "page");
      }
      link.href = loginHref;
      link.textContent = "Login";
      authNavItem.appendChild(link);
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    cleanupLegacyData();
    updateHeaderAuthUI();
  });

  global.SweetOvenAuth = {
    USERS_STORAGE_KEY: USERS_STORAGE_KEY,
    CURRENT_USER_KEY: CURRENT_USER_KEY,
    cleanupLegacyData: cleanupLegacyData,
    getCurrentUser: getCurrentUser,
    setCurrentUser: setCurrentUser,
    logoutUser: logoutUser,
    updateHeaderAuthUI: updateHeaderAuthUI
  };
})(window);
