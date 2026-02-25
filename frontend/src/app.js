console.log('HungryAnimal está conectado correctamente');

// Variable global para guardar los productos una vez lleguen del backend
let productosData = [];

// 1. MENÚ DE DESPLIEGUE (Se queda igual)
function menuDespliegue() {
    const botonMenu = document.getElementById('menu-despliegue');
    const menu = document.getElementById('menu-principal');
    const cerrarMenu = document.getElementById('btn-cerrar');
    const mainId = document.getElementById('main-id');

    if (!botonMenu || !menu) return;

    botonMenu.addEventListener('click', () => {
        menu.classList.toggle('hidden');
        menu.classList.add('flex');
    });

    [cerrarMenu, mainId].forEach(el => {
        el?.addEventListener('click', () => menu.classList.add('hidden'));
    });
}

// 2. CONEXIÓN AL BACKEND (NUEVA FUNCIÓN)
async function cargarProductosDesdeBackend() {
    try {
        // Ahora apunta a tu archivo local
        const respuesta = await fetch('../productos.json');
        productosData = await respuesta.json();

        maquetadordeproductos(productosData);
        ejecutarBusquedaInicial();
    } catch (error) {
        console.error("Error al cargar el JSON local:", error);
    }
}

// 3. MAQUETACIÓN (MODIFICADO: Ahora recibe los artículos por parámetro)
function maquetadordeproductos(articulos) {
    const contenedor = document.getElementById('contenedor-articulos');
    if (!contenedor || !articulos) return;

    let htmlString = '';

    articulos.forEach(articulo => {
        const botonesOpciones = articulo.presentaciones.map((pres, index) => `
            <button onclick="seleccionarOpcion(${articulo.id}, ${pres.precio}, '${pres.nombre}', this)" 
                    class="boton-opcion border border-lime-800 rounded px-2 py-1 text-xs ${index === 0 ? 'bg-lime-800 text-white' : 'text-lime-800'}">
                ${pres.nombre}
            </button>
        `).join('');

        htmlString += `
            <div class="tarjeta-contenedor bg-white p-4 rounded-2xl shadow flex flex-col gap-4 hover:-translate-y-1 hover:shadow-lg duration-200">
                <a href="detalleProducto.html?id=${articulo.id}" class="flex flex-col gap-2 h-full">
                    <img src="${articulo.img}" alt="${articulo.nombre}" class="w-full h-40 rounded-lg object-cover">
                    <h3 class="font-bold text-gray-800">${articulo.nombre}</h3>
                    <div class="text-yellow-500 text-sm">⭐⭐⭐⭐⭐</div>
                    <h4 id="precio-${articulo.id}" class="text-lime-800 font-bold text-xl">$${articulo.presentaciones[0].precio.toLocaleString()}</h4>
                </a>

                <div class="flex flex-wrap gap-2 mt-2" id="grupo-botones-${articulo.id}">
                    ${botonesOpciones}
                </div>

                <button id="btn-add-${articulo.id}" 
                        onclick="agregarAlCarrito(${articulo.id})"
                        data-precio-elegido="${articulo.presentaciones[0].precio}"
                        data-presentacion-elegida="${articulo.presentaciones[0].nombre}"
                        class="w-full h-10 bg-lime-800 hover:bg-lime-900 transition-colors rounded text-amber-100 mt-auto font-medium">
                    Agregar al carrito
                </button>
            </div>
        `;
    });

    contenedor.innerHTML = htmlString;
}

