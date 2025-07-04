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
  const menu = document.getElementById('dropdownMenu');
  if (menu) menu.classList.toggle('show');
}

// Close dropdown when clicking outside
document.addEventListener('click', function (e) {
  const toggle = document.getElementById('menuToggle');
  const dropdown = document.getElementById('dropdownMenu');

  if (!toggle.contains(e.target) && !dropdown.contains(e.target)) {
    dropdown.classList.remove('show');
  }
});


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
