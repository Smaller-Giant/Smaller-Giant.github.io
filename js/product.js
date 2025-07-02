// js/product.js

function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

const shoeId = getQueryParam('id');
const imageGallery = document.getElementById('imageGallery');
const productInfo = document.getElementById('productInfo');
const cartCountEl = document.getElementById('cartCount');
const cartIcon = document.getElementById('cartIcon');

let cart = JSON.parse(localStorage.getItem('cart')) || [];
updateCartCount();

if (!shoeId) {
  productInfo.innerHTML = '<p>Invalid product ID.</p>';
} else {
  fetch('folder/shoes.json')
    .then(res => {
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return res.json();
    })
    .then(data => {
      const products = data.map((item, i) => ({
        ...item,
        id: `shoe${i + 1}`,
        priceNum: parseFloat(item.price.replace('£', '')) || 0,
        images: item.images.length ? item.images : ['images/placeholder.jpg']
      }));

      const product = products.find(p => p.id === shoeId);

      if (!product) {
        productInfo.innerHTML = '<p>Product not found.</p>';
        return;
      }

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
      // Swap main image source
      mainImageEl.src = thumb.dataset.src;
      // Update selected styling
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

  // Add to cart button listener
  document.getElementById('addToCartBtn').addEventListener('click', () => {
    addToCart(product);
  });
}

// Cart management functions

function updateCartCount() {
  cartCountEl.textContent = cart.length;
}

// Add product to cart and save in localStorage
function addToCart(product) {
  // Check if already in cart (based on id)
  const exists = cart.some(item => item.id === product.id);
  if (!exists) {
    cart.push({
      id: product.id,
      title: product.title,
      price: product.priceNum,
      qty: 1,
      image: product.images[0]
    });
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    alert(`Added "${product.title}" to cart!`);
  } else {
    alert(`"${product.title}" is already in your cart.`);
  }
}

// (Optional) Click on cart icon to alert cart contents
cartIcon.addEventListener('click', () => {
  if (cart.length === 0) {
    alert('Your cart is empty.');
    return;
  }
  let cartSummary = 'Your Cart:\n\n';
  cart.forEach((item, i) => {
    cartSummary += `${i + 1}. ${item.title} — £${item.price.toFixed(2)} x${item.qty}\n`;
  });
  alert(cartSummary);
});
