// src/js/main.js

// Mensaje básico de carrito (puedes mejorarlo más adelante)
document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', function() {
        const smoothieName = this.parentElement.querySelector('.smoothie-name').textContent;
        alert(`¡${smoothieName} agregado al carrito!`);
    });
});
