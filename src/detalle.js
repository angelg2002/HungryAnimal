document.addEventListener('DOMContentLoaded', () => {
    const queryParams = new URLSearchParams(window.location.search);
    const idABuscar = queryParams.get('id');
    const articulo = articulos.find(p => p.id == idABuscar);
    const contenedor = document.getElementById('contenedor-detalle');

    if (!articulo) {
        contenedor.innerHTML = `
            <div class="text-center py-20">
                <img src="assets/img/lizard-search.png" class="mx-auto w-64 mb-6">
                <h1 class="text-4xl font-bold text-amber-900">PRODUCTO NO ENCONTRADO</h1>
                <a href="index.html" class="mt-8 inline-block bg-lime-800 text-white px-6 py-3 rounded-2xl">
                    Volver a la tienda
                </a>
            </div>
        `;
        return;
    }

    renderizarDetalle(articulo, contenedor);
    updatecirclecard();  // ← para mostrar el contador cuando se carga la página
});


function renderizarDetalle(articulo, contenedor) {
    contenedor.innerHTML = `
        <div class="bg-lime-800/50 flex flex-col sm:flex-row h-full justify-between p-10 gap-4 items-center rounded-2xl">
            <div class="border bg-white rounded-2xl contain-content object-cover md:h-3/4 hover:scale-105 hover:scale-z-300 w-full">
                <img src="${articulo.img}" alt="${articulo.nombre}" class="h-auto rounded-2xl justify-center">
            </div>

            <div class="flex flex-col  overflow-x-auto gap-4 bg-white p-4 w-full h-full rounded-2xl border ">
                <h2 class="text-start font-bold text-2xl  uppercase p-4">${articulo.nombre}</h2>
                <article class="bg-white rounded-2xl text-black text-lg p-4">
                    <p class="text-start">
                        ¡Dale a tu ${articulo.especie} lo mejor!
                    </p>
                </article>

                 <div class="flex flex-col sm:flex-row  w-full  mt-2 gap-4" id="grupo-botones-${articulo.id}">
                    <button onclick="seleccionarOpcion(${articulo.id}, ${articulo.presentaciones[0].precio}, this)" 
                            class="boton-opcion bg-lime-800 text-white rounded px-2 py-1">
                        ${articulo.presentaciones[0].nombre}
                    </button>
                    <button onclick="seleccionarOpcion(${articulo.id}, ${articulo.presentaciones[1].precio}, this)" 
                            class="boton-opcion text-lime-800 border border-lime-800 rounded px-2 py-1">
                        ${articulo.presentaciones[1].nombre}
                    </button>
                    <h4 id="precio-${articulo.id}" class="text-lime-800 font-bold mr-20 p-4">$${articulo.precio}</h4>
                </div>
                
               <button id="btn-add-${articulo.id}" 
                        onclick="agregarAlCarrito(${articulo.id})"
                        data-precio-elegido="${articulo.presentaciones[0].precio}"
                        data-presentacion-elegida="${articulo.presentaciones[0].nombre}"
                        class="w-full h-3/4 md:h-1/3 bg-lime-800/75 rounded text-amber-100 mt-auto p-2 text-center contain-content">
                    Agregar al carrito
                </button>
            </div>
        </div>
    `;

    const boton = document.getElementById(`btn-agregar-${articulo.id}`);

    boton.addEventListener('click', () => {
        let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

        const indice = carrito.findIndex(p => p.id === articulo.id);

        if (indice !== -1) {
            carrito[indice].cantidad++;
        } else {
            carrito.push({ ...articulo, cantidad: 1 });
        }

        localStorage.setItem('carrito', JSON.stringify(carrito));

        updatecirclecard(); // ← AHORA sí actualizará el icono inmediatamente
    });
}
window.seleccionarOpcion = (idProducto, precioNuevo, botonTocado) => {
    const etiquetaPrecio = document.getElementById(`precio-${idProducto}`);
    if (etiquetaPrecio) {
        etiquetaPrecio.innerText = `$${precioNuevo.toLocaleString()}`;
    }

    const btnAgregar = document.getElementById(`btn-add-${idProducto}`);
    if (btnAgregar) {
        // Guardamos el precio de la presentación seleccionada (ej: 55000)
        btnAgregar.setAttribute('data-precio-elegido', precioNuevo);
        
        // Guardamos el nombre de la presentación (ej: '9KG')
        const nombreOpcion = botonTocado.innerText;
        btnAgregar.setAttribute('data-presentacion-elegida', nombreOpcion);
    }

    // 3. Lógica de colores de los botones (lo que ya tenías)
    const contenedorBotones = document.getElementById(`grupo-botones-${idProducto}`);
    const botones = contenedorBotones.querySelectorAll('.boton-opcion');
    botones.forEach(btn => {
        btn.classList.remove('bg-lime-800', 'text-white');
        btn.classList.add('text-lime-800');
    });
    botonTocado.classList.add('bg-lime-800', 'text-white');
    botonTocado.classList.remove('text-lime-800');
};







