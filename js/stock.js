const searchInput = document.getElementById('searchInput'),
      filterWrapper = document.getElementById('filterWrapper'),
      filterButton = document.getElementById('filterButton'),
      filterOptions = document.getElementById('filterOptions'),
      stockGrid = document.getElementById('stockGrid'),
      noResults = document.getElementById('noResults'),
      expanded = document.getElementById('expandedPanel'),
      mainImage = document.getElementById('mainImage'),
      shoeDetails = document.getElementById('shoeDetails'),
      prevArrow = expanded.querySelector('.arrow-left'),
      nextArrow = expanded.querySelector('.arrow-right'),
      cartPanel = document.getElementById('cartPanel'),
      cartItems = document.getElementById('cartItems'),
      cartTotal = document.getElementById('cartTotal'),
      checkoutBtn = document.getElementById('checkoutBtn');

let shoes = [], filterVal = '', currentList = [], curIdx = 0, curImg = 0;
let cart = [];

// Load shoes
fetch('folder/shoes.json')
  .then(res => res.json())
  .then(data => {
    shoes = data;
    renderGrid();
  })
  .catch(() => stockGrid.innerHTML = '<p style="color:red;">Failed to load shoes.</p>');

// Search and filter
searchInput.oninput = renderGrid;
filterButton.onclick = () => filterWrapper.classList.toggle('open');
document.addEventListener('click', e => {
  if (!filterWrapper.contains(e.target)) filterWrapper.classList.remove('open');
});
filterOptions.querySelectorAll('.filter-option').forEach(opt => {
  opt.onclick = () => {
    filterOptions.querySelectorAll('.filter-option').forEach(o => o.classList.remove('selected'));
    opt.classList.add('selected');
    filterVal = opt.dataset.val;
    filterButton.textContent = opt.textContent;
    filterWrapper.classList.remove('open');
    renderGrid();
  };
});

// Render stock
function renderGrid() {
  const term = searchInput.value.toLowerCase().trim();
  currentList = shoes.filter(shoe =>
    shoe.title.toLowerCase().includes(term) &&
    (!filterVal || shoe.info.condition === filterVal)
  );
  stockGrid.innerHTML = '';
  if (!currentList.length) return noResults.style.display = 'block';
  noResults.style.display = 'none';
  currentList.forEach((shoe, i) => {
    const el = document.createElement('div');
    el.className = 'item-card';
    el.innerHTML = `
      <img src="${shoe.images[0]}" alt="${shoe.title}">
      <h3>${shoe.title}</h3>
      <p>${shoe.price}</p>
      <button class="add-to-cart">Add to Cart</button>`;
    el.querySelector('.add-to-cart').onclick = () => addToCart(shoe);
    el.onclick = e => {
      if (!e.target.classList.contains('add-to-cart')) openShoe(i);
    };
    stockGrid.appendChild(el);
  });
}

// Shoe expansion
function openShoe(index) {
  curIdx = index;
  curImg = 0;
  showExpanded();
}
function showExpanded() {
  const shoe = currentList[curIdx];
  mainImage.src = shoe.images[curImg];
  shoeDetails.innerHTML = `
    <h2>${shoe.title}</h2>
    <p><strong>Price:</strong> ${shoe.price}</p>
    <p><strong>Condition:</strong> ${shoe.info.condition}</p>
    <p><strong>Size:</strong> ${shoe.info.size}</p>
    <p><strong>Color:</strong> ${shoe.info.color}</p>
    <p><strong>Box:</strong> ${shoe.info.box}</p>
    <p><strong>Authenticity:</strong> ${shoe.info.authenticity}</p>
    <button onclick='addToCart(currentList[${curIdx}])'>Add to Cart</button>`;
  expanded.classList.add('active');
}
expanded.onclick = e => { if (e.target === expanded) expanded.classList.remove('active'); };
prevArrow.onclick = () => { curImg = (curImg - 1 + currentList[curIdx].images.length) % currentList[curIdx].images.length; showExpanded(); };
nextArrow.onclick = () => { curImg = (curImg + 1) % currentList[curIdx].images.length; showExpanded(); };
document.onkeydown = e => { if (e.key === 'Escape') expanded.classList.remove('active'); };

// Cart logic
function addToCart(shoe) {
  cart.push(shoe);
  updateCart();
}
function updateCart() {
  cartItems.innerHTML = '';
  let total = 0;
  cart.forEach((shoe, i) => {
    total += parseFloat(shoe.price.replace('£', ''));
    const li = document.createElement('li');
    li.textContent = shoe.title + ' - ' + shoe.price;
    cartItems.appendChild(li);
  });
  cartTotal.textContent = `Total: £${total.toFixed(2)}`;
}

// Placeholder checkout
checkoutBtn.onclick = () => {
  alert('Checkout will be handled by Stripe in production.');
};
