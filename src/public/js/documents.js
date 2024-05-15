function submitForm() {
    // recupero el uid
    const uid = this.dataset.uid
    console.log ( uid )
    // Realiza una solicitud POST utilizando fetch y envía los datos en formato JSON
    fetch(`/api/users/${uid}/documents`, {
        method: 'POST',
    })
    .then(response => {
        if (response.ok) { // Verifica si la respuesta indica una solicitud exitosa
            return response.json()
        } else {
            throw new Error('Unauthorized') 
        }
    })
    .then(responseData => {
        // Maneja la respuesta del servidor
        if (responseData.status === 'success') { // Verifica si el inicio de sesión fue exitoso
            window.location.href = '/api/products' // Redirecciona solo si el inicio de sesión fue exitoso
        } 
    })
    .catch(error => {
        console.error('Error:', error)
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Fallo la carga del archivo",
        })
    })
}

