/* js/product.js */

const imageGallery  = document.getElementById('imageGallery');
const productInfo   = document.getElementById('productInfo');
const cartDrawer    = document.getElementById('cartDrawer');
const cartCountEl   = document.getElementById('cartCount');
const cartIcon      = document.getElementById('cartIcon');

const slugify = txt=>txt.toLowerCase().replace(/\s+/g,'-').replace(/[^\w-]/g,'');

let cart = JSON.parse(localStorage.getItem('cart')||'[]');
updateCartCount();

/* ---- load product by slug ------------------------------------------- */
const slug = new URLSearchParams(location.search).get('product');
if(!slug){ productInfo.textContent='Product not specified.'; }
else{
  fetch('folder/shoes.json')
    .then(r=>r.json())
    .then(list=>{
      const p=list.find(x=>x.slug===slug);
      if(!p){ productInfo.textContent='Product not found.'; document.title='Not found'; return; }

      document.title = `${p.title} - SoleZone`;
      renderProduct(p);
    })
    .catch(()=>productInfo.textContent='Error loading product.');
}

/* ---- functions ------------------------------------------------------ */
function renderProduct(p){
  /* gallery */
  imageGallery.innerHTML = `
    <img id="mainImg" src="${p.images[0]||'images/placeholder.jpg'}" style="width:100%;border-radius:12px;object-fit:contain;max-height:420px;background:#222">
    <div class="thumbnail-row" style="display:flex;gap:10px;margin-top:12px;overflow-x:auto;">
      ${p.images.map((src,i)=>`<img data-s="${src}" class="thumb${i?'':' sel'}" style="width:70px;height:70px;object-fit:cover;border-radius:8px;cursor:pointer;border:2px solid ${i?'transparent':'#4caf50'}">`).join('')}
    </div>
  `;
  const mainImg = document.getElementById('mainImg');
  imageGallery.querySelectorAll('.thumb').forEach(t=>{
    t.src=t.dataset.s;
    t.onclick=()=>{
      mainImg.src=t.dataset.s;
      imageGallery.querySelectorAll('.thumb').forEach(x=>x.style.borderColor='transparent');
      t.style.borderColor='#4caf50';
    };
  });

  /* info */
  productInfo.innerHTML = `
    <h2 style="color:#4caf50;margin-top:0;">${p.title}</h2>
    <p><strong>Price:</strong> £${p.price.replace('£','')}</p>
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
  document.getElementById('addCart').onclick=()=>addToCart(p);
}

function addToCart(p){
  const existing = cart.find(i=>i.slug===p.slug);
  existing ? existing.qty++ :
    cart.push({slug:p.slug,title:p.title,price:parseFloat(p.price.replace('£','')),qty:1,image:p.images[0]});
  saveCart();
  alert(`Added "${p.title}" to cart`);
}

function updateCartCount(){ cartCountEl.textContent=cart.reduce((s,i)=>s+i.qty,0); }
function saveCart(){ localStorage.setItem('cart',JSON.stringify(cart)); updateCartCount(); }

/* Drawer render/handlers */
cartIcon.onclick=()=>{ cartDrawer.classList.toggle('hidden'); renderDrawer(); };
function renderDrawer(){
  if(cart.length===0){ cartDrawer.innerHTML='<h3>Your Cart</h3><p>Empty.</p>'; return; }
  cartDrawer.innerHTML = `
    <h3>Your Cart</h3>
    <ul style="list-style:none;padding:0;margin:0;">
      ${cart.map((it,i)=>`
        <li style="display:flex;gap:8px;margin-bottom:14px;">
          <img src="${it.image}" style="width:50px;height:50px;object-fit:cover;border-radius:6px;">
          <div style="flex:1;">
            <strong>${it.title}</strong><br>£${it.price.toFixed(2)} × ${it.qty}
          </div>
          <button data-i="${i}" style="background:#f44336;border:none;color:#fff;border-radius:4px;cursor:pointer;">✕</button>
        </li>`).join('')}
    </ul>
    <button id="closeDrawer" style="width:100%;padding:10px;background:#4caf50;border:none;color:#111;font-weight:600;border-radius:6px;">Close</button>
  `;
  cartDrawer.querySelectorAll('button[data-i]').forEach(btn=>{
    btn.onclick=()=>{ cart.splice(+btn.dataset.i,1); saveCart(); renderDrawer(); };
  });
  cartDrawer.querySelector('#closeDrawer').onclick=()=>cartDrawer.classList.add('hidden');
}
