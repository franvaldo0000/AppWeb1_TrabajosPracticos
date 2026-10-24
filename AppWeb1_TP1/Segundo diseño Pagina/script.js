/* ===========================================================
   PANADERÍA AL PASO — lógica compartida entre páginas
   El carrito se guarda en localStorage para persistir al
   navegar entre catalogo.html, carrito.html, etc.
   =========================================================== */

const CART_KEY = "alpaso_cart";

const PRODUCTS = [
  { id: 1, code: "#001", name: "Medialunas de manteca (x6)", cat: "facturas", price: 3200, img: "https://images.unsplash.com/photo-1544027026-31fbbad5ecee?auto=format&fit=crop&w=600&q=80", desc: "Clásicas, dulces y bien hojaldradas." },
  { id: 2, code: "#002", name: "Facturas surtidas (x12)",     cat: "facturas", price: 5400, img: "https://images.unsplash.com/photo-1550005399-c95f859c0fc7?auto=format&fit=crop&w=600&q=80", desc: "Vigilantes, cañoncitos y sacramentos." },
  { id: 3, code: "#014", name: "Chipas (x12)",                cat: "chipas",   price: 4200, img: "https://images.unsplash.com/photo-1549438247-223f2db1dd29?auto=format&fit=crop&w=600&q=80", desc: "Recién horneadas, con queso de verdad." },
  { id: 4, code: "#015", name: "Pan de queso (x6)",            cat: "chipas",   price: 2900, img: "https://images.unsplash.com/photo-1568254183919-78a4f43a2877?auto=format&fit=crop&w=600&q=80", desc: "Tiernos por dentro, dorados por fuera." },
  { id: 5, code: "#021", name: "Pan francés (unidad)",         cat: "panes",    price: 900,  img: "https://images.unsplash.com/photo-1609889132680-4e2ea2befbef?auto=format&fit=crop&w=600&q=80", desc: "Corteza crocante, miga liviana." },
  { id: 6, code: "#022", name: "Pan casero (x1kg)",            cat: "panes",    price: 2600, img: "https://images.unsplash.com/photo-1566698629409-787a68fc5724?auto=format&fit=crop&w=600&q=80", desc: "El de toda la vida, horneado en molde." },
  { id: 7, code: "#023", name: "Pan integral de salvado",      cat: "panes",    price: 2400, img: "https://images.unsplash.com/photo-1508616185939-efe767994166?auto=format&fit=crop&w=600&q=80", desc: "Con semillas, ideal para el desayuno." },
  { id: 8, code: "#031", name: "Torta de vainilla (porción)",  cat: "dulces",   price: 1800, img: "https://images.unsplash.com/photo-1621303837174-89787a7d4729?auto=format&fit=crop&w=600&q=80", desc: "Bizcochuelo húmedo con crema." },
];

/* ---------- Helpers de carrito (localStorage) ---------- */
function getCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch (e) {
    return [];
  }
}
function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartBadge();
}
function addToCart(id, qty = 1) {
  const cart = getCart();
  const existing = cart.find(i => i.id === Number(id));
  if (existing) existing.qty += qty;
  else cart.push({ id: Number(id), qty });
  saveCart(cart);
}
function changeCartQty(id, delta) {
  const cart = getCart();
  const item = cart.find(i => i.id === Number(id));
  if (!item) return;
  item.qty += delta;
  const next = item.qty <= 0 ? cart.filter(i => i.id !== Number(id)) : cart;
  saveCart(next);
  renderCartPage();
}
function removeFromCart(id) {
  saveCart(getCart().filter(i => i.id !== Number(id)));
  renderCartPage();
}
function clearCart() {
  saveCart([]);
  renderCartPage();
}
function cartWithDetails() {
  return getCart()
    .map(i => ({ ...PRODUCTS.find(p => p.id === i.id), qty: i.qty }))
    .filter(i => i.id);
}
function cartTotalCount() {
  return getCart().reduce((a, i) => a + i.qty, 0);
}
function cartTotalPrice() {
  return cartWithDetails().reduce((a, i) => a + i.qty * i.price, 0);
}

/* ---------- Badge del carrito (header, todas las páginas) ---------- */
function updateCartBadge() {
  const el = document.getElementById("cart-count");
  if (el) el.textContent = cartTotalCount();
}

