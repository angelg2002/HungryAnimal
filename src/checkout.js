function resumenCompra() {

    const contenedor = document.getElementById('contenedor-checkout');

    if (!contenedor) return;

    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    if (carrito.length === 0) {
        contenedor.innerHTML = `<p class="text-center text-2xl text-gray-700 font-bold">
                Tu carrito está vacío.
            </p>`;
            return;
    }

    let html = `
    <h2 class="text-3xl font-bold mb-6 text-lime-800">Resumen de tu compra</h2>
    <div class="flex flex-col gap-4">
`;

    
    carrito.forEach(item => {
        html += `
        <div class="flex justify-between items-center bg-white p-4 rounded-xl border-2 border-lime-800/70 shadow">
                <div class="flex gap-4 items-center">
                    <img src="${item.img}" class="w-20 h-20 object-cover rounded-lg">
                    <div>
                        <h3 class="font-bold">${item.nombre}</h3>
                        <p>Cantidad: <span class="font-bold">${item.cantidad}</span></p>
                    </div>
                </div>
                <h4 class="font-bold text-lime-800 text-xl">$${(item.precio * item.cantidad).toLocaleString()}</h4>
            </div>`
    });
    html += `</div>`
    const total = carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);

    html += `
        <div class="mt-8 p-6 bg-white text-lime-800/75 rounded-xl text-start text-2xl font-bold border">
            Total: $${total.toLocaleString()}
        </div>
        <div class="mt-6 text-center">
            <a href="#" class="bg-amber-700 text-amber-100 px-6 py-3 rounded-xl text-xl mt-6">
                Continuar con el envío
            </a>
        </div>
    `;

    contenedor.innerHTML = html
}

document.addEventListener('DOMContentLoaded', () => {
    resumenCompra();
})