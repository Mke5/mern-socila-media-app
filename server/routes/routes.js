const router = require('express').Router()
const authMiddleware = require('../middlewares/authMiddleware')
const {
    registerUser,
    changeUserAvatar,
    loginUser,
    getUser,
    getUsers,
    editUser,
    followUnfollowUser,
} = require('../controllers/userControllers')



router.post('/users/register', registerUser)
router.post('/users/login', loginUser)
router.get('/users/:id', getUser)
router.get('/users/', getUsers)
router.patch('/users/:id', authMiddleware, editUser)
router.get('/users/:id/follow', followUnfollowUser)
router.post('/users/:id/avatar', authMiddleware, changeUserAvatar)


module.exports = router