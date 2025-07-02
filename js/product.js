function slugify(text) {
  return text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '');
}

// Get product name slug from URL param 'product'
const urlParams = new URLSearchParams(window.location.search);
const productSlug = urlParams.get('product');

const imageGallery = document.getElementById('imageGallery');
const productInfo = document.getElementById('productInfo');
const cartCountEl = document.getElementById('cartCount');
const cartIcon = document.getElementById('cartIcon');

let cart = JSON.parse(localStorage.getItem('cart')) || [];
updateCartCount();

if (!productSlug) {
  productInfo.innerHTML = '<p>Invalid product specified.</p>';
  imageGallery.innerHTML = '';
} else {
  fetch('folder/shoes.json')
    .then(res => {
      if (!res.ok) throw new Error('Failed to load shoes data');
      return res.json();
    })
    .then(data => {
      // Add slugs and normalize data
      const products = data.map((item, i) => ({
        ...item,
        slug: slugify(item.title),
        priceNum: parseFloat(item.price.replace('£', '')) || 0,
        images: item.images.length ? item.images : ['images/placeholder.jpg']
      }));

      // Find product by slug
      const product = products.find(p => p.slug === productSlug);

      if (!product) {
        productInfo.innerHTML = '<p>Product not found.</p>';
        imageGallery.innerHTML = '';
        document.title = 'Product Not Found - SoleZone';
        return;
      }

      // Update tab title dynamically
      document.title = `${product.title} - SoleZone`;

      renderProduct(product);
    })
    .catch(err => {
      console.error(err);
      productInfo.innerHTML = '<p>Failed to load product data.</p>';
      imageGallery.innerHTML = '';
    });
}

function renderProduct(product) {
  // Main image + thumbnails
  let mainImgSrc = product.images[0];
  imageGallery.innerHTML = `
    <img id="mainImage" class="main-image" src="${mainImgSrc}" alt="${product.title} main image" />
    <div class="thumbnail-row">
      ${product.images
        .map(
          (img, i) =>
            `<img src="${img}" alt="Thumbnail ${i + 1}" class="thumbnail${i === 0 ? ' selected' : ''}" data-src="${img}" />`
        )
        .join('')}
    </div>
  `;

  // Thumbnail click to swap main image
  const thumbnails = imageGallery.querySelectorAll('.thumbnail');
  const mainImageEl = document.getElementById('mainImage');
  thumbnails.forEach(thumb => {
    thumb.addEventListener('click', () => {
      mainImageEl.src = thumb.dataset.src;
      thumbnails.forEach(t => t.classList.remove('selected'));
      thumb.classList.add('selected');
    });
  });

  // Product info details layout
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
    <a href="${product.buyLink}" target="_blank" rel="noopener noreferrer" class="buy-link">Buy Now</a>
    <button id="addToCartBtn">Add to Cart</button>
  `;

  // Add to cart functionality
  document.getElementById('addToCartBtn').addEventListener('click', () => {
    addToCart(product);
  });
}

function updateCartCount() {
  cartCountEl.textContent = cart.reduce((acc, item) => acc + item.qty, 0);
}

function addToCart(product) {
  const existing = cart.find(item => item.slug === product.slug);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({
      slug: product.slug,
      id: product.id || '',
      title: product.title,
      price: product.priceNum,
      qty: 1,
      image: product.images[0]
    });
  }
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
  alert(`Added "${product.title}" to cart!`);
}

// Cart icon click: simple cart overview alert
cartIcon.addEventListener('click', () => {
  if (cart.length === 0) {
    alert('Your cart is empty.');
    return;
  }
  let summary = 'Your Cart:\n\n';
  cart.forEach((item, i) => {
    summary += `${i + 1}. ${item.title} — £${item.price.toFixed(2)} ×${item.qty}\n`;
  });
  alert(summary);
});
