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

const {
    createPost,
    updatePost,
    deletePost,
    getPost,
    getPosts,
    getUserPosts,
    getFollowingPost,
    likeDislikePost,
    bookmarkPost,
    getPostBookmarks
} = require('../controllers/postController')



router.post('/users/register', registerUser)
router.post('/users/login', loginUser)
router.get('/users/:id', getUser)
router.get('/users/', getUsers)
router.patch('/users/:id', authMiddleware, editUser)
router.get('/users/:id/follow',authMiddleware, followUnfollowUser)
router.post('/users/:id/avatar', authMiddleware, changeUserAvatar)


module.exports = router