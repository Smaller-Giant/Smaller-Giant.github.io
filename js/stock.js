const products = [
  {
    id: "shoe1",
    name: "Nike Air Max 90",
    price: 11000, // in pence (Stripe uses smallest currency unit)
    image: "images/nike1.jpg"
  },
  {
    id: "shoe2",
    name: "Adidas Ultraboost",
    price: 12000,
    image: "images/adidas1.jpg"
  },
  {
    id: "shoe3",
    name: "Jordan 1 Low",
    price: 9500,
    image: "images/jordan1.jpg"
  }
];

const cart = [];

function renderStock() {
  const container = document.getElementById("stock-list");
  products.forEach(product => {
    const card = document.createElement("div");
    card.className = "shoe-card";
    card.innerHTML = `
      <img src="${product.image}" alt="${product.name}" />
      <h4>${product.name}</h4>
      <p>£${(product.price / 100).toFixed(2)}</p>
      <button onclick="addToCart('${product.id}')">Add to Cart</button>
    `;
    container.appendChild(card);
  });
}

function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  cart.push(product);
  updateCartDisplay();
}

function updateCartDisplay() {
  const cartCount = document.getElementById("cart-count");
  const cartItems = document.getElementById("cart-items");
  cartCount.textContent = cart.length;

  cartItems.innerHTML = "";
  cart.forEach(item => {
    const li = document.createElement("li");
    li.textContent = `${item.name} - £${(item.price / 100).toFixed(2)}`;
    cartItems.appendChild(li);
  });
}

document.getElementById("cart-btn").addEventListener("click", () => {
  document.getElementById("cart-drawer").classList.toggle("hidden");
});

document.getElementById("checkout-btn").addEventListener("click", async () => {
  const response = await fetch("/create-checkout-session", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ items: cart })
  });
  const session = await response.json();
  window.location.href = session.url;
});

renderStock();
