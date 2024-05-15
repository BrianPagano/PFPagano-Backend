const chai = require('chai')
const supertest = require('supertest')

const expect = chai.expect
const requester = supertest('http://localhost:8080')

let cookies //genero la variable cookies para almacenar las credenciales del usuario admin y usarlas en todo el test

describe("testing VinoMania", () => {
    describe("Test de autenticación de usuario", () => {
        it("El endpoint POST /api/auth debe autenticar al usuario correctamente", async () => {
            const userCredentials = {
                email: "ADMIN",
                password: "ADMIN"
            }

            const authResponse = await requester
                .post("/api/auth")
                .send(userCredentials)

            // Almacenar las cookies de sesión
            cookies = authResponse.headers['set-cookie']

            console.log("Autenticación:", authResponse.statusCode, authResponse.ok, authResponse.body)
            expect(authResponse.statusCode).to.equal(200)
        })
    })

    describe("Test para obtencion de datos de usuario no sensibles", () => {
        it("El endpoint GET /api/auth/current debe traer los datos del usuario logueado que no sean sensibles", async () => {

            const currentResponse = await requester
                .get("/api/auth/current")
                .set('Cookie', cookies)
          

            console.log("Autenticación:", currentResponse.statusCode, currentResponse.ok, currentResponse.body)
            expect(currentResponse.body.message).to.have.property('first_name') // Verificar que la respuesta tenga la propiedad 'first_name'
            expect(currentResponse.body.message).to.have.property('last_name') // Verificar que la respuesta tenga la propiedad 'last_name'
            expect(currentResponse.body.message).to.not.have.property('password') // no debe contener informacion sensible
        })
    })

    
    describe("Test para logout", () => {
        it("El endpoint POST /api/auth/logout debería cerrar la sesión del usuario correctamente", async () => {
            // Simula una solicitud de cierre de sesión
            const logoutResponse = await requester.get("/api/auth/logout")

            console.log("Cierre de sesion de usuario:", logoutResponse.statusCode, logoutResponse.ok, logoutResponse.body)
          

            // Verifica que la respuesta tenga el estado 200
            expect(logoutResponse.status).to.equal(200)

            // Verifica que el mensaje de respuesta sea correcto
            expect(logoutResponse.body).to.deep.equal({ message: 'Logout successful' })
        })
    })

    describe("Test de creación de producto", () => {
        it("El endpoint POST /api/products debe crear un producto correctamente solo si el usuario es admin", async () => {

            const productMock = {
                title: 'pruebaTest',
                description: 'Producto de prueba para los Test',
                price: 100,
                thumbnail: 'img prueba test',
                code: 'pruebaTest',
                stock: 100,
                status: true,
                category: 'pruebaTest',
            }

            const productResponse = await requester
                .post("/api/products")
                .set('Cookie', cookies)
                .send(productMock)

            console.log("Creación de producto:", productResponse.statusCode, productResponse.ok, productResponse.body)
            expect(productResponse.statusCode).to.equal(201)

        })
    })

    describe("Test de eliminacion del producto", () => {
        it("El endpoint DELETE /api/products debe eliminar un producto solo si el user es admin", async () => {

            // id del producto que quieres borrar 
            const productId = "65adcb70c08b1d900c52c9e8"

            const deleteResponse = await requester
                .delete(`/api/products/${productId}`)
                .set('Cookie', cookies)

            console.log("Eliminacion de un producto:", deleteResponse.statusCode, deleteResponse.ok, deleteResponse.body)
            expect(deleteResponse.body).to.have.property('status', 'Success')
            expect(deleteResponse.body).to.have.property('message', 'Producto borrado correctamente por admin')

        })
    })

    describe("Test de obtención de productos", () => {
        it("El endpoint GET /api/products debe devolver los productos", async () => {
          
            const productsResponse = await requester.get("/api/products")
    
            console.log("Respuesta de productos:", productsResponse.statusCode, productsResponse.ok, productsResponse.body)
            
            // Verificar el código de estado
            expect(productsResponse.status).to.equal(200)

             // Verificar que la respuesta contenga elementos de productos con la clase "card"
             expect(productsResponse.text).to.include('<div class="card"')
    
        })
    })

    describe("Test de creación de carrito", () => {
        it("debería crear un carrito correctamente", async () => {
            const CartResponse = await requester.post("/api/carts")
            console.log("Creación del carrito:", CartResponse.statusCode, CartResponse.ok, CartResponse.body)

            expect(CartResponse.status).to.equal(201)
            expect(CartResponse.body).to.have.property("message", "Carrito creado correctamente")
            expect(CartResponse.body).to.have.property("cid").that.is.a("string") // Verifica si cid es un string
        })
    })

   
    describe("Test para obtener el carrito por CID", () => {
        it("Debería mostrar el carrito correctamente enviando el CID", async () => {
            // Suponiendo que cid es un ID válido de carrito en tu base de datos
            const cid = "65f635ab5d076cd76c30403d"

            // Simula una solicitud para mostrar el carrito
            const cidResponse = await requester.get(`/api/carts/${cid}`)
            console.log("Test obtener carrito:", cidResponse.statusCode, cidResponse.ok)
            // Verifica que la respuesta sea un renderizado del template "cart"
            expect(cidResponse.ok).to.be.true
            expect(cidResponse.text).to.include('<div class="carritoFinal">')
        })
    })

    describe("Test de DELETE de productos en carrito", () => {
        it("NO deberia dejar eliminar productos si no estas logueado como admin o premium", async () => {
            // Suponiendo que cid es un ID válido de carrito en tu base de datos
            const cid = "65f635ab5d076cd76c30403d"

            const deleteCartResponse = await requester
            .delete(`/api/carts/${cid}`)

            console.log("Test obtener carrito:", deleteCartResponse.statusCode, deleteCartResponse.ok, deleteCartResponse.body)
          
            expect(deleteCartResponse.ok).to.be.false
            expect(deleteCartResponse.body).to.have.property("error", "Unauthorized")
        })
    })

})
