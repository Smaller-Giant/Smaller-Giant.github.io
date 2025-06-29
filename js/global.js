// Dropdown mobile menu toggle
const menuToggle = document.querySelector('.menu-toggle');
const dropdownMenu = document.getElementById('dropdownMenu');

menuToggle.addEventListener('click', () => {
  if (dropdownMenu.style.display === 'flex') {
    dropdownMenu.style.display = 'none';
  } else {
    dropdownMenu.style.display = 'flex';
  }
});

// Close dropdown menu when clicking outside
document.addEventListener('click', (e) => {
  if (!menuToggle.contains(e.target) && !dropdownMenu.contains(e.target)) {
    dropdownMenu.style.display = 'none';
  }
});

// Scroll animation for sections (fadeInUp)
document.querySelectorAll('section').forEach(section => {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });
  observer.observe(section);
});
