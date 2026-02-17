import {
  initializeApp
} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-app.js";

import {
  getFirestore,
  setDoc,
  getDoc,
  deleteDoc,
  updateDoc,
  collection,
  getDocs,
  doc
} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";

// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyCynS0fBEQNjZ51eRJS4GPHqBUJaZ8j2EA",
  authDomain: "ecommerce-217d0.firebaseapp.com",
  projectId: "ecommerce-217d0",
  storageBucket: "ecommerce-217d0.firebasestorage.app",
  messagingSenderId: "1063978456472",
  appId: "1:1063978456472:web:95e50d9f7a8b32e42a07ed"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let selectedId = null;

// Add Product Function
window.product = async () => {
  const title = document.getElementById("title").value;
  const brand = document.getElementById("brand").value;
  const quantity = document.getElementById("quantity").value;
  const quality = document.getElementById("quality").value;
  const price = document.getElementById("price").value;

  if (!title) return alert("Product name is required!");

  // Use title as ID (you can also use timestamp or UUID)
  const id = title.toLowerCase().replace(/\s/g, "-");

  await setDoc(doc(db, "product", id), {
    title,
    brand,
    quantity,
    quality,
    price
  });

  clearForm();
  showAllProducts();
};

// Delete Product
window.deleteProduct = async (id) => {
  await deleteDoc(doc(db, "product", id));
  showAllProducts();
};

// Edit Product (fill form for editing)
window.editProduct = async (id) => {
  const docRef = doc(db, "product", id);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    selectedId = id;
    const data = docSnap.data();
    document.getElementById("title").value = data.title;
    document.getElementById("brand").value = data.brand;
    document.getElementById("quantity").value = data.quantity;
    document.getElementById("quality").value = data.quality;
    document.getElementById("price").value = data.price;
  }
};

// Update Product
window.updateProduct = async () => {
  if (!selectedId) return alert("Click a product to edit!");

  const docRef = doc(db, "product", selectedId);
  await updateDoc(docRef, {
    title: document.getElementById("title").value,
    brand: document.getElementById("brand").value,
    quantity: document.getElementById("quantity").value,
    quality: document.getElementById("quality").value,
    price: document.getElementById("price").value
  });

  clearForm();
  showAllProducts();
};

// Cancel — clear inputs
window.cancel = () => {
  clearForm();
};

// Clear form data
function clearForm() {
  document.getElementById("title").value = "";
  document.getElementById("brand").value = "";
  document.getElementById("quantity").value = "";
  document.getElementById("quality").value = "";
  document.getElementById("price").value = "";
  selectedId = null;
}

// Show all products
async function showAllProducts() {
  const showdata = document.getElementById("showdata");
  showdata.innerHTML = "";

  const querySnapshot = await getDocs(collection(db, "product"));

  querySnapshot.forEach(docItem => {
    const data = docItem.data();
    const id = docItem.id;

    showdata.innerHTML += `
      <div class="bg-white border shadow-md rounded-xl p-5 transition hover:shadow-xl">
        <h2 class="text-2xl font-bold text-blue-600 mb-1">${data.title}</h2>
        <p><span class="font-semibold text-gray-700">Brand:</span> ${data.brand}</p>
        <p><span class="font-semibold text-gray-700">Quantity:</span> ${data.quantity}</p>
        <p><span class="font-semibold text-gray-700">Quality:</span> ${data.quality}</p>
        <p class="text-green-600 font-bold">$${data.price}</p>

        <div class="flex gap-2 mt-3">
          <button onclick="editProduct('${id}')"
            class="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded-lg">
            Edit
          </button>

          <button onclick="deleteProduct('${id}')"
            class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg">
            Delete
          </button>
        </div>
      </div>
    `;
  });
}

// Load products on startup
showAllProducts();
