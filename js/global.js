function toggleMenu() {
  const dd = document.getElementById('dropdownMenu');
  dd.style.display = dd.style.display === 'flex' ? 'none' : 'flex';
}
document.addEventListener('click', e => {
  const mt = document.querySelector('.menu-toggle');
  const dd = document.getElementById('dropdownMenu');
  if (!mt.contains(e.target) && !dd.contains(e.target)) {
    dd.style.display = 'none';
  }
});
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
