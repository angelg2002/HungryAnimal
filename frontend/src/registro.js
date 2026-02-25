const registroForm = document.getElementById('form-registro');

registroForm.addEventListener('submit', (e) => {
    e.preventDefault(); // Detenemos el envío para que no se recargue la página

    // Capturamos los valores igual que en tu clase de DOM
    const nuevoUsuario = {
        id: Date.now(), // Un ID único basado en el tiempo
        nombre: document.getElementById('reg-nombre').value,
        apellido: document.getElementById('reg-apellido').value,
        mascota: document.getElementById('reg-tipo-mascota').value,
        correo: document.getElementById('reg-correo').value,
        pass: document.getElementById('reg-pass').value
    };

    // 1. Traer lo que ya existe en "la base de datos" (o un array vacío)
    let baseDeDatos = JSON.parse(localStorage.getItem('usuarios')) || [];

    // 2. Hacer el "Push" (Igual que en la To-Do List)
    baseDeDatos.push(nuevoUsuario);

    // 3. Guardar de nuevo en el LocalStorage
    localStorage.setItem('usuarios', JSON.stringify(baseDeDatos));

    alert("¡Cuenta creada con éxito, " + nuevoUsuario.nombre + "!");

    // Redirigimos al usuario a su perfil para que vea sus datos
    window.location.href = 'perfil.html';
});
