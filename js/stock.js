/* js/stock.js */

const stockGrid   = document.getElementById('stockGrid');
const noResults   = document.getElementById('noResults');
const cartIcon    = document.getElementById('cartIcon');
const cartCountEl = document.getElementById('cartCount');
const cartDrawer  = document.getElementById('cartDrawer');

let shoes = [];
let cart  = JSON.parse(localStorage.getItem('cart') || '[]');
updateCartCount();

/* ---- Helpers --------------------------------------------------------- */
const slugify = txt => txt.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');

function updateCartCount() {
  cartCountEl.textContent = cart.reduce((s, i) => s + i.qty, 0);
}

function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
}

function renderCartDrawer() {
  if (!cart.length) {
    cartDrawer.innerHTML = '<h3 style="margin-top:0;">Your Cart</h3><p>Empty.</p>';
    return;
  }
  cartDrawer.innerHTML = `
    <h3 style="margin-top:0;">Your Cart</h3>
    <ul style="list-style:none;padding:0;margin:0;">
      ${cart.map((item,i)=>`
        <li style="margin-bottom:12px;display:flex;gap:8px;align-items:center;">
          <img src="${item.image}" style="width:50px;height:50px;object-fit:cover;border-radius:6px;">
          <div style="flex:1;">
            <strong>${item.title}</strong><br>£${item.price.toFixed(2)} × ${item.qty}
          </div>
          <button data-i="${i}" style="background:#f44336;border:none;color:#fff;border-radius:4px;cursor:pointer;">✕</button>
        </li>`).join('')}
    </ul>
    <button id="closeCartBtn" style="width:100%;padding:10px 0;background:#4caf50;border:none;color:#111;font-weight:600;border-radius:6px;">Close</button>
  `;
  cartDrawer.querySelectorAll('button[data-i]').forEach(btn=>{
    btn.onclick = e=>{
      cart.splice(+btn.dataset.i,1);
      saveCart();           // update storage & badge
      renderCartDrawer();   // re‑render drawer
    };
  });
  cartDrawer.querySelector('#closeCartBtn').onclick = ()=>cartDrawer.classList.add('hidden');
}
/* --------------------------------------------------------------------- */

/* FETCH + RENDER STOCK */
fetch('folder/shoes.json')
  .then(r=>r.json())
  .then(data=>{
    shoes = data;
    if(!shoes.length){ noResults.style.display='block'; return; }
    stockGrid.innerHTML = shoes.map(s=>`
      <div class="item-card">
        <a href="product.html?product=${s.slug}">
          <img src="${s.images[0] || 'images/placeholder.jpg'}" alt="${s.title}">
          <h3>${s.title}</h3>
        </a>
        <p>${s.price}</p>
      </div>
    `).join('');
  })
  .catch(()=> noResults.style.display='block');

/* CART ICON CLICK */
cartIcon.onclick = ()=>{
  renderCartDrawer();
  cartDrawer.classList.toggle('hidden');
};

/* Initialise drawer position (CSS helper) */
document.addEventListener('DOMContentLoaded',()=>{
  cartDrawer.classList.add('hidden');
});
