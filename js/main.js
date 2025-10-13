// js/main.js
document.addEventListener('DOMContentLoaded', function() {
    // Configurar todos los botones "Agregar al Carrito"
    const botonesAgregar = document.querySelectorAll('.add-to-cart');
    
    botonesAgregar.forEach(boton => {
        boton.addEventListener('click', function() {
            const card = this.closest('.smoothie-card');
            const nombre = card.querySelector('.smoothie-name').textContent;
            const precioTexto = card.querySelector('.smoothie-price').textContent;
            
            // Convertir precio de texto a número
            const precio = parseFloat(precioTexto.replace('$', '').replace('.', ''));
            
            // Agregar al carrito
            carrito.agregarProducto(nombre, precio);
            
            // Efecto visual en el botón
            this.style.backgroundColor = '#2e7d32';
            this.textContent = '✓ Agregado';
            
            setTimeout(() => {
                this.style.backgroundColor = '';
                this.textContent = 'Agregar al Carrito';
            }, 2000);
        });
    });

    console.log('Smoothies Naturales - Página cargada correctamente');
});
