const UserDao = require ('../DAO/user-dao.mongo')
const messageManager = require('../repositories')
const { createHash, useValidPassword } = require('../utils/cryp-password.util')
const transport = require('../utils/nodemailer.util')
const { userEmail } = require('../configs/app.config')
const { generateToken } = require('../utils/jwt.util')
const User = new UserDao()

async function getUsers(){
    try {
        const users = await User.getUsers()
        return users
    } catch (error) {
        console.error (error)
    }
}

async function getUserCart(uid) {
    try {
        const user = await User.getUserById(uid)
        return user ? user.cart : null
    } catch (error) {
        console.error (error)
    }
}

async function findByIdDocuments(uid) {
    try {
         const user = await User.findByIdDocuments(uid)
         return user
    } catch (error) {
        console.error (error)
    }
}

async function updateUserCart(uid, cid) {
    try {
        await User.updateUserCart(uid, cid)
    } catch (error) {
        console.error (error)
    }
}
async function createUser(newUserDto) {
    try {
        const createdUser = await User.createUser(newUserDto)
        //aca va el adapter
        messageManager.sendMessage(createdUser)
        return createdUser
    } catch (error) {
        console.error (error)
    }
}

async function toggleUserRole(uid) {
    try {
        await User.toggleUserRole(uid)
    } catch (error) {
        console.error (error)
    }
}

async function lastConnection(uid) {
    try {
        await User.lastConnection(uid)
    } catch (error) {
        console.error (error)
    }
}

async function uploadImage (uid, file) {
    try {
        const user = await User.uploadImage(uid, file)
        return user
    } catch (error) {
        console.error (error)
    }
}

async function uploadImages (uid, file) {
    try {
        const user = await User.uploadImages(uid, file)
        return user
    } catch (error) {
        console.error (error)
    }
}

async function deleteUsers (users) {
    try {
        const usersDelete = await User.deleteUsers(users)
        return usersDelete
    } catch (error) {
        console.error (error)
    }
}

async function updatePassword(email, newPassword) {
    try {
        const user = await User.findByEmail(email)
        if (!user) {
            throw new Error('User not found')
        }

        if (useValidPassword(user, newPassword)) {
            throw new Error('Invalid password')
        }

        const passwordEncrypted = createHash(newPassword)
        await User.updatePassword(email, passwordEncrypted)
    } catch (error) {
        console.error(error)
    }
}

async function sendRecoveryEmail(email) {
    try {
        const userExist = await User.findByEmail(email)
      
        if (userExist) {
            const TokenInfoUser = {
                email: userExist.email,
            }

            const token =  generateToken(TokenInfoUser)

            const recoveryLink = `http://localhost:8080/forgotPassword?token=${token}`

            transport.sendMail({
                from: userEmail,
                to: userExist.email,
                subject: 'Restablece tu Contraseña en VinoMania',
                html: `
                    <h1>Hola ${userExist.first_name}</h1>
                    <p style="margin-bottom: 20px;">Has solicitado restablecer tu contraseña en Vinomania.</p>
                    <p>Por favor, presiona sobre el siguiente botón para cambiar tu contraseña. Este enlace solo será válido durante 1 hora.</p>
                    <a id="recoveryLink" href="${recoveryLink}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 20px; display: inline-block;">Restablecer Contraseña</a>                
                `,
            });

            // Si el usuario existe, significa que el correo electrónico está registrado
            return { status: 'Success', message: 'El correo se encuentra registrado' }
        } else {
            // Si el usuario no existe, significa que el correo electrónico no está registrado
            return { status: 'Error', message: 'El correo no está registrado' }
        }
    } catch (error) {
        console.error(error)
        throw new Error('Error sending recovery email')
    }
}




module.exports = {
    getUsers,
    getUserCart,
    findByIdDocuments,
    updateUserCart,
    createUser,
    toggleUserRole,
    lastConnection,
    uploadImage,
    uploadImages,
    deleteUsers,
    updatePassword,
    sendRecoveryEmail,
}
