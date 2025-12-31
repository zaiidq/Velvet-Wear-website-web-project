

let products = JSON.parse(localStorage.getItem("products")) || [
  {
    id: 1,
    name: "Women's Collection",
    category: "women",
    price: 599.99,
    stock: 112,
    description: "Modern high-quality women's clothing set.",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500"
  },
  {
    id: 2,
    name: "Classic Men's Shirt",
    category: "men",
    price: 45.00,
    stock: 25,
    description: "Elegant slim-fit cotton shirt for men.",
    image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500"
  },
  {
    id: 3,
    name: "Kids' Winter Hoodie",
    category: "kids",
    price: 35.50,
    stock: 40,
    description: "Warm and cozy fleece hoodie for children.",
    image: "https://images.unsplash.com/photo-1519235106638-30cc49b5fc71?w=500"
  }
];



let cart = JSON.parse(localStorage.getItem("cart")) || [];


function saveData() {
  localStorage.setItem("products", JSON.stringify(products));
  localStorage.setItem("cart", JSON.stringify(cart));
}

// --- Display Products ---
function showProducts(list) {
  let grid = document.getElementById("productGrid");
  if (!grid) return;
  grid.innerHTML = "";

  for (let i = 0; i < list.length; i++) {
    let p = list[i];
    let div = document.createElement("div");
    div.className = "product-card";

    let stockText = p.stock > 0
      ? `<p class="stock">In Stock: ${p.stock}</p>`
      : `<p class="out-of-stock">Out of Stock</p>`;

    div.innerHTML = `
      <img src="${p.image}" alt="${p.name}" style="width:100%; height:120px; object-fit:contain; border-radius:4px; margin-bottom:10px;">
      <h3>${p.name}</h3>
      <p>${p.description}</p>
      <p class="price">$${p.price.toFixed(2)}</p>
      ${stockText}
      <button onclick="addToCart(${p.id})" ${p.stock === 0 ? "disabled" : ""}>Add to Cart</button>
    `;

    grid.appendChild(div);
  }
}


function addToCart(productId) {
  for (let i = 0; i < products.length; i++) {
    if (products[i].id === productId && products[i].stock > 0) {
      let exists = false;

      for (let j = 0; j < cart.length; j++) {
        if (cart[j].id === productId) {
          cart[j].quantity += 1;
          exists = true;
        }
      }

      if (!exists) {
        cart.push({ id: products[i].id, name: products[i].name, price: products[i].price, quantity: 1 });
      }

      products[i].stock -= 1;
      break;
    }
  }

  saveData();
  showProducts(products);
  showCart();
}

function showCart() {
  let list = document.getElementById("cartItems");
  let totalBox = document.getElementById("cartTotal");
  let countBox = document.getElementById("cartCount");

  if (!list || !totalBox || !countBox) return;

  list.innerHTML = "";
  let total = 0;
  let count = 0;

  for (let i = 0; i < cart.length; i++) {
    let item = cart[i];
    total += item.price * item.quantity;
    count += item.quantity;

    let li = document.createElement("li");
    li.textContent = `${item.name} x${item.quantity} - $${(item.price * item.quantity).toFixed(2)}`;
    list.appendChild(li);
  }

  totalBox.textContent = total.toFixed(2);
  countBox.textContent = count;
}

function clearCart() {
  cart = [];
  saveData();
  showCart();
}

function toggleCart() {
  let cartBox = document.getElementById("cart");
  if (cartBox) {
    cartBox.style.display = cartBox.style.display === "none" ? "block" : "none";
  }
}

// --- Filters and Search ---
function filterByCategory(category) {
  let filtered = category === "all" ? products : products.filter(function (p) {
    return p.category === category;
  });
  showProducts(filtered);
}

function searchProducts() {
  let text = document.getElementById("searchInput").value.toLowerCase();
  let result = products.filter(function (p) {
    return p.name.toLowerCase().includes(text) || p.description.toLowerCase().includes(text);
  });
  showProducts(result);
}


document.addEventListener("DOMContentLoaded", function () {
  showProducts(products);
  showCart();

  let links = document.querySelectorAll(".category");
  for (let i = 0; i < links.length; i++) {
    links[i].addEventListener("click", function (e) {
      e.preventDefault();
      let category = this.getAttribute("data-category");
      filterByCategory(category);
    });
  }

  let searchInput = document.getElementById("searchInput");
  if (searchInput) {
    searchInput.addEventListener("keypress", function (e) {
      if (e.key === "Enter") {
        searchProducts();
      }
    });
  }
});