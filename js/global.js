// Menu toggle for mobile dropdown
function toggleMenu() {
  const dd = document.getElementById('dropdownMenu');
  dd.style.display = dd.style.display === 'flex' ? 'none' : 'flex';
}

const menuToggle = document.querySelector('.menu-toggle');
const dropdownMenu = document.getElementById('dropdownMenu');

menuToggle.addEventListener('click', () => {
  dropdownMenu.classList.toggle('show');
});

// Close dropdown if clicking outside
document.addEventListener('click', (e) => {
  if (!menuToggle.contains(e.target) && !dropdownMenu.contains(e.target)) {
    dropdownMenu.classList.remove('show');
    dropdownMenu.style.display = 'none';
  }
});

// Animate sections when in viewport
window.addEventListener('load', () => {
  document.querySelectorAll('section').forEach(sec => {
    const obs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        sec.classList.add('visible');
        obs.disconnect();
      }
    }, { threshold: 0.2 });
    obs.observe(sec);
  });
});

// Optional: Another include loader (if you want)
// If you don't want this, you can remove it and keep only includes.js loader above
function loadIncludes() {
  const includes = {
    '#header': 'includes/header.html',
    '#hero': 'includes/hero.html',
    '#footer': 'includes/footer.html'
  };

  for (const [selector, url] of Object.entries(includes)) {
    const el = document.querySelector(selector);
    if (el) {
      fetch(url)
        .then(res => res.text())
        .then(html => {
          el.innerHTML = html;

          // Customize hero content if needed
          if (selector === '#hero') {
            const title = el.dataset.title || 'Discover Your Next Trainers';
            const subtitle = el.dataset.subtitle || 'Authentic • Fast shipping • Secure checkout';
            if (el.querySelector('#hero-title')) el.querySelector('#hero-title').textContent = title;
            if (el.querySelector('#hero-subtitle')) el.querySelector('#hero-subtitle').textContent = subtitle;
          }
        })
        .catch(console.error);
    }
  }
}

document.addEventListener('DOMContentLoaded', loadIncludes);
