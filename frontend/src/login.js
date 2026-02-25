const loginForm = document.getElementById('formulario-login');

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // 1. Capturamos lo que escribió el usuario
    const emailIngresado = document.getElementById('correos').value;
    const passIngresada = document.getElementById('pass').value;

    // 2. Traemos la lista de usuarios que guardamos en el Registro
    const usuariosRegistrados = JSON.parse(localStorage.getItem('usuarios')) || [];

    // 3. BUSCAMOS: ¿Hay algún usuario con ese correo y esa clave?
    const usuarioValidado = usuariosRegistrados.find(user =>
        user.correo === emailIngresado && user.pass === passIngresada
    );

    if (usuarioValidado) {
        // ¡ENCONTRADO! 
        // 4. PERSISTENCIA: Guardamos quién es el "Usuario Activo" en esta sesión
        localStorage.setItem('usuarioActivo', JSON.stringify(usuarioValidado));

        alert(`¡Hola de nuevo, ${usuarioValidado.nombre}!`);
        window.location.href = 'perfil.html'; // Nos vamos al perfil
    } else {
        // No coinciden los datos
        alert("Ops... el correo o la contraseña no coinciden. Revisa de nuevo.");
    }
});