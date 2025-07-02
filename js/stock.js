const shoes = [
  {
    "title": "Nike Dunks",
    "price": "£45",
    "images": [
      "images/IMG-20250620-WA0001.jpg",
      "images/IMG-20250620-WA0002.jpg",
      "images/IMG-20250620-WA0003.jpg",
      "images/IMG-20250620-WA0006.jpg",
      "images/IMG-20250620-WA0007.jpg"
    ],
    "info": {
      "size": "UK 6",
      "condition": "New",
      "color": "White/Black",
      "material": "Leather and mesh",
      "shipping": "Ships in 1-2 days",
      "box": "Includes original box and tags",
      "authenticity": "Authenticity guaranteed"
    },
    "buyLink": "https://www.vinted.co.uk/member/233654539"
  },
  // ... rest of shoes
];

const stockGrid = document.getElementById('stockGrid');

let expandedIndex = null;

function renderShoes() {
  stockGrid.innerHTML = '';
  shoes.forEach((shoe, index) => {
    const card = document.createElement('div');
    card.className = 'item-card';
    
    let imagesHtml = '';
    if(shoe.images.length > 0) {
      imagesHtml = `
        <div class="image-slider" data-index="0">
          <img src="${shoe.images[0]}" alt="${shoe.title}" class="main-image" />
          <button class="prev-btn" aria-label="Previous image">&#10094;</button>
          <button class="next-btn" aria-label="Next image">&#10095;</button>
        </div>
      `;
    } else {
      imagesHtml = `<div class="image-slider no-images">No images available</div>`;
    }
    
    let infoHtml = '';
    for(const key in shoe.info) {
      infoHtml += `<p><strong>${key.charAt(0).toUpperCase() + key.slice(1)}:</strong> ${shoe.info[key]}</p>`;
    }
    
    const expandedHtml = `
      <div class="expanded-info" style="display:none;">
        ${imagesHtml}
        <h3>${shoe.title}</h3>
        <p><strong>Price:</strong> ${shoe.price}</p>
        ${infoHtml}
        <a href="${shoe.buyLink}" target="_blank" class="buy-link">Buy Now</a>
      </div>
    `;
    
    card.innerHTML = `
      <h3>${shoe.title}</h3>
      <p>${shoe.price}</p>
      ${expandedHtml}
    `;

    // Expand/collapse logic on click
    card.addEventListener('click', (e) => {
      // Avoid toggling if clicking inside buttons inside expanded-info (like buy button or arrows)
      if(e.target.closest('.expanded-info')) return;

      if(expandedIndex === index) {
        collapseCard(index);
      } else {
        if(expandedIndex !== null) collapseCard(expandedIndex);
        expandCard(index);
      }
    });

    stockGrid.appendChild(card);
  });

  // After render, add event listeners for image sliders
  addImageSliderListeners();
}

function expandCard(index) {
  const card = stockGrid.children[index];
  const expanded = card.querySelector('.expanded-info');
  if(expanded) {
    expanded.style.display = 'block';
    expandedIndex = index;
  }
}

function collapseCard(index) {
  const card = stockGrid.children[index];
  const expanded = card.querySelector('.expanded-info');
  if(expanded) {
    expanded.style.display = 'none';
    expandedIndex = null;
  }
}

function addImageSliderListeners() {
  const sliders = document.querySelectorAll('.image-slider');
  sliders.forEach(slider => {
    const images = shoes.find(shoe => shoe.images.length > 0).images;
    let currentIndex = 0;

    const mainImage = slider.querySelector('.main-image');
    const prevBtn = slider.querySelector('.prev-btn');
    const nextBtn = slider.querySelector('.next-btn');

    if(!mainImage) return;

    prevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      currentIndex = (currentIndex - 1 + images.length) % images.length;
      mainImage.src = images[currentIndex];
    });

    nextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      currentIndex = (currentIndex + 1) % images.length;
      mainImage.src = images[currentIndex];
    });
  });
}

renderShoes();
