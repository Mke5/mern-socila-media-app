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
    logoutUser
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

const {
    getMessage,
    getConversation,
    createMessage
} = require('../controllers/messageController')

// user routes
router.post('/users/register', registerUser)
router.post('/users/logout', logoutUser)
router.post('/users/login', loginUser)
router.get('/users/bookmarks', authMiddleware, getPostBookmarks)
router.get('/users/:id', authMiddleware, getUser)
router.get('/users/', authMiddleware, getUsers)
router.patch('/users/:id', authMiddleware, editUser)
router.get('/users/:id/follow',authMiddleware, followUnfollowUser)
router.post('/users/:id/avatar', authMiddleware, changeUserAvatar)
router.get('/users/:id/posts', authMiddleware, getUserPosts)





// post routes
router.get('/posts', authMiddleware, getPosts)
router.post('/posts', authMiddleware, createPost)
router.get('/posts/following', authMiddleware, getFollowingPost)
router.get('/posts/:id', authMiddleware, getPost)
router.patch('/posts/:id', authMiddleware, updatePost)
router.delete('/posts/:id', authMiddleware, deletePost)
router.get('/posts/:id/like', authMiddleware, likeDislikePost)
router.get('/posts/:id/bookmark', authMiddleware, bookmarkPost)




// comments routes
router.post('/comments/:id', authMiddleware, createComment)
router.get('/comments/:postId', authMiddleware, getPostComment)
router.delete('/comments/:commentId', authMiddleware, deleteComment)




// message routes
router.post('/messages/:recieverId', authMiddleware, createMessage)
router.get('/messages/:recieverId', authMiddleware, getMessage)
router.get('/conversations', authMiddleware, getConversation)


module.exports = router