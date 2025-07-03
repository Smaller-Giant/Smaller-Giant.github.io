const productInfo = document.getElementById('productInfo');
const imageSlider = document.getElementById('imageSlider');
const sliderImage = document.getElementById('sliderImage');
const prevBtn = imageSlider.querySelector('.prev-btn');
const nextBtn = imageSlider.querySelector('.next-btn');
const cartDrawer = document.getElementById('cartDrawer');
const cartCountEl = document.getElementById('cartCount');
const cartIcon = document.getElementById('cartIcon');

let cart = JSON.parse(localStorage.getItem('cart') || '[]');
updateCartCount();

let images = [];
let currentImageIndex = 0;

const slug = new URLSearchParams(location.search).get('product');
if (!slug) {
  productInfo.textContent = 'Product not specified.';
  document.title = 'Product Not Specified';
} else {
  fetch('folder/shoes.json')
    .then((res) => res.json())
    .then((list) => {
      const p = list.find((item) => item.slug === slug);
      if (!p) {
        productInfo.textContent = 'Product not found.';
        document.title = 'Product Not Found';
        return;
      }
      document.title = `${p.title} - SoleZone`;
      renderProduct(p);
    })
    .catch(() => {
      productInfo.textContent = 'Error loading product.';
    });
}

function renderProduct(p) {
  images = p.images.length ? p.images : ['images/placeholder.jpg'];
  currentImageIndex = 0;
  sliderImage.src = images[currentImageIndex];
  sliderImage.alt = p.title;

  // Setup slider buttons
  prevBtn.onclick = (e) => {
    e.stopPropagation();
    currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
    sliderImage.src = images[currentImageIndex];
  };
  nextBtn.onclick = (e) => {
    e.stopPropagation();
    currentImageIndex = (currentImageIndex + 1) % images.length;
    sliderImage.src = images[currentImageIndex];
  };

  // Render product info with all details
  productInfo.innerHTML = `
    <h2>${p.title}</h2>
    <p><strong>Price:</strong> £${p.price.replace('£', '')}</p>
    <p><strong>Size:</strong> ${p.info.size}</p>
    <p><strong>Condition:</strong> ${p.info.condition}</p>
    <p><strong>Color:</strong> ${p.info.color}</p>
    <p><strong>Material:</strong> ${p.info.material}</p>
    <p><strong>Shipping:</strong> ${p.info.shipping}</p>
    <p><strong>Box:</strong> ${p.info.box}</p>
    <p><strong>Authenticity:</strong> ${p.info.authenticity}</p>
    <a href="${p.buyLink}" target="_blank" class="buy-link">Buy Now</a>
    <button id="addCart" style="margin-top:16px;">Add to Cart</button>
  `;

  document.getElementById('addCart').onclick = () => addToCart(p);
}

function addToCart(p) {
  const existing = cart.find((item) => item.slug === p.slug);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({
      slug: p.slug,
      title: p.title,
      price: parseFloat(p.price.replace('£', '')),
      qty: 1,
      image: p.images[0] || 'images/placeholder.jpg',
    });
  }
  saveCart();
  alert(`Added "${p.title}" to cart`);
}

function updateCartCount() {
  cartCountEl.textContent = cart.reduce((sum, item) => sum + item.qty, 0);
}

function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
}

cartIcon.onclick = () => {
  cartDrawer.classList.toggle('hidden');
  renderDrawer();
};

function renderDrawer() {
  if (cart.length === 0) {
    cartDrawer.innerHTML = '<h3>Your Cart</h3><p>Empty.</p>';
    return;
  }
  cartDrawer.innerHTML = `
    <h3>Your Cart</h3>
    <ul style="list-style:none;padding:0;margin:0;">
      ${cart
        .map(
          (item, i) => `
        <li style="display:flex;gap:8px;margin-bottom:14px;">
          <img src="${item.image}" style="width:50px;height:50px;object-fit:cover;border-radius:6px;" alt="${item.title}">
          <div style="flex:1;">
            <strong>${item.title}</strong><br>£${item.price.toFixed(2)} × ${item.qty}
          </div>
          <button data-i="${i}" style="background:#f44336;border:none;color:#fff;border-radius:4px;cursor:pointer;">✕</button>
        </li>`
        )
        .join('')}
    </ul>
    <button id="closeDrawer" style="width:100%;padding:10px;background:#4caf50;border:none;color:#111;font-weight:600;border-radius:6px;">Close</button>
  `;
  cartDrawer.querySelectorAll('button[data-i]').forEach((btn) => {
    btn.onclick = () => {
      cart.splice(+btn.dataset.i, 1);
      saveCart();
      renderDrawer();
    };
  });
  cartDrawer.querySelector('#closeDrawer').onclick = () => cartDrawer.classList.add('hidden');
}
