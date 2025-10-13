// js/carrito.js
// Funcionalidad básica del carrito
document.addEventListener('DOMContentLoaded', function() {
    // Configurar botones de agregar al carrito
    const botonesCarrito = document.querySelectorAll('.add-to-cart');
    
    botonesCarrito.forEach(button => {
        button.addEventListener('click', function() {
            const smoothieName = this.parentElement.querySelector('.smoothie-name').textContent;
            alert(`¡${smoothieName} agregado al carrito!`);
        });
    });
    
    console.log('Carrito.js cargado correctamente');
});
