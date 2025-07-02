const stockGrid = document.getElementById('stockGrid');
let shoes = [];
let expandedIndex = null;

// Load shoes.json dynamically
async function loadShoes() {
  try {
    const response = await fetch('shoes.json');
    if (!response.ok) throw new Error('Failed to fetch shoes.json');
    shoes = await response.json();
    renderShoes();
  } catch (err) {
    console.error(err);
    stockGrid.innerHTML = '<p style="color:#f44336;">Failed to load shoes data.</p>';
  }
}

function renderShoes() {
  stockGrid.innerHTML = '';
  shoes.forEach((shoe, index) => {
    const card = document.createElement('div');
    card.className = 'item-card';
    if (expandedIndex === index) card.classList.add('expanded');

    // Show first image or placeholder
    const firstImage = (shoe.images && shoe.images.length > 0) ? shoe.images[0] : 'images/no-image.png';

    // Build details HTML
    let infoHtml = '';
    for (const key in shoe.info) {
      infoHtml += `<p><strong>${capitalize(key)}:</strong> ${shoe.info[key]}</p>`;
    }

    card.innerHTML = `
      <div class="card-main" style="flex:1 1 auto;">
        <img src="${firstImage}" alt="${shoe.title}" />
        <h3>${shoe.title}</h3>
        <p class="price">${shoe.price}</p>
      </div>
      <div class="card-expanded-content" style="flex:2 1 300px; display:none; flex-direction: column; overflow-y: auto;">
        ${shoe.images && shoe.images.length > 1 ? imageSliderHtml(shoe.images, index) : ''}
        <div class="details">
          ${infoHtml}
          <a href="${shoe.buyLink}" target="_blank" class="buy-link">Buy Now</a>
        </div>
      </div>
    `;

    card.addEventListener('click', (e) => {
      // Prevent toggle if clicking inside expanded content (like slider buttons)
      if (e.target.closest('.card-expanded-content')) return;
      toggleExpand(index);
    });

    stockGrid.appendChild(card);
  });

  updateExpandedView();
  addSliderListeners();
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function imageSliderHtml(images, shoeIndex) {
  // Slider container with arrows and image
  return `
    <div class="image-slider" data-shoe-index="${shoeIndex}" data-current-index="0" style="position: relative; margin-bottom: 12px;">
      <button class="prev-btn" aria-label="Previous image" style="position: absolute; top:50%; left: 5px; transform: translateY(-50%); background: rgba(0,0,0,0.5); color:#fff; border:none; border-radius:50%; width:30px; height:30px; cursor:pointer;">&#10094;</button>
      <img src="${images[0]}" alt="Shoe Image" style="width:100%; border-radius: 10px;" />
      <button class="next-btn" aria-label="Next image" style="position: absolute; top:50%; right: 5px; transform: translateY(-50%); background: rgba(0,0,0,0.5); color:#fff; border:none; border-radius:50%; width:30px; height:30px; cursor:pointer;">&#10095;</button>
    </div>
  `;
}

function toggleExpand(index) {
  if (expandedIndex === index) {
    expandedIndex = null;
  } else {
    expandedIndex = index;
  }
  updateExpandedView();
}

function updateExpandedView() {
  Array.from(stockGrid.children).forEach((card, idx) => {
    const main = card.querySelector('.card-main');
    const expandedContent = card.querySelector('.card-expanded-content');
    if (idx === expandedIndex) {
      card.classList.add('expanded');
      expandedContent.style.display = 'flex';
    } else {
      card.classList.remove('expanded');
      expandedContent.style.display = 'none';
    }
  });
}

// Image slider buttons
function addSliderListeners() {
  const sliders = document.querySelectorAll('.image-slider');
  sliders.forEach(slider => {
    const shoeIndex = parseInt(slider.dataset.shoeIndex);
    const images = shoes[shoeIndex].images || [];
    let currentIndex = 0;

    const img = slider.querySelector('img');
    const prevBtn = slider.querySelector('.prev-btn');
    const nextBtn = slider.querySelector('.next-btn');

    prevBtn.onclick = (e) => {
      e.stopPropagation();
      currentIndex = (currentIndex - 1 + images.length) % images.length;
      img.src = images[currentIndex];
    };

    nextBtn.onclick = (e) => {
      e.stopPropagation();
      currentIndex = (currentIndex + 1) % images.length;
      img.src = images[currentIndex];
    };
  });
}

// Start app
loadShoes();
