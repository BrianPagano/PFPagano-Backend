document.querySelectorAll('.iconoUser').forEach(function(button) {
    button.addEventListener('click', function() {
    const uid = this.dataset.uid
    // Realiza una solicitud PUT utilizando fetch y envía los datos en formato JSON
    fetch(`/api/users/premium/${uid}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then(response => {
        if (response.ok) {
            // Si la respuesta es exitosa, devuelve el cuerpo de la respuesta en formato JSON
            return response.json()
        } else {
            // Si la respuesta no es exitosa, lanza un error con el mensaje de error correspondiente
            throw new Error('Error al realizar la solicitud: ' + response.statusText)
        }
    })
    .then(responseData => {
        // Maneja la respuesta del servidor
        if (responseData.status === 'success') {
            // Muestra un mensaje de éxito
            Swal.fire({
                icon: 'success',
                title: 'Éxito',
                text: responseData.message,
            })
        } 
    })
    .catch(error => {
        console.error(error)
        if (error.message.includes('Bad Request')) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'El usuario no ha terminado de procesar su documentación',
            })
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Error al realizar la solicitud.',
            })
        }
    })

    })
})

document.querySelectorAll('.iconoBasuraUser').forEach(function(button) {
    button.addEventListener('click', function() {
        const uid = this.dataset.uid

        // Realizar una solicitud Fetch para cancelar la compra
        fetch(`/api/users/${uid}`, {
            method: 'DELETE',
        })
        .then(response => response.json())
        .then(responseData => {
            if (responseData.status === 'success') { // Verifica si devuelve success desde el back
                Swal.fire({
                    icon: "success",
                    title: "Usuario eliminados correctamente",
                  })
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: responseData.message,
                  })
            }
        })
        .catch(error => console.log(error))
})
})

