import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-analytics.js";
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyCHmc0JYyz1S-8mTleIG94gfLhKrvONdvQ",
  authDomain: "fir-963c4.firebaseapp.com",
  projectId: "fir-963c4",
  storageBucket: "fir-963c4.firebasestorage.app",
  messagingSenderId: "1803094593",
  appId: "1:1803094593:web:618565cc395f294673d4c0",
  measurementId: "G-8PFC0TNWDW"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const storage = getStorage(app);

document.addEventListener("DOMContentLoaded", function () {
  let products = [];
  let isAdminMode = false;
  let selectedImageBase64 = "";
  const imageInput = document.getElementById("imageInput");
  const imagePreview = document.getElementById("imagePreview");
  const previewImage = document.getElementById("previewImage");
  const removeImageBtn = document.getElementById("removeImage");

  if (imageInput) {
    imageInput.addEventListener("change", async (e) => {
      const file = e.target.files[0];
      if (file) await handleFile(file);
    });
  }
  if (removeImageBtn) {
    removeImageBtn.addEventListener("click", () => {
      selectedImageBase64 = "";
      previewImage.src = "";
      imagePreview.style.display = "none";
      imageInput.value = "";
    });
  }

  function fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  async function handleFile(file) {
    const maxSize = 5 * 1024 * 1024;
    const allowed = ["image/jpeg", "image/png", "image/gif"];

    if (file.size > maxSize) {
      alert("File must be less than 5MB.");
      return;
    }

    if (!allowed.includes(file.type)) {
      alert("Only JPG, PNG, and GIF files are allowed.");
      return;
    }

    try {
      selectedImageBase64 = await fileToBase64(file);
      previewImage.src = selectedImageBase64;
      imagePreview.style.display = "block";
    } catch (err) {
      alert("Failed to preview image.");
    }
  }

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

  function saveProducts() {
    try {
      localStorage.setItem("electronics-store-products", JSON.stringify(products));
      return true;
    } catch (err) {
      console.error("Save failed:", err);
      return false;
    }
  }

  function loadProducts() {
    try {
      const saved = localStorage.getItem("electronics-store-products");
      if (saved) {
        products = JSON.parse(saved);
        return true;
      }
    } catch (err) {
      console.error("Load failed:", err);
    }
    return false;
  }

  function toggleAdmin() {
    isAdminMode = !isAdminMode;
    const panel = document.getElementById("adminPanel");
    const button = document.querySelector(".admin-toggle");
    if (isAdminMode) {
      panel.classList.add("active");
      button.textContent = "Hide Admin";
      button.style.background = "rgba(220, 53, 69, 0.8)";
    } else {
      panel.classList.remove("active");
      button.textContent = "Admin Panel";
      button.style.background = "rgba(255,255,255,0.2)";
    }
  }

  document.getElementById("productForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    let imageUrl = selectedImageBase64;
    
    // Upload image to Firebase Storage if it's a base64 image
    if (selectedImageBase64 && selectedImageBase64.startsWith('data:')) {
      try {
        const response = await fetch(selectedImageBase64);
        const blob = await response.blob();
        const storageRef = ref(storage, `product-images/${Date.now()}_image.jpg`);
        await uploadBytes(storageRef, blob);
        imageUrl = await getDownloadURL(storageRef);
      } catch (err) {
        console.error("Failed to upload image to Firebase:", err);
        imageUrl = selectedImageBase64;
      }
    }

    const product = {
      id: Date.now(),
      name: document.getElementById("productName").value,
      price: document.getElementById("productPrice").value,
      condition: document.getElementById("productCondition").value,
      category: document.getElementById("productCategory").value,
      image: imageUrl || "",
      description: document.getElementById("productDescription").value,
      phone: document.getElementById("phoneNumber").value,
      location: document.getElementById("shopLocation").value,
      created: Date.now()
    };

    products.push(product);
    renderProducts();
    saveProducts();

    // Save to Firebase Firestore
    try {
      await addDoc(collection(db, "products"), product);
    } catch (err) {
      console.error("Failed to save to Firestore:", err);
    }

    const btn = document.querySelector(".btn");
    const originalText = btn.textContent;
    btn.textContent = "Product Saved! ✓";
    btn.classList.add("loading");
    setTimeout(() => {
      btn.textContent = originalText;
      btn.classList.remove("loading");
    }, 2000);

    this.reset();
    selectedImageBase64 = "";
    previewImage.src = "";
    imagePreview.style.display = "none";
    imageInput.value = "";
  });

  function renderProducts() {
    const grid = document.getElementById("productsGrid");

    if (products.length === 0) {
      grid.innerHTML = `
        <div class="empty-state">
          <h3>No products available</h3>
          <p>Use the admin panel to add your first product!</p>
        </div>`;
      return;
    }

    grid.innerHTML = products.map((p, i) => `
      <div class="product-card" style="animation-delay: ${i * 0.1}s">
        <div class="product-image">
          ${p.image
            ? `<img src="${p.image}" alt="${p.name}">`
            : `<div class="image-placeholder">No image added yet</div>`}
        </div>
        <div class="product-info">
          <div class="product-title">${p.name}</div>
          <div class="product-condition">Condition: ${p.condition}</div>
          <div class="product-price">${p.price}</div>
          <div class="product-description">${p.description}</div>
          <div class="contact-info">
            <div class="phone">${p.phone}</div>
            <div class="location">${p.location}</div>
          </div>
        </div>
      </div>
    `).join("");
  }

  function initializeStore() {
    const loaded = loadProducts();
    if (!loaded) {
      products = [
        {
          id: 1,
          name: "iPhone 14 Pro Max",
          price: "$899",
          condition: "9/10",
          category: "Smartphones",
          image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=300&fit=crop",
          description: "Excellent condition iPhone 14 Pro Max with 256GB storage. Includes original box, charger, and screen protector.",
          phone: "+213 (555) 123-456",
          location: "Algiers"
        },
        {
          id: 2,
          name: "Sony WH-1000XM4",
          price: "$199",
          condition: "8/10",
          category: "Headphones",
          image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400&h=300&fit=crop",
          description: "Premium noise-canceling headphones. Great condition. Includes case.",
          phone: "+213 (555) 987-654",
          location: "Oran"
        }
      ];
      saveProducts();
    }
    renderProducts();
  }

  createParticles();
  initializeStore();
});
