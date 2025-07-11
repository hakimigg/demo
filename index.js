import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-analytics.js";
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyCHmc0JYyz1S-8mTleIG94gfLhKrvONdvQ",
  authDomain: "fir-963c4.firebaseapp.com",
  projectId: "fir-963c4",
  storageBucket: "fir-963c4.appspot.com",
  messagingSenderId: "1803094593",
  appId: "1:1803094593:web:618565cc395f294673d4c0",
  measurementId: "G-8PFC0TNWDW"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const storage = getStorage(app);

document.addEventListener("DOMContentLoaded", function () {
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
    if (file.size > maxSize) return alert("File must be less than 5MB.");
    if (!allowed.includes(file.type)) return alert("Only JPG, PNG, and GIF files are allowed.");

    try {
      selectedImageBase64 = await fileToBase64(file);
      previewImage.src = selectedImageBase64;
      imagePreview.style.display = "block";
    } catch {
      alert("Failed to preview image.");
    }
  }

  document.getElementById("productForm").addEventListener("submit", async function (e) {
    e.preventDefault();
    let imageUrl = selectedImageBase64;

    if (selectedImageBase64.startsWith("data:")) {
      try {
        const blob = await (await fetch(selectedImageBase64)).blob();
        const storageRef = ref(storage, `product-images/${Date.now()}.jpg`);
        await uploadBytes(storageRef, blob);
        imageUrl = await getDownloadURL(storageRef);
      } catch (err) {
        console.error("Image upload failed:", err);
      }
    }

    const product = {
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

  function renderProducts(products) {
    const grid = document.getElementById("productsGrid");

    if (!products.length) {
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

  function listenToProducts() {
    const q = query(collection(db, "products"), orderBy("created", "desc"));
    onSnapshot(q, (snapshot) => {
      const products = snapshot.docs.map(doc => doc.data());
      renderProducts(products);
    });
  }

  function toggleAdmin() {
    const panel = document.getElementById("adminPanel");
    const button = document.querySelector(".admin-toggle");
    panel.classList.toggle("active");
    if (panel.classList.contains("active")) {
      button.textContent = "Hide Admin";
      button.style.background = "rgba(220, 53, 69, 0.8)";
    } else {
      button.textContent = "Admin Panel";
      button.style.background = "#3a7afe";
    }
  }

  const adminBtn = document.querySelector(".admin-toggle");
  if (adminBtn) {
    adminBtn.addEventListener("click", () => {
      console.log("Admin button clicked!");
      toggleAdmin();
    });
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

  createParticles();
  listenToProducts();
});
