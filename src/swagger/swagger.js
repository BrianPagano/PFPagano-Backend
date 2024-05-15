const swaggerJsDoc = require ('swagger-jsdoc')
const swaggerUi = require ('swagger-ui-express')

const swaggerOptions = {
    definition: {
        openapi: '3.1.0',
        info: {
            title: 'Documentacion de la API REST',
            description: 'Documentacion de la API REST de VinoMania'
        }
    },
    apis: [`src/docs/**/*.yaml`]
}

const specs = swaggerJsDoc (swaggerOptions)

const swaggerDocs = (app) => {
    app.use ('/docs', swaggerUi.serve, swaggerUi.setup(specs))
}


module.exports = {swaggerDocs}