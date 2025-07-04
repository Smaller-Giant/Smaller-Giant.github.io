// Function to load an HTML snippet and insert it into the page
async function loadInclude(selector, filePath) {
  const container = document.querySelector(selector);
  if (!container) return;

  try {
    const response = await fetch(filePath);
    if (!response.ok) throw new Error('Failed to load ' + filePath);
    const content = await response.text();
    container.innerHTML = content;
  } catch (err) {
    console.error(err);
  }
}

// Load header and hero includes on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  loadInclude('#header', 'includes/header.html');
  loadInclude('#hero', 'includes/hero.html');
});

// Dropdown menu toggle for mobile
function toggleMenu() {
  const dd = document.getElementById('dropdownMenu');
  if (!dd) return;
  if (dd.style.display === 'flex' || dd.classList.contains('show')) {
    dd.style.display = 'none';
    dd.classList.remove('show');
  } else {
    dd.style.display = 'flex';
    dd.classList.add('show');
  }
}

// Attach event listener for menu toggle after header loads
document.addEventListener('DOMContentLoaded', () => {
  // Wait a moment to ensure header is loaded
  setTimeout(() => {
    const menuToggle = document.querySelector('.menu-toggle');
    const dropdownMenu = document.getElementById('dropdownMenu');

    if (menuToggle && dropdownMenu) {
      menuToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMenu();
      });

      // Close dropdown if clicking outside
      document.addEventListener('click', (e) => {
        if (!menuToggle.contains(e.target) && !dropdownMenu.contains(e.target)) {
          dropdownMenu.style.display = 'none';
          dropdownMenu.classList.remove('show');
        }
      });
    }
  }, 200);
});

// Animate sections when they come into viewport
window.addEventListener('load', () => {
  document.querySelectorAll('section').forEach(section => {
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        section.classList.add('visible');
        observer.disconnect();
      }
    }, { threshold: 0.2 });
    observer.observe(section);
  });
});
