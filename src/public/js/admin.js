document.addEventListener('DOMContentLoaded', () => {
    const deleteButton = document.getElementById('deleteUsers')

    deleteButton.addEventListener('click', () => {
        fetch('api/users', {
            method: 'DELETE',
        })
            .then(response => response.json())
            .then(responseData => {
                console.log (responseData)
                if (responseData.status === 'success') { // Verifica si devuelve success desde el back
                    Swal.fire({
                        icon: "success",
                        title: "Usuarios eliminados correctamente",
                      })
                } else {
                    Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: "No hay usuarios inactivos",
                      })
                }
            })
            .catch(error => console.log(error))
    })
})
