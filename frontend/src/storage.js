// storage.js

console.log('El cerebro del almacenamiento está listo');

// 1. Función para el círculo rojo
function updatecirclecard() {
    const contadorHTML = document.getElementById('contador-carrito');
    if (!contadorHTML) return;
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    let unidades = 0;
    carrito.forEach(producto => {
        unidades += (producto.cantidad || 1);
    });

    if (unidades > 0) {
        contadorHTML.textContent = unidades;
        contadorHTML.classList.remove('hidden');
    } else {
        contadorHTML.classList.add('hidden');
    }
}

// 2. FUNCIÓN AGREGAR (La hacemos global para que no falle)
window.agregarAlCarrito = function(id) {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const btn = document.getElementById(`btn-add-${id}`);
    const productoBase = articulos.find(p => p.id === id);

    if (!btn || !productoBase) return;

    // CAPTURA DE DATOS: Priorizamos lo que diga el botón
    const precioFinal = btn.getAttribute('data-precio-elegido') 
                        ? Number(btn.getAttribute('data-precio-elegido')) 
                        : productoBase.precio;

    const presentacionFinal = btn.getAttribute('data-presentacion-elegida') 
                              || productoBase.presentaciones[0].nombre;

    // Buscamos si ya existe el combo (ID + PRESENTACIÓN)
    const existe = carrito.find(p => p.id === id && p.presentacion === presentacionFinal);

    if (existe) {
        existe.cantidad++;
    } else {
        carrito.push({
            ...productoBase,
            precio: precioFinal,
            presentacion: presentacionFinal,
            cantidad: 1
        });
    }

    localStorage.setItem('carrito', JSON.stringify(carrito));
    updatecirclecard();
    alert(`¡Agregado: ${productoBase.nombre} (${presentacionFinal})!`);
};

document.addEventListener('DOMContentLoaded', updatecirclecard);
    