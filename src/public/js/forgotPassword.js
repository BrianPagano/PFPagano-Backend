function submitForm() {
    // Obtener el token de la URL
    const urlParams = new URLSearchParams(window.location.search)
    const token = urlParams.get('token')

    // Recopilar los datos del formulario en un objeto
    const formData = {
        password: document.getElementById('password').value,
        token: token // Agregar el token al objeto formData
    }

    // Realiza una solicitud POST utilizando fetch y envía los datos en formato JSON
    fetch('/api/auth/forgotPassword', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
    })
    .then(response => response.json())
    .then(responseData => {
        if (responseData.status === 'Success') { // Verifica si devuelve success
            window.location.href = '/login' // Redirecciona solo si fue exitoso el reset
        } else {
            console.log("Error al restaurar la clave, no puede ser la misma que antes")
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "La contraseña no puede ser la misma que antes",
              })
        }
    })
    .catch(error => console.error('Error:', error))
}

//capturo el span de registrate para cuando hago un click redireccionarlo
const registrate = document.getElementById('Registrate')

//agrego funcion de escucha para cuando hagan click, redireccionar:
registrate.addEventListener('click', () => {
    window.location.href = '/signup'
})
