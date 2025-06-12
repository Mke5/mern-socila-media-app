const HttpError = require('../middlewares/errorMiddleware')
const PostModel = require('../models/postModel')
const UserModel = require('../models/userModel')
const {v4, uuid} = require('uuid')
const fs = require('fs')
const path = require('path')




// create post API
// POST /api/posts
// protected
const createPost = async (req, res, next) => {
    try {
        const { body} = req.body;
        const {images} = req.files?.images || []

        if (!body || body.trim().length < 1) {
            return next(new HttpError('Post body is required', 400));
        }
        const imageArray = [];
        images.map((image) => {
            if(!image.mimetype.startsWith('image/')){
                return next(new HttpError('Invalid image format', 400))
            }
            if(image.size > 1024 * 1024 * 5){
                return next(new HttpError('Image size should be less than 5MB', 400))
            }
            const imageName = `${uuid()}-${image.name}`
            const imagePath = path.join(__dirname, '../uploads', imageName)
            image.mv(imagePath, (err) => {
                if(err){
                    return next(new HttpError('Failed to upload image', 500))
                }else{
                    imageArray.push(imageName);
                }
            })
        })

        const newPost = new Post({
            creator: req.user.id,
            body: body.trim(),
            images: imageArray
        });

        const savedPost = await newPost.save();

        return res.status(201).json({
            status: 'success',
            data: savedPost
        });
    } catch (err) {
        return next(new HttpError('Failed to create post', 500));
    }
}







// create post API
// GET /api/posts/:id
// protected
const getPost = async (req, res, next) => {
    try{
        res.json('get post')
    }catch(error){
        return next(new HttpError(error.message, error.statusCode))
    }
}







// get post API
// GET /api/posts
// protected
const getPosts = async (req, res, next) => {
    try{
        res.json('get posts')
    }catch(error){
        return next(new HttpError(error.message, error.statusCode))
    }
}





// update post API
// PACTH /api/posts/:id
// protected
const updatePost = async (req, res, next) => {
    try{
        res.json('update POst')
    }catch(error){
        return next(new HttpError(error.message, error.statusCode))
    }
}








// delete post API
// DELETE /api/posts/:id
// protected
const deletePost = async (req, res, next) => {
    try{
        res.json('delete POst')
    }catch(error){
        return next(new HttpError(error.message, error.statusCode))
    }
}





// get following posts API
// GET /api/posts/following
// protected
const getFollowingPost = async (req, res, next) => {
    try{
        res.json('get Following POst')
    }catch(error){
        return next(new HttpError(error.message, error.statusCode))
    }
}



// like/dislike post API
// POST /api/posts/:id/like
// protected
const likeDislikePost = async (req, res, next) => {
    try{
        res.json('likeDislike POst')
    }catch(error){
        return next(new HttpError(error.message, error.statusCode))
    }
}








// get user post API
// GET /api/user/:id/posts
// protected
const getUserPosts = async (req, res, next) => {
    try{
        res.json('get user POst')
    }catch(error){
        return next(new HttpError(error.message, error.statusCode))
    }
}







// bookmark post API
// POST /api/posts/:id/bookmark
// protected
const bookmarkPost = async (req, res, next) => {
    try{
        res.json('bookmark POst')
    }catch(error){
        return next(new HttpError(error.message, error.statusCode))
    }
}










// get bookmarks post API
// GET /api/posts/bookmarks
// protected
const getPostBookmarks = async (req, res, next) => {
    try{
        res.json('get bookmarks POst')
    }catch(error){
        return next(new HttpError(error.message, error.statusCode))
    }
}















module.exports = {
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
}