const UserDao = require ('../DAO/user-dao.mongo')
const messageManager = require('../repositories')
const User = new UserDao()



async function getUserCart(uid) {
    try {
        const user = await User.getUserById(uid)
        return user ? user.cart : null
    } catch (error) {
        console.log (error)
    }
}

async function updateUserCart(uid, cid) {
    try {
        await User.updateUserCart(uid, cid)
    } catch (error) {
        console.log (error)
    }
}
async function createUser(newUserDto) {
    try {
        const createdUser = await User.createUser(newUserDto)
        //aca va el adapter
        messageManager.sendMessage(createdUser)
        return createdUser
    } catch (error) {
        console.log (error)
    }
}

async function toggleUserRole(uid) {
    try {
        await User.toggleUserRole(uid)
    } catch (error) {
        console.log (error)
    }
}

async function lastConnection(uid) {
    try {
        await User.lastConnection(uid)
    } catch (error) {
        console.log (error)
    }
}

async function uploadImage (uid, file) {
    try {
        const user = await User.uploadImage(uid, file)
        return user
    } catch (error) {
        console.log (error)
    }
}

async function uploadImages (uid, file) {
    try {
        const user = await User.uploadImages(uid, file)
        return user
    } catch (error) {
        console.log (error)
    }
}

module.exports = {
    getUserCart,
    updateUserCart,
    createUser,
    toggleUserRole,
    lastConnection,
    uploadImage,
    uploadImages,
}
