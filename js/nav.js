/**
 * The Sweet Oven - Shared Vanilla JS Navigation
 * Handles mobile hamburger menu toggle without Bootstrap JS.
 */
(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    const toggleBtn = document.querySelector('.navbar-toggler');
    const navCollapse = document.getElementById('mainNavbar');

    if (!toggleBtn || !navCollapse) {
      return;
    }

    toggleBtn.addEventListener('click', function () {
      const isOpen = navCollapse.classList.toggle('show');
      toggleBtn.setAttribute('aria-expanded', String(isOpen));
    });

    // Close mobile menu when a nav link is clicked on small screens
    navCollapse.querySelectorAll('.nav-link').forEach(function (link) {
      link.addEventListener('click', function () {
        if (window.innerWidth < 992 && navCollapse.classList.contains('show')) {
          navCollapse.classList.remove('show');
          toggleBtn.setAttribute('aria-expanded', 'false');
        }
      });
    });

    // Close mobile menu on Escape key for keyboard accessibility
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && navCollapse.classList.contains('show')) {
        navCollapse.classList.remove('show');
        toggleBtn.setAttribute('aria-expanded', 'false');
        toggleBtn.focus();
      }
    });
  });
})();
