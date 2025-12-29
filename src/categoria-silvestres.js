function maquetadordeproductosS() {
    const contenedorCS = document.getElementById('contenedor-silvestres');
    const filtroPS = articulos.filter(articulo => articulo.categoria === 'silvestre');

    if (filtroPS.length === 0) {
        contenedorCS.innerHTML = `<p>no hay productos disponibles </p>`;
        return
    }

    let html =''
    
    filtroPS.forEach(articulo => {
        
         html += `
            <div class="tarjeta-contenedor bg-white p-4 rounded-2xl shadow flex flex-col gap-4 hover:-translate-y-1 hover:shadow-lg duration-200">
                <a href="detalleProducto.html?id=${articulo.id}">
                    <img src="${articulo.img}" alt="${articulo.nombre}" class="w-full h-40 rounded-lg object-cover">
                    <h3 class="font-bold">${articulo.nombre}</h3>
                    <h3>⭐⭐⭐⭐⭐</h3>
                    <h4 id="precio-${articulo.id}" class="text-lime-800 font-bold">$${articulo.precio}</h4>
                </a>

                <div class="flex gap-2 mt-2" id="grupo-botones-${articulo.id}">
                    <button onclick="seleccionarOpcion(${articulo.id}, ${articulo.presentaciones[0].precio}, this)" 
                            class="boton-opcion bg-lime-800 text-white rounded px-2 py-1">
                        ${articulo.presentaciones[0].nombre}
                    </button>
                    <button onclick="seleccionarOpcion(${articulo.id}, ${articulo.presentaciones[1].precio}, this)" 
                            class="boton-opcion text-lime-800 border border-lime-800 rounded px-2 py-1">
                        ${articulo.presentaciones[1].nombre}
                    </button>
                </div>

                <button id="btn-add-${articulo.id}" 
                        onclick="agregarAlCarrito(${articulo.id})"
                        data-precio-elegido="${articulo.presentaciones[0].precio}"
                        data-presentacion-elegida="${articulo.presentaciones[0].nombre}"
                        class="w-full h-10 bg-lime-800/75 rounded text-amber-100 mt-auto">
                    Agregar al carrito
                </button>
            </div>
        `;
    });

        contenedorCS.innerHTML = html

        activarBotonesCarrito()
}


function activarBotonesCarrito() {

    
    articulos.forEach(articulo => {
        const btn = document.getElementById(`btn-add-${articulo.id}`);
        if (!btn) return;

        btn.addEventListener('click', () => {
            let carrito = [];

            try {
                const datos = JSON.parse(localStorage.getItem('carrito'));
                if (Array.isArray(datos)) carrito = datos;
            } catch {}

            const indice = carrito.findIndex(p => p.id === articulo.id);

            if (indice !== -1) {
                carrito[indice].cantidad++;
            } else {
                carrito.push({ ...articulo, cantidad: 1 });
            }

            localStorage.setItem('carrito', JSON.stringify(carrito));

            if (typeof updatecirclecard === "function") {
                updatecirclecard();
            }
        });
    });
}

document.addEventListener('DOMContentLoaded',maquetadordeproductosS)