let products = [];
let filteredProducts = [];
let cart = [];
let currentExpandedIndex = 0;

const stockGrid = document.getElementById('stockGrid');
const noResults = document.getElementById('noResults');
const searchInput = document.getElementById('searchInput');
const filterWrapper = document.getElementById('filterWrapper');
const filterButton = document.getElementById('filterButton');
const filterOptions = document.getElementById('filterOptions');

const expandedPanel = document.getElementById('expandedPanel');
const mainImage = document.getElementById('mainImage');
const shoeDetails = document.getElementById('shoeDetails');
const arrowLeft = document.querySelector('.arrow-left');
const arrowRight = document.querySelector('.arrow-right');

const cartCount = document.getElementById('cart-count');
const cartItems = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const cartBtn = document.getElementById('cart-btn');
const cartDrawer = document.getElementById('cart-drawer');

// Load products from shoes.json in 'folder' directory
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

// Render shoe cards in grid
function renderStock() {
  stockGrid.innerHTML = '';
  if (filteredProducts.length === 0) {
    noResults.style.display = 'block';
    return;
  }
  noResults.style.display = 'none';

  filteredProducts.forEach((product, index) => {
    const card = document.createElement('div');
    card.className = 'item-card';
    card.dataset.index = index;
    card.innerHTML = `
      <img src="${product.images[0]}" alt="${product.title}" />
      <h3>${product.title}</h3>
      <p>${product.price ? `£${(product.price / 100).toFixed(2)}` : product.price}</p>
      <p><strong>Condition:</strong> ${product.info.condition}</p>
    `;
    card.addEventListener('click', () => openExpanded(index));
    stockGrid.appendChild(card);
  });
}

// Search & filter logic
searchInput.addEventListener('input', applyFilters);
filterButton.addEventListener('click', () => {
  filterWrapper.classList.toggle('open');
});
filterOptions.addEventListener('click', e => {
  if (!e.target.classList.contains('filter-option')) return;
  [...filterOptions.children].forEach(child => child.classList.remove('selected'));
  e.target.classList.add('selected');
  filterButton.textContent = e.target.textContent;
  filterWrapper.classList.remove('open');
  applyFilters();
});

function applyFilters() {
  const searchTerm = searchInput.value.toLowerCase();
  const selectedCondition = filterOptions.querySelector('.selected')?.dataset.val || '';

  filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm);
    const matchesCondition = selectedCondition === '' || product.info.condition.toLowerCase() === selectedCondition.toLowerCase();
    return matchesSearch && matchesCondition;
  });

  renderStock();
}

// Expanded view modal
function openExpanded(index) {
  currentExpandedIndex = index;
  showExpanded(currentExpandedIndex);
  expandedPanel.classList.add('active');
}

function showExpanded(index) {
  const product = filteredProducts[index];
  mainImage.src = product.images[0];
  mainImage.alt = product.title;

  // Build details HTML
  shoeDetails.innerHTML = `
    <h2>${product.title}</h2>
    <p><strong>Price:</strong> £${(product.price / 100).toFixed(2)}</p>
    <p><strong>Size:</strong> ${product.info.size}</p>
    <p><strong>Condition:</strong> ${product.info.condition}</p>
    <p><strong>Color:</strong> ${product.info.color}</p>
    <p><strong>Material:</strong> ${product.info.material}</p>
    <p><strong>Shipping:</strong> ${product.info.shipping}</p>
    <p><strong>Box:</strong> ${product.info.box}</p>
    <p><strong>Authenticity:</strong> ${product.info.authenticity}</p>
    <a href="${product.buyLink}" class="buy-link" target="_blank" rel="noopener noreferrer">Buy Now</a>
    <button id="addToCartBtn">Add to Cart</button>
  `;

  document.getElementById('addToCartBtn').onclick = () => addToCart(product.id);

  // Setup image navigation arrows
  arrowLeft.style.display = product.images.length > 1 ? 'flex' : 'none';
  arrowRight.style.display = product.images.length > 1 ? 'flex' : 'none';

  arrowLeft.onclick = () => {
    const imgs = product.images;
    const currentIndex = imgs.indexOf(mainImage.src.split('/').pop());
    let newIndex = imgs.indexOf(mainImage.src);
    if (newIndex === -1) newIndex = 0;
    else newIndex = (newIndex - 1 + imgs.length) % imgs.length;
    mainImage.src = imgs[newIndex];
  };
  arrowRight.onclick = () => {
    const imgs = product.images;
    let currentIndex = imgs.indexOf(mainImage.src);
    if (currentIndex === -1) currentIndex = 0;
    else currentIndex = (currentIndex + 1) % imgs.length;
    mainImage.src = imgs[currentIndex];
  };
}

// Close expanded view on background click
expandedPanel.addEventListener('click', e => {
  if (e.target === expandedPanel) {
    expandedPanel.classList.remove('active');
  }
});

// Cart functions
function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) return;
  cart.push(product);
  updateCart();
  alert(`Added "${product.title}" to cart!`);
}

function updateCart() {
  if (!cartCount || !cartItems || !cartTotal) return;

  cartCount.textContent = cart.length;
  cartItems.innerHTML = '';

  let total = 0;
  cart.forEach(item => {
    total += item.price;
    const li = document.createElement('li');
    li.textContent = `${item.title} - £${(item.price / 100).toFixed(2)}`;
    cartItems.appendChild(li);
  });

  cartTotal.textContent = `Total: £${(total / 100).toFixed(2)}`;
}

// Toggle cart drawer
if (cartBtn && cartDrawer) {
  cartBtn.addEventListener('click', () => {
    cartDrawer.classList.toggle('hidden');
  });
}
