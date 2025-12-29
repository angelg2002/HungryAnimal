



// 1. Iniciamos el HTML con la estructura base (el "pan de arriba")
function renderizarCarrito() {
    let total = 0;
    const contenedorProductosCarrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const contenedorCarrito = document.getElementById('carrito-acumulador');
    let htmlString = `
    <div class="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl mx-auto mt-10">
        <h2 class="text-2xl font-bold text-amber-700 mb-6 border-b pb-2">Tu carrito</h2>
        <ul class="flex flex-col gap-4">`;


// 2. Rellenamos con los productos (el "relleno")
contenedorProductosCarrito.forEach(producto => {

    
    let totalP =  producto.precio * producto.cantidad
  
htmlString += `
    <li class="flex justify-between items-center border-b p-3">
        <div class="flex flex-col">
            <span class="font-bold">${producto.nombre}</span>
            <span class="text-xs text-gray-500 italic">Opción: ${producto.presentacion || 'Estándar'}</span>
            <span class="text-sm">Cantidad: ${producto.cantidad}</span>
        </div>
        
        <div class="flex gap-2">
            <button onclick="cambiarCantidad(${producto.id}, -1)" class="bg-gray-200 px-3 py-1 rounded">-</button>
            <button onclick="cambiarCantidad(${producto.id}, 1)" class="bg-gray-200 px-3 py-1 rounded">+</button>
            <button onclick="eliminarProducto(${producto.id})" class="text-red-500 ml-4">
                <i class="fa-solid fa-trash"></i> </button>
        </div>
        <span class="font-bold text-lime-800">$${(totalP).toLocaleString()}</span>
    </li>
`;   



    total += totalP ; // Sumamos correctamente con +=
});

// 3. Cerramos la lista y agregamos el total (el "pan de abajo")
htmlString += `
        </ul>
        <div class="mt-6 flex justify-between items-center pt-4 border-t-2 border-amber-100">
            <span class="text-xl font-bold text-gray-800">Total:</span>
            <span class="text-2xl font-black text-lime-900">$${total.toLocaleString()}</span>
        </div>
        <button class="w-full bg-lime-800 text-white mt-6 py-3 rounded-xl font-bold hover:bg-lime-900 transition" onclick="window.location.href='direccion.html'">
            Pasar al Checkout
        </button>
    </div>`;

// 4. Inyectamos TODO el string de una sola vez

if (contenedorProductosCarrito.length > 0) {
    contenedorCarrito.innerHTML = htmlString;
    contenedorCarrito.classList.remove('hidden');
    
} else {
    contenedorCarrito.innerHTML = `<div class="text-center p-10 bg-white rounded-2xl shadow-xl">
                <img src="./galery/carrito-vacío.png" class="w-32 mx-auto mb-4 opacity-50">
                <h2 class="text-xl font-bold text-gray-400 uppercase">Tu carrito está vacío</h2>
                <p class="text-gray-400 mb-6">¡Tu mascota está esperando sus premios!</p>
                <a href="index.html" class="bg-lime-800 text-white px-6 py-2 rounded-lg hover:bg-lime-900 transition">
                    Ir a la tienda
                </a>
            </div></p>`;
   
}
}



document.addEventListener('DOMContentLoaded', renderizarCarrito());


window.cambiarCantidad = (id, cambio) => {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    const producto =  carrito.find(p => p.id === id )

    if (producto) {
        producto.cantidad += cambio;

        if (producto.cantidad <= 0) {
            eliminarProducto(id);
            return;
        }
          localStorage.setItem('carrito', JSON.stringify(carrito));
          renderizarCarrito();
          updatecirclecard();
    }
}

window.eliminarProducto = (id) => {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    
    const nCarrito = carrito.filter(p => p.id !== id);

    localStorage.setItem('carrito', JSON.stringify(nCarrito))
    renderizarCarrito()
    

    if (typeof updatecirclecard === 'function') {
        updatecirclecard();
    }

    console.log("Producto eliminado. Nuevo carrito:", nCarrito);
}


//para hacer que el modal desaparezca cuando se de click por fuera del carrito

const visualContenedor =  document.getElementById('carrito-acumulador');

if (visualContenedor) {
    visualContenedor.addEventListener('click', (e) =>{
        if (e.target === visualContenedor) {
            console.log('hiciste click afuera volviendo al comienzo');
            window.location.href = 'index.html'
        }
    })
}





//resumen de compra

