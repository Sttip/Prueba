// Funcionalidad para los botones "Agregar al Carrito"
document.addEventListener('DOMContentLoaded', function() {
    // Cargar productos desde archivo externo
    loadProducts();
    
    // Configurar eventos para botones de carrito
    setupCartButtons();
});

function loadProducts() {
    // Aquí podrías cargar los productos desde una API o archivo JSON
    // Por ahora, simplemente cargamos el HTML desde el componente
    fetch('components/products.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('products-container').innerHTML = data;
            setupCartButtons(); // Reconfigurar eventos después de cargar productos
        })
        .catch(error => console.error('Error cargando productos:', error));
}

function setupCartButtons() {
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const smoothieCard = this.closest('.smoothie-card');
            const smoothieName = smoothieCard.querySelector('.smoothie-name').textContent;
            const smoothiePrice = smoothieCard.querySelector('.smoothie-price').textContent;
            
            // Llamar a función del carrito
            addToCart(smoothieName, smoothiePrice);
        });
    });
}
