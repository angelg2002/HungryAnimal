console.log('el maquetador de domesticos se está leyendo');

// Variable global para guardar los productos domésticos
let articulosDomesticos = [];

// 1. CONEXIÓN: Carga los productos desde el JSON (igual que app.js)
async function cargarProductosDomesticos() {
    try {
        const respuesta = await fetch('./frontend/productos.json');
        const todosLosProductos = await respuesta.json();

        // Filtramos solo los domésticos
        articulosDomesticos = todosLosProductos.filter(articulo => articulo.categoria === 'domestico');

        maquetadordeproductosC(articulosDomesticos);
    } catch (error) {
        console.error("Error al cargar productos domésticos:", error);
    }
}

// 2. MAQUETACIÓN (Ahora recibe los artículos por parámetro)
function maquetadordeproductosC(articulos) {
    const contenedorCD = document.getElementById('contenedor-domesticos');
    if (!contenedorCD || !articulos) return;

    if (articulos.length === 0) {
        contenedorCD.innerHTML = `<p>no hay productos domesticos para mostrar</p>`;
        return;
    }

    let htmlString = '';

    articulos.forEach(articulo => {
        const botonesOpciones = articulo.presentaciones.map((pres, index) => `
            <button onclick="seleccionarOpcionD(${articulo.id}, ${pres.precio}, '${pres.nombre}', this)" 
                    class="boton-opcion border border-lime-800 rounded px-2 py-1 text-xs ${index === 0 ? 'bg-lime-800 text-white' : 'text-lime-800'}">
                ${pres.nombre}
            </button>
        `).join('');

        htmlString += `
            <div class="tarjeta-contenedor bg-white p-4 rounded-2xl shadow flex flex-col gap-4 hover:-translate-y-1 hover:shadow-lg duration-200">
                <a href="detalleProducto.html?id=${articulo.id}">
                    <img src="${articulo.img}" alt="${articulo.nombre}" class="w-full h-40 rounded-lg object-cover">
                    <h3 class="font-bold">${articulo.nombre}</h3>
                    <h3>⭐⭐⭐⭐⭐</h3>
                    <h4 id="precio-${articulo.id}" class="text-lime-800 font-bold">$${articulo.presentaciones[0].precio.toLocaleString()}</h4>
                </a>

                <div class="flex gap-2 mt-2" id="grupo-botones-${articulo.id}">
                    ${botonesOpciones}
                </div>

                <button id="btn-add-${articulo.id}"                        
                        data-precio-elegido="${articulo.presentaciones[0].precio}"
                        data-presentacion-elegida="${articulo.presentaciones[0].nombre}"
                        class="w-full h-10 bg-lime-800 hover:bg-lime-900 transition-colors rounded text-amber-100 mt-auto">
                    Agregar al carrito
                </button>
            </div>
        `;
    });
    contenedorCD.innerHTML = htmlString;
    activarBotonesCarrito();
}

// 3. SELECCIÓN DE OPCIÓN
window.seleccionarOpcionD = (idProducto, precioNuevo, nombrePres, botonTocado) => {
    const etiquetaPrecio = document.getElementById(`precio-${idProducto}`);
    if (etiquetaPrecio) etiquetaPrecio.innerText = `$${precioNuevo.toLocaleString()}`;

    const btnAgregar = document.getElementById(`btn-add-${idProducto}`);
    if (btnAgregar) {
        btnAgregar.setAttribute('data-precio-elegido', precioNuevo);
        btnAgregar.setAttribute('data-presentacion-elegida', nombrePres);
    }

    const botones = botonTocado.parentElement.querySelectorAll('.boton-opcion');
    botones.forEach(btn => {
        btn.classList.remove('bg-lime-800', 'text-white');
        btn.classList.add('text-lime-800');
    });
    botonTocado.classList.add('bg-lime-800', 'text-white');
    botonTocado.classList.remove('text-lime-800');
};

// 4. BOTONES DE CARRITO
function activarBotonesCarrito() {
    const botones = document.querySelectorAll('[id^="btn-add-"]');

    botones.forEach(btn => {
        btn.addEventListener('click', () => {
            const id = Number(btn.id.split('-').pop());
            const precioElegido = Number(btn.getAttribute('data-precio-elegido'));
            const presentacionElegida = btn.getAttribute('data-presentacion-elegida');

            // Ahora busca en la variable que trajo el fetch
            const articuloOriginal = articulosDomesticos.find(a => a.id === id);

            let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

            const indice = carrito.findIndex(p =>
                p.id === id && p.presentacion === presentacionElegida
            );

            if (indice !== -1) {
                carrito[indice].cantidad++;
            } else {
                carrito.push({
                    ...articuloOriginal,
                    precio: precioElegido,
                    presentacion: presentacionElegida,
                    cantidad: 1
                });
            }

            localStorage.setItem('carrito', JSON.stringify(carrito));

            if (typeof updatecirclecard === "function") {
                updatecirclecard();
            }

            btn.innerText = "¡Agregado! ✅";
            setTimeout(() => btn.innerText = "Agregar al carrito", 1000);
        });
    });
}

// 5. INICIALIZACIÓN: El flujo empieza con el fetch
document.addEventListener('DOMContentLoaded', cargarProductosDomesticos);