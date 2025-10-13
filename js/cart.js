// Funcionalidad del carrito de compras
let cart = [];

function addToCart(name, price) {
    // Convertir precio a número
    const priceNumber = parseFloat(price.replace('$', '').replace('.', '').replace(',', '.'));
    
    // Buscar si el producto ya está en el carrito
    const existingItem = cart.find(item => item.name === name);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            name: name,
            price: priceNumber,
            quantity: 1
        });
    }
    
    // Actualizar interfaz del carrito
    updateCartUI();
    
    // Mostrar mensaje de confirmación
    alert(`¡${name} agregado al carrito!`);
}

function updateCartUI() {
    // Aquí implementarías la actualización visual del carrito
    // Por ejemplo, actualizar un contador de productos en el header
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    const cartCounter = document.getElementById('cart-counter');
    
    if (cartCounter) {
        cartCounter.textContent = cartCount;
    }
}

function getCartTotal() {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}
