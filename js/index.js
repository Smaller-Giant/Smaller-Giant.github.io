// index.js - handles mobile menu toggle on homepage

const menuToggle = document.querySelector('.menu-toggle');
const dropdownMenu = document.getElementById('dropdownMenu');

menuToggle.addEventListener('click', () => {
  dropdownMenu.classList.toggle('show');
});
