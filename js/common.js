// Dropdown toggle
const menuToggle = document.querySelector('.menu-toggle');
const dropdownMenu = document.getElementById('dropdownMenu');

menuToggle.addEventListener('click', () => {
  if (dropdownMenu.style.display === 'flex') {
    dropdownMenu.style.display = 'none';
  } else {
    dropdownMenu.style.display = 'flex';
    dropdownMenu.style.flexDirection = 'column';
  }
});

// Close dropdown if clicked outside
document.addEventListener('click', (event) => {
  if (!dropdownMenu.contains(event.target) && !menuToggle.contains(event.target)) {
    dropdownMenu.style.display = 'none';
  }
});
