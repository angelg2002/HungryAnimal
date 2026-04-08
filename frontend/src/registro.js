const registroForm = document.getElementById('form-registro');

registroForm.addEventListener('submit', async (e) => {
  e.preventDefault(); // Detenemos el envío para que no se recargue la página

  // 1. Capturamos los valores del formulario
  const nombre = document.getElementById('reg-nombre').value;
  const apellido = document.getElementById('reg-apellido').value;
  const mascota = document.getElementById('reg-tipo-mascota').value;
  const correo = document.getElementById('reg-correo').value;
  const pass = document.getElementById('reg-pass').value;

  try {
    // 2. Enviamos los datos por POST a nuestro backend
    const respuesta = await fetch('https://hungry-animal-api.onrender.com/api/registro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, apellido, mascota, correo, pass })
    });

    const data = await respuesta.json();

    if (respuesta.status === 201) {
        // 3. Auto-Login: Guardamos la sesión activa en LocalStorage
        localStorage.setItem('usuarioActivo', JSON.stringify(data));
        alert(`¡Cuenta creada con éxito, ${data.nombre}!`);
        window.location.href = 'perfil.html';
    } else {
        alert(`Ops... ${data.error}`);
    }
  } catch (error) {
      console.error('Error al intentar registrarse:', error);
      alert('Hubo un problema de conexión con el servidor. Inténtalo más tarde.');
  }
});
