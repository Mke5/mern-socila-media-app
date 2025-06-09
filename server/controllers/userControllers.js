const HttpError = require('../models/errorModel')




// register user
// POST : /api/users/register
// unprotected route
const registerUser = async (req, res, next) => {
    try {
        res.json('Register User')
    } catch (error) {
        return next(new HttpError(error.message, error.statusCode))
    }
}




// login user
// POST : /api/users/login
// unprotected route
const loginUser = async (req, res, next) => {
    try {
        res.json('Login User')
    } catch (error) {
        return next(new HttpError(error.message, error.statusCode))
    }
}




// get user
// POST : /api/users/:id
// unprotected route
const getUser = async (req, res, next) => {
    try {
        res.json('get User Profile User')
    } catch (error) {
        return next(new HttpError(error.message, error.statusCode))
    }
}




// edit user
// POST : /api/users/edit
// unprotected route
const editUser = async (req, res, next) => {
    try {
        res.json('edit User')
    } catch (error) {
        return next(new HttpError(error.message, error.statusCode))
    }
}






// follow/unfollow user
// PATCH : /api/users/:id/follow
// unprotected route
const followUnfollowUser = async (req, res, next) => {
    try {
        res.json('follow User')
    } catch (error) {
        return next(new HttpError(error.message, error.statusCode))
    }
}




// change user picture
// PACTH : /api/users/avatar
// unprotected route
const changeUserAvatar = async (req, res, next) => {
    try {
        res.json('change profile picture User')
    } catch (error) {
        return next(new HttpError(error.message, error.statusCode))
    }
}





module.exports = {
    registerUser,
    changeUserAvatar,
    loginUser,
    getUser,
    editUser,
    followUnfollowUser,
}