/* ---------- Toast de confirmación ---------- */
let toastTimer;
function showToast(message) {
  let toast = document.getElementById("toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.className = "toast";
    toast.id = "toast";
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
}

/* ---------- Marcar el ítem de menú activo según la página actual ---------- */
function markActiveNav() {
  let path = location.pathname.split("/").pop();
  if (path === "") path = "index.html";
  document.querySelectorAll(".main-nav a, .mobile-nav a").forEach(link => {
    const href = link.getAttribute("href").split("#")[0];
    if (href === path) link.classList.add("active");
  });
}

/* ---------- Menú móvil (hamburguesa) ---------- */
function initMobileMenu() {
  const mobileNav = document.getElementById("mobile-nav");
  const mobileNavOverlay = document.getElementById("mobile-nav-overlay");
  const menuToggle = document.getElementById("open-menu");
  if (!mobileNav || !menuToggle) return;

  const open = () => {
    mobileNav.classList.add("open");
    mobileNavOverlay.classList.add("open");
    menuToggle.setAttribute("aria-expanded", "true");
  };
  const close = () => {
    mobileNav.classList.remove("open");
    mobileNavOverlay.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  };

  menuToggle.addEventListener("click", open);
  document.getElementById("close-menu").addEventListener("click", close);
  mobileNavOverlay.addEventListener("click", close);
  mobileNav.querySelectorAll("a").forEach(link => link.addEventListener("click", close));
}

/* ===========================================================
   PÁGINA: catalogo.html
   =========================================================== */
function initCatalogoPage() {
  const grid = document.getElementById("product-grid");
  if (!grid) return;

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

  document.querySelectorAll(".tab").forEach(tab => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      renderGrid(tab.dataset.filter);
    });
  });

  grid.addEventListener("click", (e) => {
    const btn = e.target.closest(".ticket-add");
    if (!btn) return;
    const product = PRODUCTS.find(p => p.id === Number(btn.dataset.id));
    addToCart(product.id);
    showToast(`Agregaste ${product.name} a tu pedido`);
  });
}

/* ===========================================================
   PÁGINA: carrito.html
   =========================================================== */
function renderCartPage() {
  const listEl = document.getElementById("carrito-list");
  if (!listEl) return;

  const items = cartWithDetails();
  const emptyEl = document.getElementById("carrito-empty");
  const summaryEl = document.getElementById("carrito-summary");

  if (items.length === 0) {
    listEl.innerHTML = "";
    emptyEl.style.display = "block";
    summaryEl.style.display = "none";
    return;
  }

  emptyEl.style.display = "none";
  summaryEl.style.display = "block";

  listEl.innerHTML = "";
  items.forEach(item => {
    const row = document.createElement("div");
    row.className = "carrito-item";
    row.innerHTML = `
      <img src="${item.img}" alt="${item.name}">
      <div>
        <p class="carrito-item-name">${item.name}</p>
        <span class="carrito-item-code">${item.code}</span>
      </div>
      <div class="carrito-item-qty">
        <button data-action="dec" aria-label="Restar">–</button>
        <span>${item.qty}</span>
        <button data-action="inc" aria-label="Sumar">+</button>
      </div>
      <span class="carrito-item-price">$${(item.qty * item.price).toLocaleString("es-AR")}</span>
      <button class="carrito-item-remove" aria-label="Quitar">✕</button>`;

    row.querySelector('[data-action="inc"]').addEventListener("click", () => changeCartQty(item.id, 1));
    row.querySelector('[data-action="dec"]').addEventListener("click", () => changeCartQty(item.id, -1));
    row.querySelector(".carrito-item-remove").addEventListener("click", () => removeFromCart(item.id));

    listEl.appendChild(row);
  });

  const subtotal = cartTotalPrice();
  document.getElementById("carrito-subtotal").textContent = `$${subtotal.toLocaleString("es-AR")}`;
  document.getElementById("carrito-total").textContent = `$${subtotal.toLocaleString("es-AR")}`;
  document.getElementById("carrito-cantidad").textContent = cartTotalCount();
}

function initCarritoPage() {
  const listEl = document.getElementById("carrito-list");
  if (!listEl) return;

  renderCartPage();

  const clearBtn = document.getElementById("carrito-clear");
  if (clearBtn) clearBtn.addEventListener("click", clearCart);

  const checkoutBtn = document.getElementById("checkout-btn");
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", (e) => {
      if (cartTotalCount() === 0) {
        e.preventDefault();
        showToast("Todavía no agregaste productos a tu pedido");
      }
    });
  }
}

/* ===========================================================
   PÁGINA: cuenta.html (crear cuenta / iniciar sesión)
   =========================================================== */
function initCuentaPage() {
  const formTabs = document.querySelectorAll(".form-tab");
  if (formTabs.length === 0) return;

  const fieldsRegistro = document.getElementById("fields-registro");
  const fieldsLogin = document.getElementById("fields-login");

  function activate(formName) {
    formTabs.forEach(t => t.classList.toggle("active", t.dataset.form === formName));
    fieldsRegistro.classList.toggle("hidden", formName !== "registro");
    fieldsLogin.classList.toggle("hidden", formName !== "login");
  }

  formTabs.forEach(tab => {
    tab.addEventListener("click", () => activate(tab.dataset.form));
  });

  // Si se llega desde "Iniciar sesión" (cuenta.html#login) abre esa pestaña
  if (location.hash === "#login") activate("login");

  const form = document.getElementById("account-form");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const active = document.querySelector(".form-tab.active").dataset.form;
      showToast(active === "registro" ? "Cuenta creada (demo)" : "Sesión iniciada (demo)");
    });
  }
}

/* ===========================================================
   INICIALIZACIÓN — corre en todas las páginas
   =========================================================== */
document.addEventListener("DOMContentLoaded", () => {
  markActiveNav();
  initMobileMenu();
  updateCartBadge();
  initCatalogoPage();
  initCarritoPage();
  initCuentaPage();
});
