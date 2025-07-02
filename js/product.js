// js/product.js

// Utility: slugify title to URL-friendly string
function slugify(text) {
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text
}

// Get product slug from URL ?product=shoe-name
function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

const productSlug = getQueryParam('product');
const imageGallery = document.getElementById('imageGallery');
const productInfo = document.getElementById('productInfo');
const cartCountEl = document.getElementById('cartCount');
const cartIcon = document.getElementById('cartIcon');

let cart = JSON.parse(localStorage.getItem('cart')) || [];
updateCartCount();

if (!productSlug) {
  productInfo.innerHTML = '<p>Invalid product.</p>';
} else {
  fetch('folder/shoes.json')
    .then(res => {
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return res.json();
    })
    .then(data => {
      // Add slug to each product for matching
      const products = data.map(item => ({
        ...item,
        slug: slugify(item.title),
        priceNum: parseFloat(item.price.replace('£', '')) || 0,
        images: item.images.length ? item.images : ['images/placeholder.jpg']
      }));

      const product = products.find(p => p.slug === productSlug);

      if (!product) {
        productInfo.innerHTML = '<p>Product not found.</p>';
        return;
      }

      document.title = product.title + ' - SoleZone'; // Update browser tab title
      renderProduct(product);
    })
    .catch(err => {
      console.error('Failed to load shoes.json:', err);
      productInfo.innerHTML = '<p>Failed to load product data.</p>';
    });
}

function renderProduct(product) {
  // Show main image and thumbnails
  let mainImgSrc = product.images[0];
  imageGallery.innerHTML = `
    <img id="mainImage" class="main-image" src="${mainImgSrc}" alt="${product.title} main image" />
    <div class="thumbnail-row">
      ${product.images.map((img, i) =>
        `<img src="${img}" alt="Thumbnail ${i + 1}" class="thumbnail${i === 0 ? ' selected' : ''}" data-src="${img}" />`
      ).join('')}
    </div>
  `;

  // Event listeners for thumbnails
  const thumbnails = imageGallery.querySelectorAll('.thumbnail');
  const mainImageEl = document.getElementById('mainImage');
  thumbnails.forEach(thumb => {
    thumb.addEventListener('click', () => {
      mainImageEl.src = thumb.dataset.src;
      thumbnails.forEach(t => t.classList.remove('selected'));
      thumb.classList.add('selected');
    });
  });

  // Show product info
  productInfo.innerHTML = `
    <h2>${product.title}</h2>
    <p><strong>Price:</strong> £${product.priceNum.toFixed(2)}</p>
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

  document.getElementById('addToCartBtn').addEventListener('click', () => {
    addToCart(product);
  });
}

// Cart management functions

function updateCartCount() {
  cartCountEl.textContent = cart.reduce((acc, item) => acc + item.qty, 0);
}

function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
  renderCartDrawer();
}

function addToCart(product) {
  const existing = cart.find(item => item.slug === product.slug);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({
      slug: product.slug,
      title: product.title,
      price: product.priceNum,
      qty: 1,
      image: product.images[0]
    });
  }
  saveCart();
  alert(`Added "${product.title}" to cart!`);
}

// Cart drawer code

// Create drawer container dynamically
const cartDrawer = document.createElement('div');
cartDrawer.id = 'cartDrawer';
document.body.appendChild(cartDrawer);

cartDrawer.style.cssText = `
  position: fixed;
  top: 0; right: -400px;
  width: 350px;
  height: 100vh;
  background: #222;
  color: #eee;
  box-shadow: -5px 0 15px rgba(0,0,0,0.7);
  padding: 20px;
  overflow-y: auto;
  transition: right 0.3s ease;
  z-index: 2000;
  display: flex;
  flex-direction: column;
`;

function renderCartDrawer() {
  if (cart.length === 0) {
    cartDrawer.innerHTML = `
      <h2>Your Cart</h2>
      <p>Your cart is empty.</p>
      <button id="closeCartBtn" style="margin-top:auto; padding:10px; background:#4caf50; border:none; border-radius:8px; color:#111; cursor:pointer;">Close</button>
    `;
  } else {
    cartDrawer.innerHTML = `
      <h2>Your Cart</h2>
      <ul style="list-style:none; padding:0; flex-grow:1; overflow-y:auto;">
        ${cart.map((item, i) => `
          <li style="display:flex; align-items:center; margin-bottom:15px; gap: 10px;">
            <img src="${item.image}" alt="${item.title}" style="width:50px; height:50px; object-fit:cover; border-radius:6px;" />
            <div style="flex-grow:1;">
              <strong>${item.title}</strong><br/>
              £${item.price.toFixed(2)} x ${item.qty} = £${(item.price * item.qty).toFixed(2)}
            </div>
            <button data-index="${i}" class="removeItemBtn" style="background:#f44336; border:none; border-radius:6px; color:#fff; padding:5px 8px; cursor:pointer;">✕</button>
          </li>
        `).join('')}
      </ul>
      <button id="closeCartBtn" style="padding:12px; background:#4caf50; border:none; border-radius:8px; color:#111; font-weight:600; cursor:pointer;">Close</button>
    `;
  }

  document.getElementById('closeCartBtn').addEventListener('click', () => {
    closeCartDrawer();
  });

  document.querySelectorAll('.removeItemBtn').forEach(btn => {
    btn.addEventListener('click', e => {
      const idx = parseInt(e.target.dataset.index);
      cart.splice(idx, 1);
      saveCart();
    });
  });
}

function openCartDrawer() {
  cartDrawer.style.right = '0';
}

function closeCartDrawer() {
  cartDrawer.style.right = '-400px';
}

cartIcon.addEventListener('click', () => {
  if (cartDrawer.style.right === '0px') {
    closeCartDrawer();
  } else {
    renderCartDrawer();
    openCartDrawer();
  }
});
