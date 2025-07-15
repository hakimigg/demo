import { getFirestore, collection, addDoc, onSnapshot, query, orderBy } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-storage.js";

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
      image: "images/samsung-galaxy-s23-ultra.jpg",
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
      image: "images/iphone-14-pro-max.jpg",
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
      image: "images/redmi-note-12-pro.jpg",
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
      image: "images/asus-rog-zephyrus-g14.jpg",
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
      image: "images/hp-pavilion-15-laptop.jpg",
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
      image: "images/lenovo-ideapad-slim-5.jpg",
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
      image: "images/samsung-55-4k-smart-tv.jpg",
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
      image: "images/sony-bravia-50-tv.jpg",
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
      image: "images/hoco-w35-wireless-headphones.jpg",
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
      image: "images/jbl-tune-500bt.jpg",
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
      image: "images/tp-link-wifi-adapter-ac600.jpg",
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
      image: "images/apple-watch-series-8.jpg",
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
      image: "images/hoco-x14-fast-charging-cable.jpg",
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
      <div class="product-card" style="animation-delay: ${i * 0.1}s">
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

  renderProducts(getProducts());

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
