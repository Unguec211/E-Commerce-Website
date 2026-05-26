let products = [
  // PRODUCT IMAGES: replace each image URL with your own product photo path or URL.
  // Example local path: "images/linen-throw.jpg"
  {
    id: "linen-throw",
    name: "Washed Linen Throw",
    category: "Home",
    price: 68,
    rating: 4.8,
    tag: "New",
    image: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "ceramic-mug",
    name: "Speckled Ceramic Mug",
    category: "Kitchen",
    price: 24,
    rating: 4.7,
    tag: "Best seller",
    image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "canvas-tote",
    name: "Canvas Market Tote",
    category: "Carry",
    price: 42,
    rating: 4.6,
    tag: "Organic",
    image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "walnut-tray",
    name: "Walnut Catchall Tray",
    category: "Desk",
    price: 54,
    rating: 4.9,
    tag: "Handmade",
    image: "https://images.unsplash.com/photo-1513519683267-4ee6761728ac?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "amber-candle",
    name: "Amber Woods Candle",
    category: "Home",
    price: 32,
    rating: 4.5,
    tag: "Soy wax",
    image: "/static/images/amber-woods-candle.svg"
  },
  {
    id: "steel-bottle",
    name: "Insulated Steel Bottle",
    category: "Carry",
    price: 38,
    rating: 4.4,
    tag: "Leakproof",
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "desk-lamp",
    name: "Pivot Desk Lamp",
    category: "Desk",
    price: 96,
    rating: 4.8,
    tag: "LED",
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "glass-carafe",
    name: "Ribbed Glass Carafe",
    category: "Kitchen",
    price: 46,
    rating: 4.3,
    tag: "Limited",
    image: "https://images.unsplash.com/photo-1603199506016-b9a594b593c0?auto=format&fit=crop&w=900&q=80"
  }
];

let collections = [
  // COLLECTION IMAGES: replace each image URL with your category/collection banner photo.
  // Example local path: "images/home-collection.jpg"
  {
    name: "Home",
    text: "Soft textiles and warm light",
    image: "https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?auto=format&fit=crop&w=1000&q=80"
  },
  {
    name: "Kitchen",
    text: "Everyday pieces for better rituals",
    image: "https://images.unsplash.com/photo-1556912173-3bb406ef7e77?auto=format&fit=crop&w=1000&q=80"
  },
  {
    name: "Desk",
    text: "Objects that keep work grounded",
    image: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=1000&q=80"
  }
];

const state = {
  cart: JSON.parse(localStorage.getItem("cart") || "{}"),
  wishlist: JSON.parse(localStorage.getItem("wishlist") || "[]"),
  discount: Number(localStorage.getItem("discount") || 0),
  search: "",
  category: "All",
  sort: "featured"
};

const productGrid = document.querySelector("#productGrid");
const collectionGrid = document.querySelector("#collectionGrid");
const categoryFilter = document.querySelector("#categoryFilter");
const sortSelect = document.querySelector("#sortSelect");
const searchInput = document.querySelector("#searchInput");
const emptyState = document.querySelector("#emptyState");
const cartDrawer = document.querySelector("#cartDrawer");
const cartItems = document.querySelector("#cartItems");
const cartCount = document.querySelector("#cartCount");
const drawerTotal = document.querySelector("#drawerTotal");
const summaryItems = document.querySelector("#summaryItems");
const summarySubtotal = document.querySelector("#summarySubtotal");
const summaryShipping = document.querySelector("#summaryShipping");
const summaryTax = document.querySelector("#summaryTax");
const summaryTotal = document.querySelector("#summaryTotal");
const deliverySelect = document.querySelector("#deliverySelect");
const promoInput = document.querySelector("#promoInput");
const promoMessage = document.querySelector("#promoMessage");
const toast = document.querySelector("#toast");

const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

function getCookie(name) {
  return document.cookie
    .split(";")
    .map((cookie) => cookie.trim())
    .find((cookie) => cookie.startsWith(`${name}=`))
    ?.split("=")[1];
}

async function apiFetch(url, options = {}) {
  const method = options.method || "GET";
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": getCookie("csrftoken") || "",
      ...(options.headers || {})
    }
  });

  const text = await response.text();
  const contentType = response.headers.get("content-type") || "";
  let data = {};
  if (text && contentType.includes("application/json")) {
    try {
      data = JSON.parse(text);
    } catch (error) {
      throw new Error("The backend returned invalid JSON.");
    }
  }

  if (!response.ok) {
    throw new Error(data.error || `${method} ${url} failed: ${response.status}`);
  }

  if (!contentType.includes("application/json")) {
    throw new Error("The backend API did not return JSON. Start Django with python manage.py runserver and open http://127.0.0.1:8000.");
  }

  return data;
}

