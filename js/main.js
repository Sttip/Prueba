// js/main.js

// ---------------- Config & helpers ----------------
const STORAGE_KEY = 'carrito_v1'; // fácil de migrar cuando conectes backend
const CLP = new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 });

const Carrito = {
  obtener() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
    catch { return []; }
  },
  guardar(items) { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); },
  agregar({ id, nombre, precio, cantidad = 1 }) {
    const items = this.obtener();
    const i = items.findIndex(p => p.id === id);
    if (i >= 0) items[i].cantidad += cantidad;
    else items.push({ id, nombre, precio, cantidad });
    this.guardar(items);
    return items;
  },
  eliminar(id) {
    const items = this.obtener().filter(p => p.id !== id);
    this.guardar(items);
    return items;
  },
  actualizarCantidad(id, cantidad) {
    const c = Math.max(1, parseInt(cantidad, 10) || 1);
    const items = this.obtener().map(p => p.id === id ? { ...p, cantidad: c } : p);
    this.guardar(items);
    return items;
  },
  vaciar() { this.guardar([]); },
  total() { return this.obtener().reduce((acc, p) => acc + p.precio * p.cantidad, 0); }
};

// ---------------- UI: Productos ----------------
function initBotonesAgregar() {
  const botones = document.querySelectorAll('.add-to-cart[data-id]');
  if (!botones.length) return;

  botones.forEach(btn => {
    btn.addEventListener('click', () => {
      const { id, name, price } = btn.dataset;
      const precio = parseInt(price, 10);
      Carrito.agregar({ id, nombre: name, precio, cantidad: 1 });
      alert(`¡${name} agregado al carrito!`);
    });
  });
}

// ---------------- UI: Carrito ----------------
function renderCarrito() {
  const cont = document.getElementById('carrito-lista');
  if (!cont) return;

  const items = Carrito.obtener();
  cont.innerHTML = '';

  if (!items.length) {
    cont.innerHTML = `<p>No tienes productos agregados aún.</p>`;
    return;
  }

  const lista = document.createElement('div');
  lista.className = 'cart-list';

  items.forEach(p => {
    const fila = document.createElement('div');
    fila.className = 'cart-item';
    fila.innerHTML = `
      <div class="cart-item__main">
        <div class="cart-item__name">${p.nombre}</div>
        <div class="cart-item__price">${CLP.format(p.precio)}</div>
      </div>
      <div class="cart-item__actions">
        <label>Cant.
          <input type="number" min="1" value="${p.cantidad}" class="cart-qty" data-id="${p.id}">
        </label>
        <div class="cart-item__subtotal">${CLP.format(p.precio * p.cantidad)}</div>
        <button class="cart-remove" data-id="${p.id}">Eliminar</button>
      </div>
    `;
    lista.appendChild(fila);
  });

  cont.appendChild(lista);

  const pie = document.createElement('div');
  pie.className = 'cart-footer';
  pie.innerHTML = `
    <div class="cart-total"><strong>Total:</strong> <span id="cart-total-number">${CLP.format(Carrito.total())}</span></div>
    <div class="cart-actions">
      <button id="cart-clear">Vaciar carrito</button>
      <button id="cart-checkout">Ir a pagar</button>
    </div>
  `;
  cont.appendChild(pie);

  // Eventos
  cont.querySelectorAll('.cart-qty').forEach(input => {
    input.addEventListener('change', () => {
      Carrito.actualizarCantidad(input.dataset.id, input.value);
      renderCarrito();
    });
  });

  cont.querySelectorAll('.cart-remove').forEach(btn => {
    btn.addEventListener('click', () => {
      Carrito.eliminar(btn.dataset.id);
      renderCarrito();
    });
  });

  cont.querySelector('#cart-clear')?.addEventListener('click', () => {
    if (confirm('¿Vaciar el carrito?')) {
      Carrito.vaciar();
      renderCarrito();
    }
  });

  // Punto de integración con backend
  cont.querySelector('#cart-checkout')?.addEventListener('click', async ()
