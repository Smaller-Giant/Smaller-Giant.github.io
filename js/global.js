// Dropdown toggle for mobile nav
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.menu-toggle');
  const dropdown = document.getElementById('dropdownMenu');

  if (toggle && dropdown) {
    toggle.addEventListener('click', () => {
      dropdown.style.display = dropdown.style.display === 'flex' ? 'none' : 'flex';
    });
  }

  // Prevent auto scroll on mobile reload
  window.scrollTo(0, 0);
});