function createLocalOrder() {
  const order = {
    id: `NN-${Date.now().toString().slice(-6)}`,
    createdAt: new Date().toISOString(),
    total: totals().total
  };
  localStorage.setItem("lastOrder", JSON.stringify(order));
  return order;
}

function saveState() {
  localStorage.setItem("cart", JSON.stringify(state.cart));
  localStorage.setItem("wishlist", JSON.stringify(state.wishlist));
  localStorage.setItem("discount", String(state.discount));
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove("show"), 2400);
}

function getProduct(id) {
  return products.find((product) => product.id === id);
}

function getCartRows() {
  return Object.entries(state.cart)
    .map(([id, quantity]) => ({ product: getProduct(id), quantity }))
    .filter((row) => row.product && row.quantity > 0);
}

function totals() {
  const subtotal = getCartRows().reduce((sum, row) => sum + row.product.price * row.quantity, 0);
  const discountedSubtotal = Math.max(0, subtotal - subtotal * state.discount);
  const delivery = deliverySelect?.value || "standard";
  const shipping = discountedSubtotal === 0 || delivery === "pickup" ? 0 : delivery === "express" ? 14.95 : 6.95;
  const tax = discountedSubtotal * 0.0825;
  return { subtotal, discountedSubtotal, shipping, tax, total: discountedSubtotal + shipping + tax };
}

function renderCollections() {
  collectionGrid.innerHTML = collections
    .map(
      (collection) => `
      <article class="collection-card" style="background-image: url('${collection.image}')">
        <button type="button" data-collection="${collection.name}">
          <strong>${collection.name}</strong>
          <span>${collection.text}</span>
        </button>
      </article>`
    )
    .join("");
}

function renderCategories() {
  const categories = ["All", ...new Set(products.map((product) => product.category))];
  categoryFilter.innerHTML = categories.map((category) => `<option>${category}</option>`).join("");
  categoryFilter.value = categories.includes(state.category) ? state.category : "All";
}

function filteredProducts() {
  const term = state.search.trim().toLowerCase();
  return products
    .filter((product) => state.category === "All" || product.category === state.category)
    .filter((product) => product.name.toLowerCase().includes(term) || product.category.toLowerCase().includes(term))
    .sort((a, b) => {
      if (state.sort === "price-low") return a.price - b.price;
      if (state.sort === "price-high") return b.price - a.price;
      if (state.sort === "rating") return b.rating - a.rating;
      return 0;
    });
}

function renderProducts() {
  const visibleProducts = filteredProducts();
  emptyState.hidden = visibleProducts.length > 0;
  productGrid.innerHTML = visibleProducts
    .map((product) => {
      const wished = state.wishlist.includes(product.id);
      return `
        <article class="product-card">
          <div class="product-image" style="background-image: url('${product.image}')">
            <span class="badge">${product.tag}</span>
            <button class="wishlist ${wished ? "active" : ""}" type="button" data-wishlist="${product.id}" aria-label="Toggle wishlist">♥</button>
          </div>
          <div class="product-info">
            <div>
              <h3>${product.name}</h3>
              <div class="meta"><span>${product.category}</span><span>★ ${product.rating}</span></div>
            </div>
            <div class="price-row">
              <span class="price">${money.format(product.price)}</span>
              <button class="add-button" type="button" data-add="${product.id}">Add</button>
            </div>
          </div>
        </article>`;
    })
    .join("");
}

function renderCart() {
  const rows = getCartRows();
  cartCount.textContent = rows.reduce((sum, row) => sum + row.quantity, 0);
  cartItems.innerHTML = rows.length
    ? rows
        .map(
          ({ product, quantity }) => `
          <div class="cart-item">
            <img src="${product.image}" alt="${product.name}" />
            <div>
              <p>${product.name}</p>
              <span>${money.format(product.price)} each</span>
              <div class="quantity">
                <button type="button" data-decrease="${product.id}" aria-label="Decrease quantity">−</button>
                <strong>${quantity}</strong>
                <button type="button" data-add="${product.id}" aria-label="Increase quantity">+</button>
              </div>
            </div>
            <button class="remove-button" type="button" data-remove="${product.id}">Remove</button>
          </div>`
        )
        .join("")
    : `<p class="empty-state">Your cart is empty.</p>`;
  drawerTotal.textContent = money.format(totals().total);
  renderSummary();
}

