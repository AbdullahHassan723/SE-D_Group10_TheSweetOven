/* ==========================================================================
   The Sweet Oven - Shared Site JavaScript
   Handles the responsive mobile hamburger navigation menu without Bootstrap JS.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const togglers = document.querySelectorAll('.navbar-toggler');

  togglers.forEach((toggler) => {
    const targetId = toggler.getAttribute('aria-controls');
    const navCollapse = targetId
      ? document.getElementById(targetId)
      : document.querySelector('.navbar-collapse');

    if (!navCollapse) return;

    const closeMenu = () => {
      navCollapse.classList.remove('show');
      toggler.setAttribute('aria-expanded', 'false');
    };

    // Toggle the Bootstrap "show" class and update aria-expanded on button click
    toggler.addEventListener('click', () => {
      const isOpen = navCollapse.classList.toggle('show');
      toggler.setAttribute('aria-expanded', String(isOpen));
    });

    // Close the mobile menu when any navigation link inside it is clicked
    const navLinks = navCollapse.querySelectorAll('.nav-link');
    navLinks.forEach((link) => {
      link.addEventListener('click', closeMenu);
    });
  });
});
