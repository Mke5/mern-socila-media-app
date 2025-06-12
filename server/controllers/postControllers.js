const HttpError = require('../middlewares/errorMiddleware')
const PostModel = require('../models/postModel')
const UserModel = require('../models/userModel')
const {v4, uuid} = require('uuid')
const fs = require('fs')
const path = require('path')
const sanitizeHtml = require('sanitize-html');




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
        const cleanBody = sanitizeHtml(body.trim(), {
            allowedTags: [], // disallow all HTML tags
            allowedAttributes: {} // disallow all attributes
        });
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
        const newPost = await PostModel.create({
            creator: req.user.id,
            body: cleanBody,
            images: imageArray
        });

        await UserModel.findByIdAndUpdate(newPost?.creator, {
            $push: {posts: newPost?._id},
        })

        return res.status(201).json({
            status: 'success',
            data: newPost
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
        const {id} = req.params
        if(!id){
            return next(new HttpError('Post ID is required', 400))
        }
        const post = await PostModel.findById(id) .populate('creator', 'name username avatar') // populate post creator
        .populate({
            path: 'comments',
            options: { sort: { createdAt: -1 } },
            populate: {
                path: 'user',
                select: 'name username avatar'
            }
        })

        res.json(post).status(200)

    }catch(error){
        return next(new HttpError(error.message, error.statusCode))
    }
}







// get post API
// GET /api/posts
// protected
const getPosts = async (req, res, next) => {
    try{
        const posts = await PostModel.find().sort({
            createdAt: -1
        })

        res.json(posts).status(200)
    }catch(error){
        return next(new HttpError(error.message, error.statusCode))
    }
}





// update post API
// PACTH /api/posts/:id
// protected
const updatePost = async (req, res, next) => {
    try{
        const postId = req.params.id;
        const { body } = req.body;
        const images = req.files?.images;

        // Find the post
        const post = await PostModel.findById(postId);
        if (!post) {
            return next(new HttpError('Post not found', 404));
        }

        // Authorization check (optional)
        if (post?.creator.toString() !== req.user.id) {
            return next(new HttpError('Not authorized to update this post', 403));
        }
        
        // Sanitize and update body if provided
        if (body && body.trim().length > 0) {
            post.body = sanitizeHtml(body.trim(), {
                allowedTags: [],
                allowedAttributes: {}
            });
        }
        const uploadedImages = [];
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
                    uploadedImages.push(imageName);
                }
            })
        })

        // If new images were uploaded,
        if (uploadedImages.length > 0) {
            for (const img of post.images) {
                const oldImagePath = path.join(__dirname, '../uploads', img);
                fs.existsSync(oldImagePath) && fs.unlinkSync(oldImagePath);
            }
            post.images = uploadedImages;
        }

        const updatedPost = await post.save();
        res.status(200).json(updatedPost)

    }catch(error){
        return next(new HttpError(error.message, error.statusCode))
    }
}








// delete post API
// DELETE /api/posts/:id
// protected
const deletePost = async (req, res, next) => {
    try{
        
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