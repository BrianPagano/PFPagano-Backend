const { Router } = require('express')
const router = Router()
const passport = require ('passport')
const UserService = require ('../services/user.service')
const CustomError = require('../handlers/errors/Custom-Error')
const TYPES_ERROR = require('../handlers/errors/types.errors')
const EErrors = require('../handlers/errors/enum-errors')
const authMiddleware = require('../middlewares/private-acces-middleware')
const upload  = require('../middlewares/multer')
const SensibleDTO = require ('../DTO/sensible-user')
const authorization = require('../middlewares/authorization-middleware')

router.get('/', authorization(['admin']), async (req,res,next) => {
    try {
        const users = await UserService.getUsers()
        const userDTO = new SensibleDTO(users)
        res.json({ userDTO })
    } catch (error) {
        // Pasar el error al middleware para su manejo
        next(error)
    }
})

router.get ('/user-cart', async (req, res, next) => {
    try {
        // Recuperar el valor cid de la sesión del usuario
        const cid = req.session.cart
        if (!cid) {
            // Verificar si existe un usuario autenticado en la sesión
            if (!req.user) {
                throw new CustomError({
                    name: TYPES_ERROR.NOT_AUTHORIZED,
                    cause: 'No estás autenticado',
                    message: 'No estás autenticado',
                    code: EErrors.NOT_AUTHORIZED,
                })
            }
            const uid = req.user._id
            const userCart = await UserService.getUserCart(uid)
            if (!userCart) {
                CustomError.createError({
                    name: TYPES_ERROR.USER_NOT_EXIST,
                    cause: 'No se encontro el usuario en la base de datos',
                    message: 'El usuario no existe',
                    code: EErrors.NOT_FOUND,
                })
                return
            }
            res.status(200).json({status: 'success', cid: userCart})
        }
    }  catch (error) {
        // Pasar el error al middleware para su manejo
        next(error)
    }
})

router.get ('/documents', authMiddleware , async (req, res) => {
    try {
        const user = req.user
        res.render ('documents', { 
            user,
            style: 'style.css',})
     } catch (error) {
        req.logger.error (error)
        res.status(500).json({ error: 'Internal Server Error' })
    }
})

router.get ('/fail-Register', (req, res) => {
    req.logger.info ('fallo el registro de usuario')
    res.status(400).json({status: 'error',  error: 'bad Request' })
})

router.get ('/gestionarUsers', authorization(['admin']) , async (req, res) => {
    try {
        const user = req.user
        const users = await UserService.getUsers()
        res.render ('gestionarUsers', { 
            user,
            users,
            style: 'style.css',})
     } catch (error) {
        req.logger.error (error)
        res.status(500).json({ error: 'Internal Server Error' })
    }
})

router.post ('/', passport.authenticate('register', {failureRedirect: '/api/users/fail-Register'}),  async (req, res) => {
    try {
        res.status(201).json ({status: 'success', message: 'Usuario' })
     } catch (error) {
        req.logger.error ('Error en la authenticacion de usuario:', error)
        res.status(500).json({ error: 'Internal Server Error' })
    }
})

router.post("/:uid/documents", upload.single("myFile"), async (req, res) => {
  try {
    const file = req.file
    const { uid } = req.params
    if (!file) {
      res.status(500).json("Error al subir el documento")
    } else {
      const result = await UserService.uploadImage(uid, file)
      if (result) res.status(200).json("Documento Cargado con Exito")
        else {
            res.status(500).json("Error al procesar la carga del documento.")
          }
    }
  } catch (error) {
    req.logger.error("Error al subir el documento:", error)
    res.status(500).json({ error: "Internal Server Error" })
  }
})

router.post('/:uid/documents/multiple', upload.array('myFiles'), async (req, res) => {
    try {
        const files = req.files
        const { uid } = req.params
        if (!files) {
          res.status(500).json("Error al subir los documentos")
        } else {
          const result = await UserService.uploadImages(uid, files)
          if (result) res.status(200).json("Documentos Cargados con Exito")
            else {
                res.status(500).json("Error al procesar la carga del documento.")
              }
        }
    } catch (error) {
        req.logger.error("Error al subir los documentos:", error)
        res.status(500).json({ error: "Internal Server Error" })
    }
})


//actualizar el user con el carrito creado
router.put('/', async (req, res) => {
    try {
        const uid = req.user._id
        const { cart: cid } = req.body
        // Actualiza el carrito del usuario en la base de datos
        await UserService.updateUserCart(uid, cid)
        // Enviar una respuesta al cliente
        res.status(200).json({ status: 'success', message: 'User cart updated successfully' })
    } catch (error) {
        req.logger.error ('Error al actualizar el carrito del usuario:', error)
        res.status(500).json({ error: 'Internal Server Error' })
    }
})

// Ruta para cambiar el rol de usuario a premium o viceversa
router.put('/premium/:uid', authorization(['admin']) , async (req, res) => {
    try {
        const { uid } = req.params
        const requiredDocuments = ['Identificacion', 'Comprobantededomicilio', 'Comprobantedeestadodecuenta']
        // nos traemos los documentos cargados en el usuario y los formateamos
        const user = await UserService.findByIdDocuments(uid)
        const userDocuments = user.documents.map(doc => {
            // Utilizamos una expresión regular para eliminar el timestamp y la extensión del nombre del documento
            const fileNameWithoutExtension = doc.name.replace(/\d+-/, '').replace(/\..+$/, '')
            return fileNameWithoutExtension
        })
        //verifico que documentos hay cargados
        const documentsUploaded = requiredDocuments.every(doc => userDocuments.includes(doc))
        if (user.role === 'premium') {
            await UserService.toggleUserRole(uid)
            res.status(200).json({ status: 'success', message: 'El usuario vuelve a ser role User'})
        } else if (documentsUploaded) {
            // Cambiar el rol del usuario a premium
            await UserService.toggleUserRole(uid)
            res.status(200).json({ status: 'success', message: 'Usuario convertido en Premium' })
        } else {
            res.status(400).json({ error: 'El usuario no ha terminado de procesar su documentación.' })
        }
    } catch (error) {
        req.logger.error ('Error al cambiar el role del usuario:', error)
        res.status(500).json({ error: 'Internal Server Error' })
    }
})

// Ruta para cambiar el rol de usuario a premium o viceversa
router.delete('/:uid', authorization(['admin']) , async (req, res) => {
    try {
        const { uid } = req.params
        const result = await UserService.deleteUser(uid)
        if (result.status === 'success') {
                res.status(200).json({ status: 'success', message: 'Usuario eliminado correctamente' })
            }
            else {
                res.status(400).json({ status: 'Error', message: 'error al eliminar el usuario' })
            }
    } catch (error) {
        req.logger.error ('Error al eliminar usuario:', error)
        res.status(500).json({ error: 'Internal Server Error'})
    }
})

//borra todos los usuarios con ultima conexion mayor a 2 dias.
router.delete('/', authorization(['admin']) , async (req, res) => {
    try {
    const users = await UserService.getUsers()
    // Limpiar a todos los usuarios que no hayan tenido conexión en los últimos 2 días
    const result = await UserService.deleteUsers(users)
    if (result.status === 'success') {
        res.status(200).json({ status: 'success', message: 'Usuarios inactivos eliminados correctamente' })
        }
        else {
            res.status(400).json({ status: 'Error', message: 'No hay usuarios inactivos' })
        }
    } catch (error) {
        req.logger.error ('Error al borrar usuarios:', error)
        res.status(500).json({ error: 'Internal Server Error' })
    }
})


module.exports = router