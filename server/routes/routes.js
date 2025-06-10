const router = require('express').Router()
const {
    registerUser,
    changeUserAvatar,
    loginUser,
    getUser,
    editUser,
    followUnfollowUser,
} = require('../controllers/userControllers')



router.post('/users/register', registerUser)
router.post('/users/login', loginUser)
router.get('/users/:id', getUser)
router.patch('/users/:id', editUser)
router.get('/users/:id/follow', followUnfollowUser)
router.post('/users/:id/avatar', changeUserAvatar)


module.exports = router