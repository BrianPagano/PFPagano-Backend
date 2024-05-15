const authorization = roles => {
    return (req,res,next) => {
        if (!req.user)
            return res.status(401).json ({status:'error', error: 'Unauthorized'})

        if (!roles.includes(req.user.role))
            return res.status(401).json ({status:'error', error: 'forbiden'})
        next()
    }
}

module.exports = authorization