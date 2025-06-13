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
} = require('../controllers/postControllers')

const {
    createComment,
    getPostComment,
    deleteComment
} = require('../controllers/commentController')

// user routes
router.post('/users/register', registerUser)
router.post('/users/login', loginUser)
router.get('/users/bookmarks', authMiddleware, getPostBookmarks)
router.get('/users/:id', authMiddleware, getUser)
router.get('/users/', authMiddleware, getUsers)
router.patch('/users/:id', authMiddleware, editUser)
router.get('/users/:id/follow',authMiddleware, followUnfollowUser)
router.post('/users/:id/avatar', authMiddleware, changeUserAvatar)
router.get('/users/:id/posts', authMiddleware, getUserPosts)





// post routes
router.get('/posts', getPosts)
router.post('/posts', createPost)
router.get('/posts/following', getFollowingPost)
router.get('/posts/:id', getPost)
router.patch('/posts/:id', updatePost)
router.delete('/posts/:id', deletePost)
router.get('/posts/:id/like', likeDislikePost)
router.get('/posts/:id/bookmark', bookmarkPost)




// comments routes
router.post('/comments/:id', authMiddleware, createComment)
router.get('/comments/:postId', authMiddleware, getPostComment)
router.delete('/comments/:commentId', authMiddleware, deleteComment)

module.exports = router



// app.post('/logout', (req, res) => {
//     res.clearCookie('token');
//     return res.status(200).json({ message: 'Logged out successfully' });
// });