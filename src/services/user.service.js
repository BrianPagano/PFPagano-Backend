const UserDao = require ('../DAO/user-dao.mongo')
const messageManager = require('../repositories')
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


module.exports = {
    getUsers,
    getUserCart,
    updateUserCart,
    createUser,
    toggleUserRole,
    lastConnection,
    uploadImage,
    uploadImages,
    deleteUsers,
}
