
//login .html manejo de formulario  

//necesito acceso al formulario, al input de email y al input de contraseña

const form = document.getElementById('formulario-login');

//funcion para que no se reinicie la pagina al enviar el formulario 

form.addEventListener('submit', (event) => {
    event.preventDefault(); 
    const correo = form.elements['correos'].value;
    console.log(correo);
    
})