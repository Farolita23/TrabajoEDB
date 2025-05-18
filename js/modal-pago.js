// Variables para el modal de pago
const modalPago = document.getElementById('modal-pago');
const cerrarModal = document.querySelector('.cerrar-modal');
const btnCancelar = document.getElementById('btn-cancelar');
const btnConfirmar = document.getElementById('btn-confirmar');
const metodoPagoInputs = document.querySelectorAll('input[name="metodo-pago"]');
const formulariosPago = document.querySelectorAll('.formulario-pago');

// Generar número de pedido aleatorio
document.getElementById('numero-pedido').textContent = Math.floor(100000 + Math.random() * 900000);

// Modificar la función finalizarCompra para mostrar el modal
function finalizarCompra() {
    if (carritoProductos.length === 0) {
        alert('Tu carrito está vacío. Añade productos antes de finalizar la compra.');
        return;
    }
    
    // Actualizar el resumen en el modal
    actualizarResumenModal();
    
    // Mostrar el formulario del primer método de pago (tarjeta) por defecto
    mostrarFormularioPago('tarjeta');
    
    // Mostrar el modal
    modalPago.style.display = 'block';
    document.body.style.overflow = 'hidden'; // Prevenir scroll en el fondo
}

// Actualizar el resumen en el modal
function actualizarResumenModal() {
    const subtotalElement = document.getElementById('modal-subtotal');
    const envioElement = document.getElementById('modal-envio');
    const totalElement = document.getElementById('modal-total');
    
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

// Mostrar el formulario según el método de pago seleccionado
function mostrarFormularioPago(metodo) {
    // Ocultar todos los formularios
    formulariosPago.forEach(form => {
        form.classList.remove('active');
    });
    
    // Mostrar el formulario correspondiente
    document.getElementById(`form-${metodo}`).classList.add('active');
}

// Evento para cambiar de formulario según el método seleccionado
metodoPagoInputs.forEach(input => {
    input.addEventListener('change', () => {
        mostrarFormularioPago(input.value);
    });
});

// Eventos para cerrar el modal
cerrarModal.addEventListener('click', () => {
    modalPago.style.display = 'none';
    document.body.style.overflow = 'auto'; // Restaurar scroll
});

btnCancelar.addEventListener('click', () => {
    modalPago.style.display = 'none';
    document.body.style.overflow = 'auto'; // Restaurar scroll
});

// También cerrar al hacer clic fuera del contenido del modal
window.addEventListener('click', (e) => {
    if (e.target === modalPago) {
        modalPago.style.display = 'none';
        document.body.style.overflow = 'auto'; // Restaurar scroll
    }
});

// Evento para confirmar el pedido
btnConfirmar.addEventListener('click', () => {
    // Obtener el método de pago seleccionado
    let metodoPago = '';
    metodoPagoInputs.forEach(input => {
        if (input.checked) {
            metodoPago = input.value;
        }
    });
    
    // Validar según el método de pago
    let valido = false;
    
    if (metodoPago === 'tarjeta') {
        // Validación simple para tarjeta
        const titular = document.getElementById('titular').value;
        const numeroTarjeta = document.getElementById('numero-tarjeta').value;
        const fechaExpiracion = document.getElementById('fecha-expiracion').value;
        const cvv = document.getElementById('cvv').value;
        
        if (titular && numeroTarjeta && fechaExpiracion && cvv) {
            valido = true;
        } else {
            alert('Por favor, completa todos los campos de la tarjeta.');
        }
    }
    else if (metodoPago === 'paypal') {
        // Validación para PayPal
        const emailPaypal = document.getElementById('email-paypal').value;
        
        if (emailPaypal && emailPaypal.includes('@')) {
            valido = true;
        } else {
            alert('Por favor, introduce un correo electrónico válido.');
        }
    }
    else if (metodoPago === 'transferencia') {
        // La transferencia no requiere validación en este punto
        valido = true;
    }
    
    // Si es válido, procesar el pedido
    if (valido) {
        // Aquí iría la lógica para procesar el pago según el método seleccionado
        
        // Mensaje de éxito según el método de pago
        if (metodoPago === 'tarjeta') {
            alert('¡Pago con tarjeta procesado correctamente! Tu pedido ha sido confirmado.');
        }
        else if (metodoPago === 'paypal') {
            alert('Serás redirigido a PayPal para completar el pago...');
        }
        else if (metodoPago === 'transferencia') {
            alert('Pedido registrado. Por favor, realiza la transferencia para que podamos procesarlo.');
        }
        
        // Cerrar modal
        modalPago.style.display = 'none';
        document.body.style.overflow = 'auto';
        
        // Vaciar carrito
        carritoProductos = [];
        guardarCarritoEnLocalStorage();
        actualizarCarritoUI();
        actualizarContadorCarrito();
        
        // Resetear descuento
        descuentoAplicado = 0;
        codigoAplicado = '';
    }
});

// Actualizar la referencia a finalizarCompra en DOMContentLoaded
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