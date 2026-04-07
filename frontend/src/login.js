const loginForm = document.getElementById('formulario-login');

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  // 1. Capturamos lo que escribió el usuario
  const emailIngresado = document.getElementById('correos').value;
  const passIngresada = document.getElementById('pass').value;

  try {
    // 2. Hacemos el fetch (POST) al backend
    const respuesta = await fetch('https://hungry-animal-api.onrender.com/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email: emailIngresado, password: passIngresada })
    });

    const data = await respuesta.json();

    if (respuesta.ok) {
      // ¡ENCONTRADO Y VALIDADO! 
      // 3. PERSISTENCIA: Guardamos los datos recibidos (incluido el status) en localStorage
      localStorage.setItem('usuarioActivo', JSON.stringify(data));

      alert(`¡Hola de nuevo, ${data.nombre}!`);
      window.location.href = 'perfil.html'; // Nos vamos al perfil
    } else {
      // No coinciden los datos o hubo un error del servidor
      alert(`Ops... ${data.error || 'El correo o la contraseña no coinciden. Revisa de nuevo.'}`);
    }
  } catch (error) {
    console.error('Error al intentar iniciar sesión:', error);
    alert('Hubo un problema de conexión con el servidor. Inténtalo más tarde.');
  }
});