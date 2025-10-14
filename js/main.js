// js/main.js

// ---------- Config & helpers ----------
const STORAGE_KEY = 'cart_v1'; // fácil de migrar cuando haya backend

const CLP = new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 });

const Cart = {
  get() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch {
      return [];
    }
  },
  save(items) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  },
  add({ id, name, price, qty = 1 }) {
    const items = this.get();
    const idx = items.findIndex(p => p.id === id);
    if (idx >= 0) {
      items[idx].qty += qty;
    } else {
      items.push({ id, name, price, qty });
    }
    this.save(items);
    return items;
  },
  remove(id) {
    const items = this.get().filter(p => p.id !== id);
    this.save(items);
    return items;
  },
  updateQty(id, qty) {
    const q = Math.max(1, parseInt(qty, 10) || 1);
    const items = this.get().map(p => p.id === id ? { ...p, qty: q } : p);
    this.save(items);
    return items;
  },
  clear() {
    this.save([]);
  },
  total() {
    return this.get().reduce((acc, p) => acc + p.price * p.qty, 0);
  }
};

// ---------- UI: Productos (agregar al carrito) ----------
function initAddToCartButtons() {
  const buttons = document.querySelectorAll('.add-to-cart[data-id]');
  if (!buttons.length) return;

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const { id, name, price } = btn.dataset;
      const precio = parseInt(price, 10); // precio en CLP (entero)
      Cart.add({ id, name, price: precio, qty: 1 });

      // feedback simple (puedes reemplazar por un toast)
      alert(`¡${name} agregado al carrito!`);
    });
  });
}

// ---------- UI: Carrito (render, qty, eliminar, vaciar) ----------
function renderCart() {
  const cont = document.getElementById('carrito-lista');
  if (!cont) return; // no estamos en carrito.html

  const items = Cart.get();
  cont.innerHTML = '';

  if (!items.length) {
    cont.innerHTML = `<p>No tienes productos agregados aún.</p>`;
    updateCartTotal();
    return;
  }

  const list = document.createElement('div');
  list.className = 'cart-list';

  items.forEach(p => {
    const row = document.createElement('div');
    row.className = 'cart-item';

    row.innerHTML = `
      <div class="cart-item__main">
        <div class="cart-item__name">${p.name}</div>
        <div class="cart-item__price">${CLP.format(p.price)}</div>
      </div>
      <div class="cart-item__actions">
        <label>Cant.
          <input type="number" min="1" value="${p.qty}" class="cart-qty" data-id="${p.id}">
        </label>
        <div class="cart-item__subtotal">${CLP.format(p.price * p.qty)}</div>
        <button class="cart-remove" data-id="${p.id}">Eliminar</button>
      </div>
    `;
    list.appendChild(row);
  });

  cont.appendChild(list);

  // Barra inferior con total y acciones
  const footer = document.createElement('div');
  footer.className = 'cart-footer';
  footer.innerHTML = `
    <div class="cart-total"><strong>Total:</strong> <span id="cart-total-number">${CLP.format(Cart.total())}</span></div>
    <div class="cart-actions">
      <button id="cart-clear">Vaciar carrito</button>
      <button id="cart-checkout">Ir a pagar</button>
    </div>
  `;
  cont.appendChild(footer);

  // Eventos: qty / remove / clear / checkout
  cont.querySelectorAll('.cart-qty').forEach(input => {
    input.addEventListener('change', () => {
      Cart.updateQty(input.dataset.id, input.value);
      renderCart(); // re-render para actualizar subtotales y total
    });
  });

  cont.querySelectorAll('.cart-remove').forEach(btn => {
    btn.addEventListener('click', () => {
      Cart.remove(btn.dataset.id);
      renderCart();
    });
  });

  cont.querySelector('#cart-clear')?.addEventListener('click', () => {
    if (confirm('¿Vaciar el carrito?')) {
      Cart.clear();
      renderCart();
    }
  });

  // Este botón queda listo para conectar con backend
  cont.querySelector('#cart-checkout')?.addEventListener('click', async () => {
    // Placeholder para integrar con tu backend (POST /checkout o similar)
    // Ejemplo:
    // await fetch('https://tu-backend/checkout', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(Cart.get()) });
    alert('Checkout simulado. Aquí conectaremos con tu backend.');
  });
}

function updateCartTotal() {
  const el = document.getElementById('cart-total-number');
  if (el) el.textContent = CLP.format(Cart.total());
}

// ---------- Boot ----------
document.addEventListener('DOMContentLoaded', () => {
  initAddToCartButtons();
  renderCart();
});