function renderSummary() {
  const rows = getCartRows();
  const calculated = totals();
  summaryItems.innerHTML = rows.length
    ? rows
        .map(
          ({ product, quantity }) => `
          <div class="summary-item">
            <img src="${product.image}" alt="${product.name}" />
            <div>
              <p>${product.name}</p>
              <span>${quantity} × ${money.format(product.price)}</span>
            </div>
          </div>`
        )
        .join("")
    : `<p class="empty-state">Add products to see your order summary.</p>`;

  summarySubtotal.textContent = state.discount
    ? `${money.format(calculated.discountedSubtotal)} (${Math.round(state.discount * 100)}% off)`
    : money.format(calculated.subtotal);
  summaryShipping.textContent = money.format(calculated.shipping);
  summaryTax.textContent = money.format(calculated.tax);
  summaryTotal.textContent = money.format(calculated.total);
}

function addToCart(id) {
  state.cart[id] = (state.cart[id] || 0) + 1;
  saveState();
  renderCart();
  showToast(`${getProduct(id).name} added to cart`);
}

function decreaseCart(id) {
  state.cart[id] = (state.cart[id] || 0) - 1;
  if (state.cart[id] <= 0) delete state.cart[id];
  saveState();
  renderCart();
}

function removeFromCart(id) {
  delete state.cart[id];
  saveState();
  renderCart();
}

function toggleWishlist(id) {
  state.wishlist = state.wishlist.includes(id) ? state.wishlist.filter((item) => item !== id) : [...state.wishlist, id];
  saveState();
  renderProducts();
}

function openCart() {
  cartDrawer.classList.add("open");
  cartDrawer.setAttribute("aria-hidden", "false");
}

function closeCart() {
  cartDrawer.classList.remove("open");
  cartDrawer.setAttribute("aria-hidden", "true");
}

document.addEventListener("click", (event) => {
  const button = event.target.closest("button, a");
  if (!button) return;

  if (button.matches("#cartOpen")) openCart();
  if (button.matches("#cartClose") || button === cartDrawer) closeCart();
  if (button.matches("#checkoutLink")) closeCart();
  if (button.dataset.add) addToCart(button.dataset.add);
  if (button.dataset.decrease) decreaseCart(button.dataset.decrease);
  if (button.dataset.remove) removeFromCart(button.dataset.remove);
  if (button.dataset.wishlist) toggleWishlist(button.dataset.wishlist);
  if (button.dataset.collection) {
    state.category = button.dataset.collection;
    categoryFilter.value = state.category;
    renderProducts();
    document.querySelector("#shop").scrollIntoView({ behavior: "smooth" });
  }
});

cartDrawer.addEventListener("click", (event) => {
  if (event.target === cartDrawer) closeCart();
});

searchInput.addEventListener("input", (event) => {
  state.search = event.target.value;
  renderProducts();
});

categoryFilter.addEventListener("change", (event) => {
  state.category = event.target.value;
  renderProducts();
});

sortSelect.addEventListener("change", (event) => {
  state.sort = event.target.value;
  renderProducts();
});

deliverySelect.addEventListener("change", renderCart);

document.querySelector("#promoButton").addEventListener("click", () => {
  const code = promoInput.value.trim().toUpperCase();
  if (code === "NEST10") {
    state.discount = 0.1;
    promoMessage.textContent = "NEST10 applied.";
  } else if (!code) {
    state.discount = 0;
    promoMessage.textContent = "Promo removed.";
  } else {
    promoMessage.textContent = "Try NEST10 for 10% off.";
  }
  saveState();
  renderCart();
});

document.querySelector("#checkoutForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  const rows = getCartRows();
  if (!rows.length) {
    showToast("Add at least one product before checkout.");
    openCart();
    return;
  }

  const submitButton = event.target.querySelector("button[type='submit']");
  submitButton.disabled = true;
  submitButton.textContent = "Placing order...";

  try {
    const form = new FormData(event.target);
    const data = await apiFetch("/api/orders/", {
      method: "POST",
      body: JSON.stringify({
        customer: Object.fromEntries(form.entries()),
        cart: state.cart,
        promoCode: promoInput.value.trim()
      })
    });
    localStorage.setItem("lastOrder", JSON.stringify(data.order));
    state.cart = {};
    saveState();
    renderCart();
    event.target.reset();
  } catch (error) {
    const order = createLocalOrder();
    state.cart = {};
    saveState();
    renderCart();
    event.target.reset();
    showToast(`${error.message}. Saved demo order ${order.id} locally.`);
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = "Place order";
  }
});

document.querySelector("#themeToggle").addEventListener("click", () => {
  const current = document.documentElement.dataset.theme;
  document.documentElement.dataset.theme = current === "dark" ? "" : "dark";
});

async function loadCatalog() {
  try {
    const [productData, collectionData] = await Promise.all([
      apiFetch("/api/products/"),
      apiFetch("/api/collections/")
    ]);
    products = productData.products;
    collections = collectionData.collections;
  } catch (error) {
    showToast("Using offline catalog data.");
  }
  renderCollections();
  renderCategories();
  renderProducts();
  renderCart();
}

loadCatalog();
