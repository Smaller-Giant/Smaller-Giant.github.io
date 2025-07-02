// stock.js

let products = [];
let filteredProducts = [];

const stockGrid = document.getElementById('stockGrid');
const noResults = document.getElementById('noResults');
const searchInput = document.getElementById('searchInput');
const filterWrapper = document.getElementById('filterWrapper');
const filterButton = document.getElementById('filterButton');
const filterOptions = document.getElementById('filterOptions');

// Load products from shoes.json
fetch('folder/shoes.json')
  .then(res => res.json())
  .then(data => {
    products = data.map((item, i) => ({
      ...item,
      id: `shoe${i + 1}`,
      price: parseFloat(item.price.replace('£', '')) * 100 || 0,
      images: item.images.length ? item.images : ['images/placeholder.jpg']
    }));
    filteredProducts = [...products];
    renderStock();
  })
  .catch(err => {
    console.error('Failed to load shoes.json', err);
    noResults.textContent = 'Failed to load products.';
    noResults.style.display = 'block';
  });

// Render shoe cards in grid with links to product page
function renderStock() {
  stockGrid.innerHTML = '';
  if (filteredProducts.length === 0) {
    noResults.style.display = 'block';
    return;
  }
  noResults.style.display = 'none';

  filteredProducts.forEach(product => {
    const card = document.createElement('div');
    card.className = 'item-card';
    card.innerHTML = `
      <a href="product.html?id=${product.id}">
        <img src="${product.images[0]}" alt="${product.title}" />
        <h3>${product.title}</h3>
      </a>
      <p>${product.price ? `£${(product.price / 100).toFixed(2)}` : product.price}</p>
      <p><strong>Condition:</strong> ${product.info.condition}</p>
    `;
    stockGrid.appendChild(card);
  });
}

// Filter dropdown toggle
filterButton.addEventListener('click', () => {
  filterWrapper.classList.toggle('open');
});

// Filter option selection
filterOptions.addEventListener('click', e => {
  if (!e.target.classList.contains('filter-option')) return;

  // Remove "selected" from all options
  Array.from(filterOptions.children).forEach(child => child.classList.remove('selected'));

  // Mark clicked option as selected
  e.target.classList.add('selected');

  // Update filter button text
  filterButton.textContent = e.target.textContent;

  // Close dropdown
  filterWrapper.classList.remove('open');

  // Apply filters
  applyFilters();
});

// Search input event
searchInput.addEventListener('input', applyFilters);

function applyFilters() {
  const searchTerm = searchInput.value.trim().toLowerCase();
  const selectedCondition = filterOptions.querySelector('.selected')?.dataset.val || '';

  filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm);

    // If selectedCondition is empty string or "All", ignore condition filtering
    const matchesCondition = selectedCondition === '' || selectedCondition.toLowerCase() === 'all' || 
      product.info.condition.toLowerCase() === selectedCondition.toLowerCase();

    return matchesSearch && matchesCondition;
  });

  renderStock();
}
