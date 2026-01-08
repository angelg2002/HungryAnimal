console.log('HungryAnimal está conectado correctamente');
//FUNCIONAMIENTO DE MENU DE DESPLIEGUE
function menuDespliegue() {
    const botonMenu =  document.getElementById('menu-despliegue');
    const menu = document.getElementById('menu-principal');
    const cerrarMenu = document.getElementById('btn-cerrar');
    const mainId =  document.getElementById('main-id');


    botonMenu.addEventListener('click',() => {
        menu.classList.toggle('hidden');
        menu.classList.add('flex');
      
    })

    cerrarMenu.addEventListener('click', ()=>{
        menu.classList.add('hidden')
    })

    mainId.addEventListener('click', () => {
        menu.classList.add('hidden')
    })


}

menuDespliegue()


//funcionamiento despliegue de barra buscadora

//para hacer que el texto no se salga del contenedor con tailwind 


// ============================================================================
// 1. MAQUETACIÓN DE PRODUCTOS
// ============================================================================
function maquetadordeproductos() {
    const contenedor = document.getElementById('contenedor-articulos');
    if (!contenedor) return;

    let htmlString = '';

    articulos.forEach(articulo => {
        htmlString += `
            <div class="tarjeta-contenedor bg-white p-4 rounded-2xl shadow flex flex-col  gap-4 hover:-translate-y-1 hover:shadow-lg duration-200 overflow-x-auto">
                <a href="detalleProducto.html?id=${articulo.id}" class="flex flex-col gap-2 h-full">
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

    contenedor.innerHTML = htmlString;
}
document.addEventListener('DOMContentLoaded', maquetadordeproductos);




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


// ============================================================================
// 2. CARRITO: MANEJO DE BOTONES "AGREGAR"
// ============================================================================
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



// 3. BUSCADOR UNIVERSAL (FUNCIONA EN TODA LA WEB)


// Filtra productos en el index
function fBuscador() {
    const inputB = document.getElementById('buscador');
    const mensajeError = document.getElementById('mensaje-busqueda');
    const bannerOferta = document.getElementById('banner');
    const tarjetas = document.querySelectorAll('.tarjeta-contenedor');

    if (!inputB || !tarjetas.length) return;

    const nombreB = inputB.value.trim().toLowerCase();
    let contador = 0;

    tarjetas.forEach(tarjeta => {
        const nombreP = tarjeta.querySelector('h3').textContent.toLowerCase();
        const coincide = nombreP.includes(nombreB);

        tarjeta.classList.toggle('hidden', !coincide);

        if (coincide) contador++;
    });

    if (contador === 0 && nombreB !== '') {
        bannerOferta?.classList.add('hidden');

        mensajeError?.classList.remove('hidden');
        mensajeError.innerHTML = `
            <div class="text-center text-3xl text-orange-700 font-bold"> 
                <img src="./galery/buscando huellas lagartija-Photoroom.png" class="w-1/2 mx-auto">
                <h3>Lo sentimos, no se ha encontrado <b>${nombreB}</b></h3>
                <p>No te preocupes, tenemos otros productos <span class='underline text-lime-800/75'><a href='index.html'>aquí</a></span></p>
            </div>`;
    } else {
        mensajeError?.classList.add('hidden');
        bannerOferta?.classList.remove('hidden');
    }
}



// Entrada principal del buscador (Enter)
function iniciarBuscador() {
    const input = document.getElementById('buscador');
    if (!input) return;

    input.addEventListener('keydown', e => {
        if (e.key !== 'Enter') return;

        e.preventDefault();
        const query = input.value.trim().toLowerCase();

        if (window.location.pathname.includes("index.html") || window.location.pathname === "/") {
            fBuscador();
        } else {
            window.location.href = `index.html?buscar=${encodeURIComponent(query)}`;
        }
    });

    // Botón lupa
    const botonLupa = document.getElementById('lupa');
    if (botonLupa) {
        botonLupa.addEventListener('click', () => {
            const query = input.value.trim().toLowerCase();

            if (window.location.pathname.includes("index.html") || window.location.pathname === "/") {
                fBuscador();
            } else {
                window.location.href = `index.html?buscar=${encodeURIComponent(query)}`;
            }
        });
    }
}

iniciarBuscador();





// 4. AUTO CARGAR ?buscar= EN EL INDEX

function ejecutarBusquedaInicial() {
    if (!window.location.search.includes("buscar")) return;

    const params = new URLSearchParams(window.location.search);
    const termino = params.get("buscar");

    if (!termino) return;

    const input = document.getElementById('buscador');
    if (!input) return;

    input.value = termino;
    fBuscador();
}


document.addEventListener('DOMContentLoaded', () => {
    maquetadordeproductos();   // crea tarjetas
    ejecutarBusquedaInicial(); // ahora sí puede buscar
});


