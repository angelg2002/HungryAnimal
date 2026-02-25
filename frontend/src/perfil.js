document.addEventListener('DOMContentLoaded', () => {
    // Intentamos sacar al usuario activo de la persistencia
    const usuarioActivo = JSON.parse(localStorage.getItem('usuarioActivo'));

    // Si NO hay nadie activo, es un intruso o no ha iniciado sesión
    if (!usuarioActivo) {
        alert("Primero debes iniciar sesión.");
        window.location.href = 'login.html';
        return; // Detenemos la ejecución
    }

    // Si llegamos aquí, el usuario es real. ¡Pintamos sus datos!
    mostrarDatos(usuarioActivo);
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

window.cerrarSesion = () => {
    // Borramos solo al activo, la lista de "usuarios" (base de datos) se queda intacta
    localStorage.removeItem('usuarioActivo');
    alert("Has cerrado sesión.");
    window.location.href = 'login.html';
};

window.eliminarCuenta = () => {
    // 1. Pedimos confirmación (siempre es bueno en un Delete)
    const confirmar = confirm("¿Estás seguro de que quieres eliminar tu cuenta de HungryAnimal? Esta acción no se puede deshacer.");

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

        alert("Tu cuenta ha sido eliminada. ¡Esperamos verte pronto de nuevo!");

        // 6. REDIRECCIÓN Final
        window.location.href = 'index.html';
    }
};