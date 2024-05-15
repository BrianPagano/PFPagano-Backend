function submitForm() {
    // Recopila los datos del formulario en un objeto

    const id = document.getElementById('id').value

    // Realiza una solicitud POST utilizando fetch y envía los datos en formato JSON
    fetch(`/api/products/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then(response => response.json())
    .then(responseData => {
        if (responseData.status === 'Success') { // Verifica si devuelve success
            Swal.fire({
                icon: "success",
                title: "Producto Borrado Correctamente",
              })
        } else {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Error al borrar el producto",
              })
        }
    })
    .catch(error => console.error('Error:', error))
}

