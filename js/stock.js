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

menuToggle.onclick = () => dropdownMenu.classList.toggle('show');

fetch('folder/shoes.json?v=' + Date.now())
  .then(r => r.json())
  .then(data => { shoes = data; renderGrid(); })
  .catch(e => stockGrid.innerHTML = '<p style="color:#f44;">Failed loading shoes.</p>');

function renderGrid() {
  currentList = shoes.filter(shoe => {
    const sc = searchInput.value.trim().toLowerCase(),
          sim = shoe.title.toLowerCase().includes(sc),
          cif = !filterVal || shoe.info.condition === filterVal;
    return sim && cif;
  });

  stockGrid.innerHTML = '';
  if (!currentList.length) return noResults.style.display = 'block';
  noResults.style.display = 'none';

  currentList.forEach((shoe, i) => {
    const c = document.createElement('div');
    c.className = 'item-card'; c.tabIndex = 0;
    c.innerHTML = `<img src="${shoe.images[0] || 'https://via.placeholder.com/300x160?text=No+Image'}" alt="${shoe.title}">
      <h3>${shoe.title}</h3><p>${shoe.price}</p>`;
    c.onclick = () => openShoe(i);
    c.onkeydown = e => { if(e.key === 'Enter' || e.key === ' ') openShoe(i); };
    stockGrid.appendChild(c);
  });
}

searchInput.oninput = renderGrid;

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

function openShoe(idx) {
  curIdx = idx; curImg = 0;
  showExpanded();
}

function showExpanded() {
  const shoe = currentList[curIdx];
  mainImage.src = shoe.images[curImg] || 'https://via.placeholder.com/600x400?text=No+Image';
  shoeDetails.innerHTML = `
    <h2>${shoe.title}</h2>
    <p><strong>Price:</strong> ${shoe

