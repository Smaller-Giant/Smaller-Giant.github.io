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

// Load includes when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  loadInclude('header', 'includes/header.html');
  loadInclude('footer', 'includes/footer.html');
  loadInclude('.hero', 'includes/hero.html');
});
