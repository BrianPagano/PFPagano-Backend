const Users = require('./models/user.model')

class UserDao {
    async getUsers() {
        try {
            return await Users.find({})
        } catch (error) {
            throw new Error('Error al obtener los usuarios de la base de datos')
        }
    }

    async getUserById(uid) {
        try {
            return await Users.findOne({ _id: uid }).exec()
        } catch (error) {
            throw new Error('Error al obtener el usuario de la base de datos')
        }
    }
  
    async updateUserCart(uid, cid) {
        try {
            await Users.updateOne({ _id: uid }, { cart: cid }).exec()
        } catch (error) {
            throw new Error('Error al actualizar el carrito del usuario en la base de datos')
        }
    }
 
    async createUser(newUserDto){
        try {
            const createdUser = await Users.create(newUserDto)
            return createdUser
        } catch (error) {
            throw new Error('Error al crear un usuario')
        }
    }

    async toggleUserRole(uid) {
        try {
            const user = await Users.findById(uid)
            if (!user) {
                throw new Error('Usuario no encontrado')
            }
    
            // Cambiar el rol del usuario
            user.role = user.role === 'user' ? 'premium' : 'user'
            await user.save()
    
            return user
        } catch (error) {
            console.error (error)       
         }
    }

    async lastConnection(uid) {
        try {
            const user = await Users.findById(uid)
            if (!user) {
                throw new Error('Usuario no encontrado')
            }
            // creo la variable para setear el horario y poder cambiarlo a argentina
            const now = new Date()
            // Ajustar la fecha y hora a la zona horaria de Argentina
            now.setUTCHours(now.getUTCHours() - 3)
            // actualizar con los datos de ultima coneccion
            user.last_connection = now
            await user.save()
            return user
        } catch (error) {
            console.error (error)       
         }
    }

    async uploadImage(uid, file) {
        try {
             // Creo un objeto con las propiedades del documento
             const documentData = {
                name: file.filename, // Nombre del documento
                reference: file.path // ruta donde se guarda el documento
            }
            // Encontrar al usuario por su ID y actualiza el array de documents
            const user = await Users.findByIdAndUpdate(uid, {
                $push: { documents: documentData }
            }, { new: true })
            return user
        } catch (error) {
            console.error (error)       
         }
    }

    async uploadImages(uid, files) {
        try {
            //recorro el array files y creo un nuevo objeto con las 2 props
            const documentDataArray = files.map(file => ({
                name: file.filename,
                reference: file.path
            }))
    
            const user = await Users.findByIdAndUpdate(uid, {
                $push: { documents: { $each: documentDataArray } }
            }, { new: true })
    
            return user
        } catch (error) {
            console.error(error)
            throw error
        }
    }

    async deleteUsers(users) {
        try {
            const usersDelete = []
            let anyUserModified = false // Bandera para verificar si se modificó algún usuario
    
            // creo la variable para setear el horario y poder cambiarlo a argentina
            const now = new Date()
            // Ajustar la fecha y hora a la zona horaria de Argentina
            now.setUTCHours(now.getUTCHours() - 3)
            // Obtener la marca de tiempo actual en milisegundos
            const nowTimestamp = now.getTime()
            //creo varible de 30 min atras
            const thirtyMinutesAgo = nowTimestamp - (30 * 60 * 1000)
            // recorro los usuarios y reviso cual tuvo inactividad
            users.forEach(user => {
                if (user.role !== 'admin' && user.last_connection) { // Verificar que no sea el usuario admin
                    const lastConnectionTimestamp = user.last_connection.getTime()
                    if (lastConnectionTimestamp < thirtyMinutesAgo) {
                        usersDelete.push(user)
                    }
                }
            })
    
            // Itera sobre cada usuario y le cambio el estado a false
            for (const userDelete of usersDelete) {
                // Encuentra el usuario por su ID
                const uid = userDelete._id
                const foundUser = await Users.findById(uid)
    
                if (foundUser) {
                    // Actualiza el status para eliminar usuario
                    foundUser.status = false
    
                    // Guarda los cambios en la base de datos
                    await foundUser.save()
                    console.log(`Usuario ${foundUser.email} borrado correctamente`)
                    anyUserModified = true // Cambia la bandera indicando que al menos un usuario fue modificado
                }
            }
            if (anyUserModified) {
                return { success: true }
            } else {
                return { success: false, message: "No se realizaron modificaciones" }
            }
        } catch (error) {
            console.error('Error al eliminar los usuarios:', error)
            return { success: false, message: error.message }
        }
    }
    
}  



module.exports = UserDao