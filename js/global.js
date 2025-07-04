// Load HTML includes (header and hero)
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

document.addEventListener('DOMContentLoaded', async () => {
  await loadInclude('#header', 'includes/header.html');
  await loadInclude('#hero', 'includes/hero.html');

  setupDropdown(); // setup dropdown only after header is loaded
});

// Setup mobile dropdown toggle and outside click close
function setupDropdown() {
  const menuToggle = document.getElementById('menuToggle');
  const dropdownMenu = document.getElementById('dropdownMenu');

  if (!menuToggle || !dropdownMenu) return;

  menuToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    dropdownMenu.classList.toggle('show');
  });

  // Close dropdown when clicking outside
  document.addEventListener('click', (e) => {
    if (!menuToggle.contains(e.target) && !dropdownMenu.contains(e.target)) {
      dropdownMenu.classList.remove('show');
    }
  });
}

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
