/* ===========================================================
   PANADERÍA AL PASO — catálogo + carrito (demo front-end)
   =========================================================== */

const PRODUCTS = [
  { id: 1,  code: "#001", name: "Medialunas de manteca (x6)", cat: "facturas", price: 3200, img: "https://images.unsplash.com/photo-1544027026-31fbbad5ecee?auto=format&fit=crop&w=600&q=80", desc: "Clásicas, dulces y bien hojaldradas." },
  { id: 2,  code: "#002", name: "Facturas surtidas (x12)",     cat: "facturas", price: 5400, img: "https://images.unsplash.com/photo-1550005399-c95f859c0fc7?auto=format&fit=crop&w=600&q=80", desc: "Vigilantes, cañoncitos y sacramentos." },
  { id: 3,  code: "#014", name: "Chipas (x12)",                cat: "chipas",   price: 4200, img: "https://images.unsplash.com/photo-1549438247-223f2db1dd29?auto=format&fit=crop&w=600&q=80", desc: "Recién horneadas, con queso de verdad." },
  { id: 4,  code: "#015", name: "Pan de queso (x6)",            cat: "chipas",   price: 2900, img: "https://images.unsplash.com/photo-1568254183919-78a4f43a2877?auto=format&fit=crop&w=600&q=80", desc: "Tiernos por dentro, dorados por fuera." },
  { id: 5,  code: "#021", name: "Pan francés (unidad)",         cat: "panes",    price: 900,  img: "https://images.unsplash.com/photo-1609889132680-4e2ea2befbef?auto=format&fit=crop&w=600&q=80", desc: "Corteza crocante, miga liviana." },
  { id: 6,  code: "#022", name: "Pan casero (x1kg)",            cat: "panes",    price: 2600, img: "https://images.unsplash.com/photo-1566698629409-787a68fc5724?auto=format&fit=crop&w=600&q=80", desc: "El de toda la vida, horneado en molde." },
  { id: 7,  code: "#023", name: "Pan integral de salvado",      cat: "panes",    price: 2400, img: "https://images.unsplash.com/photo-1508616185939-efe767994166?auto=format&fit=crop&w=600&q=80", desc: "Con semillas, ideal para el desayuno." },
  { id: 8,  code: "#031", name: "Torta de vainilla (porción)",  cat: "dulces",   price: 1800, img: "https://images.unsplash.com/photo-1621303837174-89787a7d4729?auto=format&fit=crop&w=600&q=80", desc: "Bizcochuelo húmedo con crema." },
];

const state = { cart: [] };

/* ---------- Render de catálogo ---------- */
const grid = document.getElementById("product-grid");

function renderGrid(filter = "todos") {
  grid.innerHTML = "";
  const items = filter === "todos" ? PRODUCTS : PRODUCTS.filter(p => p.cat === filter);
  items.forEach(p => {
    const card = document.createElement("article");
    card.className = "ticket";
    card.innerHTML = `
      <div class="ticket-photo">
        <img src="${p.img}" alt="${p.name}" loading="lazy">
        <span class="ticket-code">${p.code}</span>
      </div>
      <div class="ticket-perf"></div>
      <div class="ticket-body">
        <h3>${p.name}</h3>
        <p>${p.desc}</p>
        <div class="ticket-foot">
          <span class="ticket-price">$${p.price.toLocaleString("es-AR")}</span>
          <button class="ticket-add" data-id="${p.id}" aria-label="Agregar ${p.name}">+</button>
        </div>
      </div>`;
    grid.appendChild(card);
  });
}
renderGrid();

/* ---------- Tabs de categorías ---------- */
document.querySelectorAll(".tab").forEach(tab => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
    tab.classList.add("active");
    renderGrid(tab.dataset.filter);
  });
});

/* Categorías de la sección superior también filtran el catálogo */
document.querySelectorAll(".cat-card").forEach(card => {
  card.addEventListener("click", (e) => {
    const filter = card.dataset.filter;
    const targetTab = document.querySelector(`.tab[data-filter="${filter}"]`);
    if (targetTab) {
      document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
      targetTab.classList.add("active");
      renderGrid(filter);
    }
  });
});

/* ---------- Carrito ---------- */
const cartItemsEl = document.getElementById("cart-items");
const cartEmptyEl = document.getElementById("cart-empty");
const cartCountEl = document.getElementById("cart-count");
const cartTotalEl = document.getElementById("cart-total");