// 4. SELECCIÓN DE OPCIÓN (Se queda igual)
window.seleccionarOpcion = (idProducto, precioNuevo, nombrePres, botonTocado) => {
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

// 5. CARRITO (MODIFICADO: Ahora busca en la variable de productosData)
window.agregarAlCarrito = (id) => {
    const btn = document.getElementById(`btn-add-${id}`);
    const precio = parseFloat(btn.getAttribute('data-precio-elegido'));
    const presentacion = btn.getAttribute('data-presentacion-elegida');

    // Buscamos el artículo en los datos que trajo el backend
    const articuloOriginal = productosData.find(a => a.id === id);

    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const indice = carrito.findIndex(p => p.id === id && p.presentacionElegida === presentacion);

    if (indice !== -1) {
        carrito[indice].cantidad++;
    } else {
        carrito.push({
            id: articuloOriginal.id,
            nombre: articuloOriginal.nombre,
            img: articuloOriginal.img,
            precio: precio,
            presentacionElegida: presentacion,
            cantidad: 1
        });
    }

    localStorage.setItem('carrito', JSON.stringify(carrito));

    btn.innerText = "¡Agregado! ✅";
    setTimeout(() => btn.innerText = "Agregar al carrito", 1000);

    if (typeof updatecirclecard === "function") updatecirclecard();
};

// 6. BUSCADOR — Filtra las tarjetas del DOM según lo que el usuario escribe
function fBuscador() {
    const inputB = document.getElementById('buscador');
    const mensajeError = document.getElementById('mensaje-busqueda');
    const bannerOferta = document.getElementById('banner');
    const tarjetas = document.querySelectorAll('.tarjeta-contenedor');

    if (!inputB) return;
    const nombreB = inputB.value.trim().toLowerCase();
    let contador = 0;

    // Si el campo está vacío, mostramos todo y salimos
    if (nombreB === '') {
        tarjetas.forEach(tarjeta => tarjeta.classList.remove('hidden'));
        mensajeError?.classList.add('hidden');
        bannerOferta?.classList.remove('hidden');
        return;
    }

    // Filtramos las tarjetas que coincidan con el texto
    tarjetas.forEach(tarjeta => {
        const nombreP = tarjeta.querySelector('h3').textContent.toLowerCase();
        const coincide = nombreP.includes(nombreB);
        tarjeta.classList.toggle('hidden', !coincide);
        if (coincide) contador++;
    });

    if (contador === 0) {
        bannerOferta?.classList.add('hidden');
        if (mensajeError) {
            mensajeError.classList.remove('hidden');
            mensajeError.innerHTML = `
                <div class="text-center py-10"> 
                <img src="./galery/buscando huellas lagartija-photoroom.png" alt="No encontrado" class="w-64 h-64 mx-auto mb-4">
                    <h3 class="text-2xl font-bold text-orange-700">No encontramos "${nombreB}"</h3>
                    <p class="text-gray-600">Vuelve al <a href="index.html" class="underline text-lime-800">inicio</a></p>
                </div>`;
        }
    } else {
        mensajeError?.classList.add('hidden');
        bannerOferta?.classList.remove('hidden');
    }
}

// 7. CONECTAR EVENTOS DEL BUSCADOR (solo Enter y click en lupa)
function activarBuscador() {
    const inputB = document.getElementById('buscador');
    const lupa = document.getElementById('lupa');

    if (inputB) {
        // Busca solo al presionar Enter
        inputB.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                fBuscador();
            }
        });
    }

    if (lupa) {
        // Busca al hacer click en la lupa
        lupa.addEventListener('click', fBuscador);
        lupa.style.cursor = 'pointer';
    }
}

// 8. LÓGICA DE URL — Si llega ?buscar=algo, ejecuta la búsqueda automáticamente
function ejecutarBusquedaInicial() {
    const params = new URLSearchParams(window.location.search);
    const termino = params.get("buscar");
    if (termino) {
        const input = document.getElementById('buscador');
        if (input) {
            input.value = termino;
            fBuscador();
        }
    }
}

// 9. INICIALIZACIÓN (El flujo empieza con el fetch)
document.addEventListener('DOMContentLoaded', () => {
    menuDespliegue();
    activarBuscador(); // <--- Conecta los eventos del buscador
    cargarProductosDesdeBackend(); // <--- Carga los productos y ejecuta búsqueda inicial
});

function configurarNavegacionPerfil() {
    const linkPerfil = document.getElementById('perfil-link');
    const usuarioActivo = JSON.parse(localStorage.getItem('usuarioActivo'));

    if (!linkPerfil) return; // Si no hay icono en esta página, no hacemos nada

    if (usuarioActivo) {
        // CASO 1: Ya inició sesión
        linkPerfil.href = 'perfil.html';
        console.log("Navegación configurada: Ir a Perfil");
    } else {
        // CASO 2: Usuario anónimo
        linkPerfil.href = 'login.html';
        console.log("Navegación configurada: Ir a Login");
    }
}

// Importante: Ejecutarlo siempre que cargue el DOM
document.addEventListener('DOMContentLoaded', configurarNavegacionPerfil);