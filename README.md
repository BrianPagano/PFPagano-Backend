# VinoMania Ecommerce

## Descripción del Proyecto

VinoMania es una plataforma de comercio electrónico especializada en la venta de accesorios para vinos. El proyecto está desarrollado utilizando Node.js con Express para el backend y MongoDB como base de datos.

## Características

- Gestión de productos y carritos de compras.
- Sistema de autenticación de usuarios.
- Chat en tiempo real para interaccion de usuarios
- Rutas y controladores modulares para fácil mantenimiento y escalabilidad.
-  **Arquitectura en capas**: Modelo, DAO (Data Access Object), Servicios y Controladores, siguiendo el patrón **MVC (Model-View-Controller)**.
- Pruebas automáticas con **Supertest** para asegurar la calidad del código y la fiabilidad del sistema.

## Tecnologías Utilizadas

- **Backend:**
  - Node.js
  - Express
  - Express-Session
  - Socket.io
      
- **Base de Datos:**
  - MongoDB
  - Mongoose
  - Mongoose-Paginate-V2
    
- **Autenticación:**
  - Passport.js
  - Passport-Github2
  - Passport-JWT
  - Passport-Local
  - JSON Web Tokens (JWT)
  - Bcrypt
     
- **Frontend:**
  - Handlebars
    
- **Estilos y UI:**
  - Bootstrap
    
- **Utilidades:**
  - Dotenv
  - Morgan
  - Multer
  - Nodemailer
  - UUID
  - Winston
    
- **Documentación API:**
  - Swagger-jsdoc
  - Swagger-UI-Express
    
- **Pruebas:**
  - Mocha
  - Chai
  - Supertest
  - @faker-js/faker


## Instalación y Ejecución

### Prerrequisitos

- Node.js (versión recomendada: 14.x o superior)
- MongoDB (local o en la nube)

### Instrucciones

1. Clonar el repositorio:

   ```bash
   git clone https://github.com/BrianPagano/PFPagano-Backend
   cd PFPagano-Backend

2. Instalar las dependencias:

   ```bash
   npm install

3. Configurar las variables de entorno:
      Ver archivo .env.example
   
4. Ejecutar la aplicación en modo desarrollador:

   ```bash
   npm run start:dev

5. Ejecutar la aplicación en modo produccion:

   ```bash
   npm run start:prod
   
6. Ejecutar pruebas:

   ```bash
   npm test

## Rutas

### Productos

- **GET /api/products**: Obtener todos los productos.
- **POST /api/products**: Crear un nuevo producto (solo disponible para usuario admin o premium)
- **GET /api/products/:id**: Obtener un producto específico por su ID.
- **PUT /api/products/:id**: Actualizar un producto específico por su ID (solo disponible para admin)
- **DELETE /api/products/:id**: Eliminar un producto específico por su ID (solo disponible para usuario admin o premium)

### Carritos de Compras

- **GET /api/carts/:cid**: Obtener un carrito de compras por su ID para poder mostrarlo al usuario.
- **GET /api/carts/:cid/purchase**: Obtener la orden de compra creada para un carrito específico.
- **POST /api/carts**: Crear un nuevo carrito de compras.
- **POST /api/carts/:cid/products/:pid**: Agregar un producto a un carrito especificando el ID del carrito y el ID del producto. (solo disponible para usuario user o premium)
- **POST /api/carts/:cid/purchase**: Crear una orden de compra para un carrito específico.
- **PUT /api/carts/:cid/products/:pid**: Actualizar la cantidad de un producto en un carrito específico. (solo disponible para usuario user o premium)
- **DELETE /api/carts/:cid/products/:pid**: Eliminar un producto de un carrito específico. (solo disponible para usuario user o premium)
- **DELETE /api/carts/:cid**: Eliminar todos los productos de un carrito específico. (solo disponible para usuario user o premium)

### Chat

- **GET /chat**: Acceder al chat grupal en tiempo real.

### Autenticación

- **GET /api/auth**: Iniciar sesión de usuario.
- **GET /api/auth/current**: Obtener el usuario autenticado actualmente.
- **GET /api/auth/fail-login**: Ruta de manejo para fallas en el inicio de sesión.
- **GET /api/auth/logout**: Cerrar sesión de usuario.
- **POST /api/auth/forgotPassword**: Solicitar restablecimiento de contraseña.
- **POST /api/auth/recoveryKey**: Enviar clave de recuperación de contraseña.
- **GET /api/auth/github**: Autenticación con GitHub.
- **GET /api/auth/githubcallback**: Callback para autenticación exitosa con GitHub.

### Usuarios

- **GET /api/users**: Obtener todos los usuarios (solo disponible para admin).
- **GET /api/users/user-cart**: Obtener el carrito actual del usuario.
- **GET /api/users/documents**: Mostrar la página para cargar documentos (solo disponible para usuarios logueados)
- **GET /api/users/fail-Register**: Ruta para el manejo de errores durante el registro.
- **GET /api/users/gestionarUsers**: Ruta para el administrador para la gestion de usuarios.
- **POST /api/users**: Registrar un nuevo usuario.
- **POST /api/users/:uid/documents**: Subir un documento para un usuario específico.
- **POST /api/users/:uid/documents/multiple**: Subir múltiples documentos para un usuario específico.
- **PUT /api/users**: Actualizar el usuario con el carrito creado.
- **PUT /api/users/premium/:uid**: Cambiar el rol de usuario a premium o viceversa (solo disponible para admin).
- **DELETE /api/users**: Borrar todos los usuarios inactivos (solo disponible para admin).
- **DELETE /api/users/:uid**: Borrar un usuario especifico (solo disponible para admin).

### Vistas

- **GET /login**: Mostrar la página de inicio de sesión.
- **GET /admin**: Mostrar la página de administración (solo para admin).
- **GET /signup**: Mostrar la página de registro.
- **GET /profile**: Mostrar la página de perfil del usuario.
- **GET /recoveryKey**: Mostrar la página para recuperar clave.
- **GET /forgotPassword**: Mostrar la página de restablecimiento de contraseña (debe tener un token valido enviado por email)
- **GET /loggerTest**: Probar logger utilizando dev o prod.
- **GET /addProduct**: Mostrar la página para agregar productos (solo para admin y premium).
- **GET /deleteProduct**: Mostrar la página para eliminar productos (solo para admin y premium).




