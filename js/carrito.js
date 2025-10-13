// js/carrito.js
class Carrito {
    constructor() {
        this.items = JSON.parse(localStorage.getItem('carrito')) || [];
    }

    agregarProducto(nombre, precio) {
        // Buscar si el producto ya existe en el carrito
        const productoExistente = this.items.find(item => item.nombre === nombre);
        
        if (productoExistente) {
            productoExistente.cantidad += 1;
        } else {
            this.items.push({
                nombre: nombre,
                precio: precio,
                cantidad: 1
            });
        }
        
        this.guardarEnLocalStorage();
        this.mostrarNotificacion(nombre);
    }

    guardarEnLocalStorage() {
        localStorage.setItem('carrito', JSON.stringify(this.items));
    }

    mostrarNotificacion(nombre) {
        // Crear notificación visual
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #4CAF50;
            color: white;
            padding: 15px 20px;
            border-radius: 5px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            z-index: 1000;
            font-weight: bold;
        `;
        notification.textContent = `¡${nombre} agregado al carrito!`;
        
        document.body.appendChild(notification);
        
        // Remover después de 3 segundos
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 3000);
    }

    obtenerTotalItems() {
        return this.items.reduce((total, item) => total + item.cantidad, 0);
    }
}

// Crear instancia global del carrito
const carrito = new Carrito();
