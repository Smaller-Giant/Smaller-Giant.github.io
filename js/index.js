function toggleMenu() {
  const d = document.getElementById('dropdownMenu');
  d.style.display = d.style.display === 'flex' ? 'none' : 'flex';
}

document.querySelectorAll('section').forEach(sec => {
  const obs = new IntersectionObserver(e => {
    if (e[0].isIntersecting) {
      sec.classList.add('visible');
      obs.disconnect();
    }
  }, { threshold: 0.2 });
  obs.observe(sec);
});
