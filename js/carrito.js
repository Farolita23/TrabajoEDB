// Productos de ejemplo en el carrito (podría cargarse desde el localStorage)
let carritoProductos = [];

// Costos de envío (gratis para pedidos de más de 50€)
const ENVIO_GRATIS_LIMITE = 50;
const COSTO_ENVIO = 4.99;

// Códigos de descuento
const codigosDescuento = {
    'JOHNTWATER': 25, // 10% de descuento
    'ENRIQUECALVO33': 50, // 20% de descuento
    'HANS_PESETERO': 35  // 15% de descuento
};

let descuentoAplicado = 0;
let codigoAplicado = '';

// Cargar carrito desde localStorage al iniciar la página
document.addEventListener('DOMContentLoaded', () => {
    cargarCarritoDesdeLocalStorage();
    actualizarCarritoUI();
    actualizarContadorCarrito();
    
    // Evento para el botón de aplicar descuento
    document.getElementById('aplicar-descuento').addEventListener('click', aplicarCodigoDescuento);
    
    // Evento para el botón de finalizar compra
    document.getElementById('btn-finalizar').addEventListener('click', finalizarCompra);
    
    // Inicializar eventos para el FAQ
    inicializarFAQ();
});

// Función para cargar el carrito desde localStorage
function cargarCarritoDesdeLocalStorage() {
    const carritoGuardado = localStorage.getItem('carritoProductos');
    if (carritoGuardado) {
        carritoProductos = JSON.parse(carritoGuardado);
    } else {
        guardarCarritoEnLocalStorage();
    }
}

// Función para guardar el carrito en localStorage
function guardarCarritoEnLocalStorage() {
    localStorage.setItem('carritoProductos', JSON.stringify(carritoProductos));
}

// Función para actualizar la interfaz del carrito
function actualizarCarritoUI() {
    const productosLista = document.getElementById('productos-lista');
    const carritoVacio = document.getElementById('carrito-vacio');
    const carritoResumen = document.getElementById('carrito-resumen');
    
    // Limpiar lista de productos
    productosLista.innerHTML = '';
    
    if (carritoProductos.length === 0) {
        // Mostrar mensaje de carrito vacío
        carritoVacio.style.display = 'block';
        carritoResumen.style.display = 'none';
    } else {
        // Ocultar mensaje de carrito vacío
        carritoVacio.style.display = 'none';
        carritoResumen.style.display = 'block';
        
        // Añadir productos al carrito
        carritoProductos.forEach(producto => {
            const productoElement = document.createElement('div');
            productoElement.className = 'producto-item';
            productoElement.dataset.id = producto.id;
            
            productoElement.innerHTML = `
                <div class="producto-info">
                    <span class="producto-nombre">${producto.nombre}</span>
                </div>
                <span class="producto-precio">${formatearPrecio(producto.precio)} €</span>
                <div class="cantidad-control">
                    <button class="cantidad-btn btn-menos">-</button>
                    <input type="number" class="cantidad-input" value="${producto.cantidad}" min="1" max="10">
                    <button class="cantidad-btn btn-mas">+</button>
                </div>
                <span class="producto-total">${formatearPrecio(producto.precio * producto.cantidad)} €</span>
                <button class="btn-eliminar"><i class="fas fa-trash"></i></button>
            `;
            
            productosLista.appendChild(productoElement);
            
            // Añadir eventos a los botones de cantidad
            const btnMenos = productoElement.querySelector('.btn-menos');
            const btnMas = productoElement.querySelector('.btn-mas');
            const inputCantidad = productoElement.querySelector('.cantidad-input');
            const btnEliminar = productoElement.querySelector('.btn-eliminar');
            
            btnMenos.addEventListener('click', () => {
                cambiarCantidad(producto.id, -1);
            });
            
            btnMas.addEventListener('click', () => {
                cambiarCantidad(producto.id, 1);
            });
            
            inputCantidad.addEventListener('change', () => {
                actualizarCantidadDesdeInput(producto.id, inputCantidad.value);
            });
            
            btnEliminar.addEventListener('click', () => {
                eliminarProducto(producto.id);
            });
        });
    }
    
    // Actualizar resumen del pedido
    actualizarResumenPedido();
}

// Función para cambiar la cantidad de un producto
function cambiarCantidad(id, cambio) {
    const producto = carritoProductos.find(item => item.id === id);
    if (producto) {
        producto.cantidad = Math.max(1, Math.min(10, producto.cantidad + cambio));
        guardarCarritoEnLocalStorage();
        actualizarCarritoUI();
        actualizarContadorCarrito();
    }
}

