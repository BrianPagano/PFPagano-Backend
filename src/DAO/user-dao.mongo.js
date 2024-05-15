const Users = require('./models/user.model')

class UserDao {
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
    
    
}


module.exports = UserDao