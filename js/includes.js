// Load an HTML snippet and insert into the given element by selector
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

// Load includes once DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  loadInclude('#header', 'includes/header.html');
  loadInclude('#hero', 'includes/hero.html');
  loadInclude('#footer', 'includes/footer.html');
});