// Función para actualizar la cantidad desde el input
function actualizarCantidadDesdeInput(id, valor) {
    const cantidad = parseInt(valor);
    if (!isNaN(cantidad) && cantidad > 0 && cantidad <= 10) {
        const producto = carritoProductos.find(item => item.id === id);
        if (producto) {
            producto.cantidad = cantidad;
            guardarCarritoEnLocalStorage();
            actualizarCarritoUI();
            actualizarContadorCarrito();
        }
    }
}

// Función para eliminar un producto del carrito
function eliminarProducto(id) {
    carritoProductos = carritoProductos.filter(item => item.id !== id);
    guardarCarritoEnLocalStorage();
    actualizarCarritoUI();
    actualizarContadorCarrito();
}

// Función para actualizar el contador del carrito en el icono
function actualizarContadorCarrito() {
    const contador = document.querySelector('.cart-count');
    const totalItems = carritoProductos.reduce((total, item) => total + item.cantidad, 0);
    contador.textContent = totalItems;
}

// Función para actualizar el resumen del pedido
function actualizarResumenPedido() {
    const subtotalElement = document.getElementById('subtotal');
    const envioElement = document.getElementById('envio');
    const totalElement = document.getElementById('total');
    
    // Calcular subtotal
    const subtotal = carritoProductos.reduce((total, item) => total + (item.precio * item.cantidad), 0);
    
    // Determinar costo de envío
    const costoEnvio = subtotal >= ENVIO_GRATIS_LIMITE ? 0 : COSTO_ENVIO;
    
    // Calcular descuento si hay uno aplicado
    const descuento = subtotal * (descuentoAplicado / 100);
    
    // Calcular total
    const total = subtotal - descuento + costoEnvio;
    
    // Actualizar elementos del DOM
    subtotalElement.textContent = `${formatearPrecio(subtotal)} €`;
    envioElement.textContent = costoEnvio === 0 ? 'Gratis' : `${formatearPrecio(costoEnvio)} €`;
    totalElement.textContent = `${formatearPrecio(total)} €`;
}

// Función para aplicar un código de descuento
function aplicarCodigoDescuento() {
    const codigoInput = document.getElementById('codigo-descuento');
    const codigo = codigoInput.value.trim().toUpperCase();
    
    // Verificar si el código existe
    if (Object.keys(codigosDescuento).map(c => c.toUpperCase()).includes(codigo)) {
        // Aplicar descuento
        descuentoAplicado = codigosDescuento[codigo];
        codigoAplicado = codigo;
        
        // Mostrar mensaje de descuento aplicado
        let descuentoElement = document.querySelector('.descuento-aplicado');
        if (!descuentoElement) {
            descuentoElement = document.createElement('div');
            descuentoElement.className = 'descuento-aplicado';
            document.querySelector('.codigo-descuento').after(descuentoElement);
        }
        
        descuentoElement.innerHTML = `¡Descuento del ${descuentoAplicado}% aplicado!`;
        descuentoElement.classList.add('show');
        
        // Actualizar resumen del pedido
        actualizarResumenPedido();
        
        // Limpiar input
        codigoInput.value = '';
    } else {
        // Mostrar mensaje de error
        alert('El código de descuento no es válido.');
        codigoInput.value = '';
    }
}

// Función para finalizar la compra
function finalizarCompra() {
    if (carritoProductos.length === 0) {
        alert('Tu carrito está vacío. Añade productos antes de finalizar la compra.');
        return;
    }
    
    // Aquí iría la lógica para procesar el pago, pero por ahora solo mostraremos un mensaje
    alert('¡Compra finalizada con éxito! Tu pedido se ha procesado correctamente.');
    
    // Vaciar carrito
    carritoProductos = [];
    guardarCarritoEnLocalStorage();
    actualizarCarritoUI();
    actualizarContadorCarrito();
    
    // Resetear descuento
    descuentoAplicado = 0;
    codigoAplicado = '';
}

// Función para inicializar el FAQ
function inicializarFAQ() {
    document.querySelectorAll('.faq-pregunta').forEach(item => {
        item.addEventListener('click', () => {
            const respuesta = item.nextElementSibling;
            const icon = item.querySelector('.faq-icon');
            
            respuesta.classList.toggle('active');
            item.classList.toggle('active');
        });
    });
}

// Función para formatear precios
function formatearPrecio(precio) {
    return precio.toFixed(2).replace('.', ',');
}