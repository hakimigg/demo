// Global modal function
function openModal(product) {
  const modal = document.getElementById("productModal");
  const modalImage = document.getElementById("modalImage");
  const modalTitle = document.getElementById("modalTitle");
  const modalPrice = document.getElementById("modalPrice");
  const modalCondition = document.getElementById("modalCondition");
  const modalCategory = document.getElementById("modalCategory");
  const modalBrand = document.getElementById("modalBrand");
  const modalDescription = document.getElementById("modalDescription");
  const modalPhone = document.getElementById("modalPhone");
  const modalLocation = document.getElementById("modalLocation");

  modalImage.src = product.image || "";
  modalImage.alt = product.name;
  modalTitle.textContent = product.name;
  modalPrice.textContent = `${product.price} DZD`;
  modalCondition.textContent = `Condition: ${product.condition}`;
  modalCategory.textContent = product.category;
  modalBrand.textContent = product.brand;
  modalDescription.textContent = product.description;
  modalPhone.textContent = product.phone;
  modalLocation.textContent = product.location;

  modal.style.display = "block";
  document.body.style.overflow = "hidden";
}

document.addEventListener("DOMContentLoaded", function () {
  function getProducts() {
    return JSON.parse(localStorage.getItem("products") || "[]");
  }

  function saveProducts(products) {
    localStorage.setItem("products", JSON.stringify(products));
  }

  const sampleProducts = [
    {
      name: "Samsung Galaxy S23 Ultra",
      price: "150000",
      condition: "10/10",
      category: "Smartphones",
      brand: "Samsung",
      image: "images/image1.jpeg",
      description: "Flagship Samsung phone with 200MP camera, 12GB RAM, 1TB storage.",
      phone: "+213 555 123 456",
      location: "Kouba",
      created: Date.now() - 1000000
    },
    {
      name: "iPhone 14 Pro Max",
      price: "170000",
      condition: "10/10",
      category: "Smartphones",
      brand: "Apple",
      image: "images/image2.jpeg",
      description: "Latest iPhone with Dynamic Island and A16 chip.",
      phone: "+213 777 123 111",
      location: "Bab El Oued",
      created: Date.now() - 990000
    },
    {
      name: "Redmi Note 12 Pro",
      price: "65000",
      condition: "9/10",
      category: "Smartphones",
      brand: "Redmi",
      image: "images/image3.jpeg",
      description: "Affordable phone with 108MP camera, 8GB RAM, 256GB storage.",
      phone: "+213 555 654 321",
      location: "Cheraga",
      created: Date.now() - 950000
    },
    {
      name: "Asus ROG Zephyrus G14",
      price: "200000",
      condition: "10/10",
      category: "Laptops",
      brand: "Asus",
      image: "images/image4.png",
      description: "Gaming laptop with Ryzen 9, RTX 4060, 1TB SSD.",
      phone: "+213 555 999 000",
      location: "El Madania",
      created: Date.now() - 920000
    },
    {
      name: "HP Pavilion 15 Laptop",
      price: "95000",
      condition: "9/10",
      category: "Laptops",
      brand: "HP",
      image: "images/image5.jpeg",
      description: "15.6'' FHD, Intel i7, 16GB RAM, 512GB SSD, Windows 11.",
      phone: "+213 555 888 999",
      location: "Hydra",
      created: Date.now() - 900000
    },
    {
      name: "Lenovo IdeaPad Slim 5",
      price: "72000",
      condition: "8/10",
      category: "Laptops",
      brand: "Lenovo",
      image: "images/image6.jpeg",
      description: "Slim design with Ryzen 5, 8GB RAM, 512GB SSD.",
      phone: "+213 661 400 222",
      location: "Bir Mourad Rais",
      created: Date.now() - 870000
    },
    {
      name: "Samsung 55'' 4K Smart TV",
      price: "120000",
      condition: "10/10",
      category: "TV",
      brand: "Samsung",
      image: "images/image7.jpeg",
      description: "Crystal UHD, HDR, Smart TV with voice assistant.",
      phone: "+213 555 444 555",
      location: "El Harrach",
      created: Date.now() - 850000
    },
    {
      name: "Sony Bravia 50'' TV",
      price: "95000",
      condition: "9/10",
      category: "TV",
      brand: "Sony",
      image: "images/image8.jpeg",
      description: "4K Ultra HD LED with Android TV features.",
      phone: "+213 555 543 987",
      location: "Birkhadem",
      created: Date.now() - 820000
    },
    {
      name: "Hoco W35 Wireless Headphones",
      price: "3500",
      condition: "10/10",
      category: "Headphones",
      brand: "Hoco",
      image: "images/image9.webp",
      description: "Bluetooth headphones with deep bass and 40h battery life.",
      phone: "+213 555 222 333",
      location: "Bab Ezzouar",
      created: Date.now() - 800000
    },
    {
      name: "JBL Tune 500BT",
      price: "7500",
      condition: "9/10",
      category: "Headphones",
      brand: "JBL",
      image: "images/image10.jpeg",
      description: "On-ear wireless headphones with pure bass sound.",
      phone: "+213 555 777 888",
      location: "Tizi Ouzou",
      created: Date.now() - 780000
    },
    {
      name: "TP-Link WiFi Adapter AC600",
      price: "2500",
      condition: "10/10",
      category: "WiFi Adapters",
      brand: "TP-Link",
      image: "images/image11.jpeg",
      description: "Dual band USB WiFi adapter for PC and laptop.",
      phone: "+213 555 666 777",
      location: "Bir Mourad Rais",
      created: Date.now() - 760000
    },
    {
      name: "Apple Watch Series 8",
      price: "85000",
      condition: "10/10",
      category: "Smartwatches",
      brand: "Apple",
      image: "images/image12.jpeg",
      description: "Latest Apple Watch, GPS + Cellular, 45mm, Silver Aluminum.",
      phone: "+213 555 111 222",
      location: "Birkhadem",
      created: Date.now() - 740000
    },
    {
      name: "Hoco X14 Fast Charging Cable",
      price: "700",
      condition: "10/10",
      category: "Accessories",
      brand: "Hoco",
      image: "images/image13.png",
      description: "1m USB-C to USB-A fast charging cable, 3A output.",
      phone: "+213 555 333 444",
      location: "Bab El Oued",
      created: Date.now() - 700000
    }
  ];

  // Always overwrite products with sample data for demo
  saveProducts(sampleProducts);

  function renderProducts(products) {
    const grid = document.getElementById("productsGrid");
    if (!products.length) {
      grid.innerHTML = `
        <div class="empty-state">
          <h3>No products available</h3>
          <p>There are currently no products to display.</p>
        </div>`;
      return;
    }

    grid.innerHTML = products.map((p, i) => `
      <div class="product-card" style="animation-delay: ${i * 0.1}s" data-product='${JSON.stringify(p).replace(/"/g, '&quot;')}'>
        <div class="product-image">
          ${p.image ? `<img src="${p.image}" alt="${p.name}">` : `<div class="image-placeholder">No image</div>`}
        </div>
        <div class="product-info">
          <div class="product-title">${p.name}</div>
          <div class="product-condition">Condition: ${p.condition}</div>
          <div class="product-price">${p.price} DZD</div>
          <div class="product-description">${p.description}</div>
          <div class="contact-info">
            <div class="phone">${p.phone}</div>
            <div class="location">${p.location}</div>
          </div>
        </div>
      </div>
    `).join("");
  }

  // Filtering functionality
  function filterProducts() {
    const searchTerm = document.getElementById("searchInput").value.toLowerCase();
    const categoryFilter = document.getElementById("filterCategory").value;
    const conditionFilter = document.getElementById("filterCondition").value;
    const minPrice = document.getElementById("minPrice").value;

    const products = getProducts();
    
    const filteredProducts = products.filter(product => {
      // Search filter
      const matchesSearch = product.name.toLowerCase().includes(searchTerm) || 
                           product.description.toLowerCase().includes(searchTerm) ||
                           product.brand.toLowerCase().includes(searchTerm);
      
      // Category filter
      const matchesCategory = !categoryFilter || product.category === categoryFilter;
      
      // Condition filter
      const matchesCondition = !conditionFilter || product.condition === conditionFilter;
      
      // Price filter
      const productPrice = parseInt(product.price);
      const minPriceNum = minPrice ? parseInt(minPrice) : 0;
      const matchesPrice = productPrice >= minPriceNum;
      
      return matchesSearch && matchesCategory && matchesCondition && matchesPrice;
    });
    
    renderProducts(filteredProducts);
  }

  // Add event listeners for all filter inputs
  document.getElementById("searchInput").addEventListener("input", filterProducts);
  document.getElementById("filterCategory").addEventListener("change", filterProducts);
  document.getElementById("filterCondition").addEventListener("change", filterProducts);
  document.getElementById("minPrice").addEventListener("input", filterProducts);

  // Close modal when clicking the X button
  document.querySelector(".close").addEventListener("click", function() {
    const modal = document.getElementById("productModal");
    modal.style.display = "none";
    document.body.style.overflow = "auto";
  });

  // Close modal when clicking outside of it
  window.addEventListener("click", function(event) {
    const modal = document.getElementById("productModal");
    if (event.target === modal) {
      modal.style.display = "none";
      document.body.style.overflow = "auto";
    }
  });

  // Close modal with Escape key
  document.addEventListener("keydown", function(event) {
    if (event.key === "Escape") {
      const modal = document.getElementById("productModal");
      if (modal.style.display === "block") {
        modal.style.display = "none";
        document.body.style.overflow = "auto";
      }
    }
  });

  renderProducts(getProducts());

  // Add click event listeners to product cards
  document.addEventListener('click', function(e) {
    if (e.target.closest('.product-card')) {
      const card = e.target.closest('.product-card');
      const productData = card.getAttribute('data-product');
      if (productData) {
        const product = JSON.parse(productData.replace(/&quot;/g, '"'));
        openModal(product);
      }
    }
  });

  function createParticles() {
    const container = document.getElementById("particles");
    for (let i = 0; i < 50; i++) {
      const p = document.createElement("div");
      p.className = "particle";
      p.style.left = Math.random() * 100 + "%";
      p.style.animationDelay = Math.random() * 15 + "s";
      p.style.animationDuration = Math.random() * 10 + 10 + "s";
      container.appendChild(p);
    }
  }

  createParticles();
});
