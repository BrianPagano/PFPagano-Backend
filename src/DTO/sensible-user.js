class UserDTO {
    constructor(users) {
        if (Array.isArray(users)) {
            this.users = users.map(user => this.formatUser(user))
        } else {
            this.users = [this.formatUser(users)]
        }
    }

    formatUser(user) {
        return {
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            role: user.role
        }
    }
}

module.exports = UserDTO