function addToCart(id) {
  const product = PRODUCTS.find(p => p.id === Number(id));
  const existing = state.cart.find(i => i.id === product.id);
  if (existing) existing.qty += 1;
  else state.cart.push({ ...product, qty: 1 });
  renderCart();
  openCart();
}

function changeQty(id, delta) {
  const item = state.cart.find(i => i.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) state.cart = state.cart.filter(i => i.id !== id);
  renderCart();
}

function removeFromCart(id) {
  state.cart = state.cart.filter(i => i.id !== id);
  renderCart();
}

function renderCart() {
  const totalCount = state.cart.reduce((a, i) => a + i.qty, 0);
  const totalPrice = state.cart.reduce((a, i) => a + i.qty * i.price, 0);

  cartCountEl.textContent = totalCount;
  cartTotalEl.textContent = `$${totalPrice.toLocaleString("es-AR")}`;

  if (state.cart.length === 0) {
    cartItemsEl.innerHTML = "";
    cartItemsEl.appendChild(cartEmptyEl);
    return;
  }

  cartItemsEl.innerHTML = "";
  state.cart.forEach(item => {
    const row = document.createElement("div");
    row.className = "cart-item";
    row.innerHTML = `
      <img src="${item.img}" alt="${item.name}">
      <div>
        <p class="cart-item-name">${item.name}</p>
        <span class="cart-item-price">$${item.price.toLocaleString("es-AR")}</span>
        <div class="cart-item-qty">
          <button data-action="dec" aria-label="Restar">–</button>
          <span>${item.qty}</span>
          <button data-action="inc" aria-label="Sumar">+</button>
        </div>
      </div>
      <button class="cart-item-remove" aria-label="Quitar">✕</button>`;

    row.querySelector('[data-action="inc"]').addEventListener("click", () => changeQty(item.id, 1));
    row.querySelector('[data-action="dec"]').addEventListener("click", () => changeQty(item.id, -1));
    row.querySelector(".cart-item-remove").addEventListener("click", () => removeFromCart(item.id));

    cartItemsEl.appendChild(row);
  });
}

grid.addEventListener("click", (e) => {
  const btn = e.target.closest(".ticket-add");
  if (btn) addToCart(btn.dataset.id);
});

/* ---------- Drawer del carrito ---------- */
const cartDrawer = document.getElementById("cart-drawer");
const cartOverlay = document.getElementById("cart-overlay");

function openCart() {
  cartDrawer.classList.add("open");
  cartOverlay.classList.add("open");
}
function closeCart() {
  cartDrawer.classList.remove("open");
  cartOverlay.classList.remove("open");
}

document.getElementById("open-cart").addEventListener("click", openCart);
document.getElementById("close-cart").addEventListener("click", closeCart);
cartOverlay.addEventListener("click", closeCart);

document.getElementById("checkout-btn").addEventListener("click", () => {
  if (state.cart.length === 0) {
    alert("Todavía no agregaste productos a tu pedido.");
    return;
  }
  alert("Demo: acá se abriría el checkout con Mercado Pago, tarjeta o efectivo al retirar.");
});

/* ---------- Tabs de registro / login ---------- */
const formTabs = document.querySelectorAll(".form-tab");
const fieldsRegistro = document.getElementById("fields-registro");
const fieldsLogin = document.getElementById("fields-login");

formTabs.forEach(tab => {
  tab.addEventListener("click", () => {
    formTabs.forEach(t => t.classList.remove("active"));
    tab.classList.add("active");
    if (tab.dataset.form === "registro") {
      fieldsRegistro.classList.remove("hidden");
      fieldsLogin.classList.add("hidden");
    } else {
      fieldsLogin.classList.remove("hidden");
      fieldsRegistro.classList.add("hidden");
    }
  });
});

document.getElementById("open-login").addEventListener("click", () => {
  document.querySelector('.form-tab[data-form="login"]').click();
  document.getElementById("cuenta").scrollIntoView({ behavior: "smooth" });
});

document.getElementById("register-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const activeTab = document.querySelector(".form-tab.active").dataset.form;
  alert(activeTab === "registro"
    ? "Demo: la cuenta se crearía y quedarías con la sesión iniciada."
    : "Demo: acá se validarían tus credenciales para iniciar sesión.");
});
