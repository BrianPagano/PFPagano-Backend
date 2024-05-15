const multer = require('multer')

// Función para definir la carpeta de destino según el tipo de archivo
const destination = function (req, file, cb) {
    let folder
// Leer el fileType del cuerpo de la solicitud
const fileType = req.body.fileType

// Verificar el tipo de archivo y asignar la carpeta correspondiente
switch (fileType) {
    case 'profileImage':
        folder = 'profiles'
        break
    case 'productImage':
        folder = 'products'
        break
    case 'documentFile':
        folder = 'documents'
        break
        default:
        return cb(new Error('Tipo de archivo no admitido.'))
}

    // Establecer la ubicación de la carpeta de destino
    cb(null, `src/public/img/${folder}`)
}

const storage = multer.diskStorage({
    destination: destination,
    filename: function (req, file, cb) {
        const originalName = file.originalname.replace(/\s/g, '')
        cb(null, Date.now() + '-' + originalName)
    },
})

const upload = multer({ storage: storage })

module.exports = upload
