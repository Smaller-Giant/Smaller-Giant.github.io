const menuToggle = document.querySelector('.menu-toggle'),
      dropdownMenu = document.getElementById('dropdownMenu'),
      searchInput = document.getElementById('searchInput'),
      filterWrapper = document.getElementById('filterWrapper'),
      filterButton = document.getElementById('filterButton'),
      filterOptions = document.getElementById('filterOptions'),
      stockGrid = document.getElementById('stockGrid'),
      noResults = document.getElementById('noResults'),
      expanded = document.getElementById('expandedPanel'),
      mainImage = document.getElementById('mainImage'),
      shoeDetails = document.getElementById('shoeDetails'),
      prevArrow = expanded.querySelector('.arrow-left'),
      nextArrow = expanded.querySelector('.arrow-right');

let shoes = [], filterVal = '', currentList = [], curIdx = 0, curImg = 0;

// Mobile menu toggle
menuToggle.onclick = () => dropdownMenu.classList.toggle('show');

// Load shoes JSON
fetch('folder/shoes.json?v=' + Date.now())
  .then(res => res.json())
  .then(data => {
    shoes = data;
    renderGrid();
  })
  .catch(() => stockGrid.innerHTML = '<p style="color:#f44;">Failed loading shoes.</p>');

// Populate grid
function renderGrid() {
  const term = searchInput.value.trim().toLowerCase();
  currentList = shoes.filter(shoe => {
    const matchSearch = shoe.title.toLowerCase().includes(term),
          matchFilter = !filterVal || shoe.info.condition === filterVal;
    return matchSearch && matchFilter;
  });
  stockGrid.innerHTML = '';
  if (!currentList.length) return noResults.style.display = 'block';
  noResults.style.display = 'none';
  currentList.forEach((shoe, i) => {
    const card = document.createElement('div');
    card.className = 'item-card';
    card.tabIndex = 0;
    card.innerHTML = `
      <img src="${shoe.images[0] || 'https://via.placeholder.com/300x160?text=No+Image'}" alt="${shoe.title}">
      <h3>${shoe.title}</h3>
      <p>${shoe.price}</p>`;
    card.onclick = () => openShoe(i);
    card.onkeydown = e => {
      if (e.key === 'Enter' || e.key === ' ') openShoe(i);
    };
    stockGrid.appendChild(card);
  });
}

// Live search filtering
searchInput.oninput = renderGrid;

// Filter dropdown logic
filterButton.onclick = () => filterWrapper.classList.toggle('open');
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

// Expand a shoe
function openShoe(idx) {
  curIdx = idx;
  curImg = 0;
  showExpanded();
}

function showExpanded() {
  const shoe = currentList[curIdx];
  if (!shoe) return;
  mainImage.src = shoe.images[curImg] || 'https://via.placeholder.com/600x400?text=No+Image';
  shoeDetails.innerHTML = `
    <h2>${shoe.title}</h2>
    <p><strong>Price:</strong> ${shoe.price}</p>
    <p><strong>Condition:</strong> ${shoe.info.condition || 'N/A'}</p>
    <p><strong>Size:</strong> ${shoe.info.size || 'N/A'}</p>
    <p><strong>Color:</strong> ${shoe.info.color || 'N/A'}</p>
    <p><strong>Material:</strong> ${shoe.info.material || 'N/A'}</p>
    <p><strong>Shipping:</strong> ${shoe.info.shipping || 'N/A'}</p>
    <p><strong>Box:</strong> ${shoe.info.box || 'N/A'}</p>
    <p><strong>Authenticity:</strong> ${shoe.info.authenticity || 'N/A'}</p>
    <a href="${shoe.buyLink}" class="buy-link" target="_blank">Buy now</a>`;
  expanded.classList.add('active');
}

// Image carousel controls
prevArrow.onclick = () => {
  const imgs = currentList[curIdx]?.images || [];
  curImg = imgs.length ? (curImg - 1 + imgs.length) % imgs.length : 0;
  showExpanded();
};
nextArrow.onclick = () => {
  const imgs = currentList[curIdx]?.images || [];
  curImg = imgs.length ? (curImg + 1) % imgs.length : 0;
  showExpanded();
};

// Close modal
expanded.onclick = e => {
  if (e.target === expanded) expanded.classList.remove('active');
};
document.onkeydown = e => {
  if (e.key === 'Escape') expanded.classList.remove('active');
};
