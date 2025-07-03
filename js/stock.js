/* ---------- js/stock.js ---------- */

/* ---------- DOM refs ---------- */
const stockGrid     = document.getElementById('stockGrid');
const noResults     = document.getElementById('noResults');

const searchInput   = document.getElementById('searchInput');
const filterWrapper = document.getElementById('filterWrapper');
const filterButton  = document.getElementById('filterButton');
const filterOptions = document.getElementById('filterOptions');

const cartIcon      = document.getElementById('cart-btn');
const cartCountEl   = document.getElementById('cart-count');
const cartDrawer    = document.getElementById('cart-drawer');

/* ---------- helpers ---------- */
const slugify = txt =>
  txt.toLowerCase()
     .replace(/\s+/g, '-')
     .replace(/[^\w-]/g, '');

let products         = [];
let filteredProducts = [];

/* ---------- cart (localStorage) ---------- */
let cart = JSON.parse(localStorage.getItem('cart') || '[]');
updateCartBadge();

function updateCartBadge() {
  cartCountEl.textContent = cart.reduce((sum,i)=>sum+i.qty, 0);
}
function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartBadge();
}
function renderCartDrawer() {
  if (!cart.length) {
    cartDrawer.innerHTML = '<h3>Your Cart</h3><p>Empty.</p>';
    return;
  }
  cartDrawer.innerHTML = `
    <h3>Your Cart</h3>
    <ul style="list-style:none;margin:0;padding:0;">
      ${cart.map((it,i)=>`
        <li style="display:flex;gap:8px;margin-bottom:12px;align-items:center;">
          <img src="${it.image}" style="width:50px;height:50px;object-fit:cover;border-radius:6px;">
          <div style="flex:1;">
            <strong>${it.title}</strong><br>£${it.price.toFixed(2)} × ${it.qty}
          </div>
          <button data-i="${i}" style="background:#f44336;border:none;color:#fff;border-radius:4px;cursor:pointer;">✕</button>
        </li>`).join('')}
    </ul>
    <button id="closeDrawer" style="width:100%;padding:10px 0;background:#4caf50;border:none;color:#111;font-weight:600;border-radius:6px;">Close</button>
  `;
  cartDrawer.querySelectorAll('button[data-i]').forEach(btn=>{
    btn.onclick=()=>{
      cart.splice(+btn.dataset.i,1);
      saveCart();
      renderCartDrawer();
    };
  });
  cartDrawer.querySelector('#closeDrawer').onclick=()=>cartDrawer.classList.add('hidden');
}

/* ---------- fetch products ---------- */
fetch('folder/shoes.json')
  .then(r=>{
    if(!r.ok) throw new Error('JSON not found');
    return r.json();
  })
  .then(data=>{
    products = data.map(p=>({
      ...p,
      slug   : p.slug || slugify(p.title),                // ensure slug
      img    : p.images.length ? p.images[0] : 'images/placeholder.jpg',
      priceNum: parseFloat(p.price.replace('£','')) || 0  // numeric price
    }));
    filteredProducts = [...products];
    renderGrid();
  })
  .catch(err=>{
    console.error(err);
    noResults.textContent = 'Failed to load products.';
    noResults.style.display = 'block';
  });

/* ---------- grid render ---------- */
function renderGrid() {
  stockGrid.innerHTML = '';

  if (!filteredProducts.length) {
    noResults.style.display = 'block';
    return;
  }
  noResults.style.display = 'none';

  stockGrid.innerHTML = filteredProducts.map(p=>`
    <div class="item-card">
      <a href="product.html?product=${encodeURIComponent(p.slug)}">
        <img src="${p.img}" alt="${p.title}">
        <h3>${p.title}</h3>
      </a>
      <p>£${p.priceNum.toFixed(2)}</p>
      <p style="font-size:0.9rem;"><strong>Condition:</strong> ${p.info.condition}</p>
    </div>
  `).join('');
}

/* ---------- search / filter ---------- */
searchInput.addEventListener('input', applyFilters);

filterButton.addEventListener('click', ()=>
  filterWrapper.classList.toggle('open')
);

filterOptions.addEventListener('click', e=>{
  if (!e.target.classList.contains('filter-option')) return;
  [...filterOptions.children].forEach(c=>c.classList.remove('selected'));
  e.target.classList.add('selected');
  filterButton.textContent = e.target.textContent;
  filterWrapper.classList.remove('open');
  applyFilters();
});

function applyFilters() {
  const term = searchInput.value.trim().toLowerCase();
  const cond = filterOptions.querySelector('.selected')?.dataset.val.toLowerCase() || '';

  filteredProducts = products.filter(p=>{
    const nameMatch = p.title.toLowerCase().includes(term);
    const condMatch = !cond || p.info.condition.toLowerCase() === cond;
    return nameMatch && condMatch;
  });

  renderGrid();
}

/* ---------- cart icon click ---------- */
cartIcon.onclick = ()=>{
  renderCartDrawer();
  cartDrawer.classList.toggle('hidden');
};

/* ---------- init drawer style ---------- */
document.addEventListener('DOMContentLoaded',()=>{
  cartDrawer.classList.add('hidden');
});
