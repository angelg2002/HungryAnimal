document.addEventListener('DOMContentLoaded', () => {
  // Intentamos sacar al usuario activo de la persistencia
  const usuarioActivo = JSON.parse(localStorage.getItem('usuarioActivo'));

  // Si NO hay nadie activo, es un intruso o no ha iniciado sesión
  if (!usuarioActivo) {
    alert('Primero debes iniciar sesión.');
    window.location.href = 'login.html';
    return; // Detenemos la ejecución
  }

  // Si llegamos aquí, el usuario es real. ¡Pintamos sus datos!
  mostrarDatos(usuarioActivo);
  cargarHistorial(usuarioActivo.id); // <--- Llamamos a la nueva función
});

function mostrarDatos(user) {
  const contenedor = document.getElementById('info-usuario');
  contenedor.innerHTML = `
        <div class="bg-white p-8 rounded-2xl shadow-lg border-l-8 border-lime-800">
            <h2 class="text-3xl font-bold text-amber-700 mb-4">Hola, ${user.nombre}</h2>
            <div class="text-amber-900 space-y-2">
                <p><strong>Email:</strong> ${user.correo}</p>
                <p><strong>Mascota:</strong> ${user.mascota}</p>
            </div>
            <button onclick="cerrarSesion()" class="mt-10 text-red-600 font-bold underline">
                Cerrar sesión
            </button>
        </div>
    `;
}

// NUEVA FUNCIÓN: Obtener y renderizar el historial del backend
async function cargarHistorial(userId) {
  const contenedor = document.getElementById('historial-pedidos');
  if (!contenedor) return;

  try {
    const respuesta = await fetch(`https://hungry-animal-api.onrender.com/api/ordenes/${Number(userId)}`);
    if (!respuesta.ok) throw new Error('Error de conexión al cargar órdenes');
    
    const pedidos = await respuesta.json();

    if (pedidos.length === 0) {
      contenedor.innerHTML = `<p class="text-gray-500 italic">Aún no has realizado ninguna compra.</p>`;
      return;
    }

    contenedor.innerHTML = pedidos.map(pedido => {
      // Formateamos la fecha para que sea legible (Ej: "7 de abril de 2026")
      const fechaFormateada = new Date(pedido.fecha).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });
      return `
        <div class="bg-white p-4 rounded-xl shadow border border-lime-800/20 flex flex-col md:flex-row md:justify-between items-start md:items-center gap-2">
          <div>
            <p class="font-bold text-amber-800">Pedido realizado el ${fechaFormateada}</p>
            <p class="text-sm text-gray-600">${pedido.productos.length} variedad(es) de producto</p>
          </div>
          <p class="font-extrabold text-lime-700 text-xl">$${pedido.total.toLocaleString()}</p>
        </div>
      `;
    }).join('');
  } catch (error) {
    console.error('Error al cargar historial:', error);
    contenedor.innerHTML = `<p class="text-red-500">Lo sentimos, hubo un problema al obtener tus pedidos. Inténtalo luego.</p>`;
  }
}

window.cerrarSesion = () => {
  // Borramos solo al activo, la lista de "usuarios" (base de datos) se queda intacta
  localStorage.removeItem('usuarioActivo');
  alert('Has cerrado sesión.');
  window.location.href = 'login.html';
};

window.eliminarCuenta = () => {
  // 1. Pedimos confirmación (siempre es bueno en un Delete)
  const confirmar = confirm('¿Estás seguro de que quieres eliminar tu cuenta de HungryAnimal? Esta acción no se puede deshacer.');

  if (confirmar) {
    // 2. Traemos al usuario que está logueado y la lista completa
    const usuarioActivo = JSON.parse(localStorage.getItem('usuarioActivo'));
    let listaUsuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

    // 3. LA MAGIA DEL FILTRO: 
    // Creamos una nueva lista que contenga a TODOS, EXCEPTO al que tiene el ID del usuario activo
    listaUsuarios = listaUsuarios.filter(user => user.id !== usuarioActivo.id);

    // 4. ACTUALIZAMOS la "Base de Datos" (LocalStorage)
    localStorage.setItem('usuarios', JSON.stringify(listaUsuarios));

    // 5. LIMPIAMOS la sesión activa
    localStorage.removeItem('usuarioActivo');

    alert('Tu cuenta ha sido eliminada. ¡Esperamos verte pronto de nuevo!');

    // 6. REDIRECCIÓN Final
    window.location.href = 'index.html';
  }
};