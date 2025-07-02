// product.js

// Utility to get URL param
function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

const shoeId = getQueryParam('id');
const productContainer = document.getElementById('product-container');

if (!shoeId) {
  productContainer.innerHTML = '<p>Invalid product ID.</p>';
} else {
  fetch('../folder/shoes.json')  // <-- fixed path here
    .then(res => {
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return res.json();
    })
    .then(data => {
      // Add IDs to shoes like in stock.js for consistent matching
      const products = data.map((item, i) => ({
        ...item,
        id: `shoe${i + 1}`,
        price: parseFloat(item.price.replace('£', '')) * 100 || 0,
        images: item.images.length ? item.images : ['images/placeholder.jpg']
      }));

      const product = products.find(p => p.id === shoeId);

      if (!product) {
        productContainer.innerHTML = '<p>Product not found.</p>';
        return;
      }

      renderProduct(product);
    })
    .catch(err => {
      console.error('Failed to load shoes.json:', err);
      productContainer.innerHTML = '<p>Failed to load product data.</p>';
    });
}

function renderProduct(product) {
  productContainer.innerHTML = `
    <h1>${product.title}</h1>
    <div class="product-images">
      ${product.images.map((img, idx) => `<img src="${img}" alt="${product.title} image ${idx + 1}" />`).join('')}
    </div>
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

  document.getElementById('addToCartBtn').addEventListener('click', () => {
    alert(`Added "${product.title}" to cart!`);
    // TODO: Add to cart logic to persist across pages
  });
}
