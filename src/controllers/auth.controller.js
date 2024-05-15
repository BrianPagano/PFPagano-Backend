const { Router } = require('express')
const Users = require('../DAO/models/user.model')
const { createHash, useValidPassword } = require('../utils/cryp-password.util')
const passport = require('passport')
const router = Router()
const SensibleDTO = require ('../DTO/sensible-user')
const transport = require('../utils/nodemailer.util')
const { userEmail } = require('../configs/app.config')
const { generateToken } = require('../utils/jwt.util')
const jwt = require('jsonwebtoken')
const { jwtSecret } = require('../configs/app.config')


router.post ('/', passport.authenticate('login', {failureRedirect: '/auth/fail-login'}) , async (req, res, next) => {
    try {
        const {email} = req.body
        const lowercaseEmail = email.toLowerCase()

        req.session.user = {
            first_name: req.user.first_name,
            last_name: req.user.last_name,
            email: lowercaseEmail,
            age: req.user.age,
            role: req.user.role,
            cart: req.user.cart,
        }
        res.json({status: 'success', message: 'Login Succesfull'})
     } catch (error) {
        next(error)
    }
})

router.get('/current', (req, res) => {
    if (req.isAuthenticated()) {
        const userDTO = new SensibleDTO(req.user)
        res.json({ message: userDTO })
    } else {
        res.status(401).json({status: 'error', message: 'User is not authenticated' })
    }
})


router.get('/fail-login', (req, res) => {
    req.logger.info ('Fallo el logueo')
    res.status(400).json({status: 'error',  error: 'bad Request' })
})

router.get('/logout', async (req, res, next) => {
    try {
        req.session.destroy(err => {
            if (err) {
                return res.status(500).json({ error: 'Internal Server Error' })
            } else {
                return res.status(200).json({ message: 'Logout successful' })
            }
        })
    } catch (error) {
        next(error)
    }
})

router.post('/forgotPassword', async (req, res, next) => {
    try {
        const token = req.body.token; // Obtengo el token del cuerpo de la solicitud (lo mande por front)
        const decodedToken = jwt.verify(token, jwtSecret); // Decodificar el token
        const email = decodedToken.email; // Obtengo el correo electrónico del token decodificado

        const { password } = req.body;
        const passwordEncrypted = createHash(password);

        const user = await Users.findOne({ email }) //obtengo el objeto user de la base de datos con el email
        if (useValidPassword (user, password)) {
         return res.status(400).json({ error: 'Invalid password', message: 'New password must be different from the current password' });       
        }
        // Actualizar la contraseña del usuario
        await Users.updateOne({ email }, { password: passwordEncrypted });

        res.status(200).json({ status: 'Success', message: 'Password Updated' });
    } catch (error) {
        next(error)
    }
})

router.post('/recoveryKey', async (req, res, next) => {
    try {
        const {email} = req.body
        const userExist = await Users.findOne ({email})
      
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
            })
            // Si el usuario existe, significa que el correo electrónico está registrado
            res.status(200).json({ status: 'Success', message: 'El correo se encuentra registrado' })
        } else {
            // Si el usuario no existe, significa que el correo electrónico no está registrado
            res.status(404).json({ status: 'Error', message: 'El correo no está registrado' })
        }
    } catch (error) {
        next(error)
    }
})

router.get('/github', passport.authenticate('github', {scope: ['user: email']}, (req, res) => {}))

router.get('/githubcallback', passport.authenticate('github', {failureRedirect: '/login'}),
    (req, res) => {
    req.session.user = req.user
    res.redirect('/api/products')
    }
)

module.exports = router