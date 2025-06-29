const HttpError = require('../models/errorModel')
const PostModel = require('../models/postModel')
const UserModel = require('../models/userModel')
const {v4: uuid} = require('uuid')
const fs = require('fs')
const path = require('path')
const sanitizeHtml = require('sanitize-html')




// create post API
// POST /api/posts
// protected
const createPost = async (req, res, next) => {
    try {
        const { body } = req.body
        let images = req?.files?.images || []
        if (!Array.isArray(images)) images = [images]
    
        if (!body || body.trim().length < 1) {
          return next(new HttpError('Post body is required', 400))
        }
    
        const cleanBody = sanitizeHtml(body.trim(), {
          allowedTags: [],
          allowedAttributes: {}
        })

        const getBaseUrl = (req) => {
            return `${req.protocol}://${req.get('host')}`;
        }

        const baseUrl = getBaseUrl(req)
    
        const imageArray = await Promise.all(
          images.map((image) => {
            return new Promise((resolve, reject) => {
              if (!image.mimetype.startsWith('image/')) {
                return reject(new HttpError('Invalid image format', 400))
              }
              if (image.size > 1024 * 1024 * 5) {
                return reject(new HttpError('Image size should be less than 5MB', 400))
              }
    
              const imageName = `${uuid()}-${image.name}`
              const imagePath = path.join(__dirname, '..', 'uploads', imageName)
    
              image.mv(imagePath, (err) => {
                if (err) {
                  return reject(new HttpError(err.message, 500))
                }
                const absoluteUrl = `${baseUrl}/uploads/${imageName}`
                resolve(absoluteUrl)
              })
            })
          })
        )
    
        const newPost = await PostModel.create({
          creator: req.user.id,
          body: cleanBody,
          images: imageArray
        })
    
        await UserModel.findByIdAndUpdate(newPost?.creator, {
          $push: { posts: newPost?._id }
        })
    
        return res.status(201).json({
          status: 'success',
          data: newPost
        })
    }catch (err) {
        return next(new HttpError(err.message, 500));
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

        res.status(200).json(post)

    }catch(error){
        return next(new HttpError(error.message, error.statusCode || 500))
    }
}







// get post API
// GET /api/posts
// protected
const getPosts = async (req, res, next) => {
    try{
        const posts = await PostModel.find().sort({
            createdAt: -1
        }).populate('creator', 'fullName profilePhoto -password')

        res.status(200).json(posts)
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
        const postId = req.params.id;

        // Find the post
        const post = await PostModel.findById(postId);
        if (!post) {
            return next(new HttpError('Post not found', 404));
        }

        // Authorization check (optional)
        if (post?.creator.toString() !== req.user.id) {
            return next(new HttpError('Not authorized to update this post', 403));
        }

        await PostModel.findByIdAndDelete(postId)
        await UserModel.findByIdAndUpdate(post?.creator,  {
            $pull: {posts: postId}
        })
        res.status(200).json({
            message: 'Post deleted successfully'
        })
    }catch(error){
        return next(new HttpError(error.message, error.statusCode))
    }
}





// get following posts API
// GET /api/posts/following
// protected
const getFollowingPost = async (req, res, next) => {
    try{
        const user = await UserModel.findById(req.user.id)
        const posts = await PostModel.find({
            creator: { $in: user?.following}
        })
        res.status(200).json(posts)
    }catch(error){
        return next(new HttpError(error.message, error.statusCode))
    }
}



// like/dislike post API
// POST /api/posts/:id/like
// protected
const likeDislikePost = async (req, res, next) => {
    try{
        const {id} = req.params
        if(!id){
            return next(new HttpError('Post ID is required', 400))
        }

        const post = await PostModel.findById(id)
        if(!post){
            return next(new HttpError('Post not found', 404))
        }
        let updatedPost
        if(post?.likes.includes(req.user.id)){
            updatedPost = await PostModel.findByIdAndUpdate(id, {
                $pull: {likes: req.user.id},
            }, {new: true})
        }else{
            updatedPost = await PostModel.findByIdAndUpdate(id, {
                $push: {likes: req.user.id},
            }, {new: true})
        }
        res.status(200).json(updatedPost)
    }catch(error){
        return next(new HttpError(error.message, error.statusCode))
    }
}








// get user post API
// GET /api/user/:id/posts
// protected
const getUserPosts = async (req, res, next) => {
    try{
        const userId = req.params.id
        const posts = await PostModel.find({creator: userId}).sort({
            createdAt: -1
        }).populate({path: 'posts', select: 'name avatar username', options: {sort: {createdAt: -1}}})
        res.status(200).json(posts)
    }catch(error){
        return next(new HttpError(error.message, error.statusCode))
    }
}







// bookmark post API
// POST /api/posts/:id/bookmark
// protected
const bookmarkPost = async (req, res, next) => {
    try{
        const {id} = req.params
        if(!id){
            return next(new HttpError('Post ID is required', 400))
        }
        const user = await UserModel.findById(req.user.id)
        if(!user){
            return next(new HttpError('User not found', 404))
        }
        if(user?.bookmarks?.includes(id)){
            const userBookmarks = await UserModel.findByIdAndUpdate(req.user.id, {
                $pull: {bookmarks: id}
            }, {new: true})
            res.status(200).json(userBookmarks)
        }else{
            const userBookmarks = await UserModel.findByIdAndUpdate(req.user.id, {
                $push: {bookmarks: id}
            }, {new: true})
            res.status(200).json(userBookmarks)
        }
        const post = await PostModel.findById(id)
    }catch(error){
        return next(new HttpError(error.message, error.statusCode))
    }
}










// get bookmarks post API
// GET /api/posts/bookmarks
// protected
const getPostBookmarks = async (req, res, next) => {
    try{
        const userBookmarks = await UserModel.findById(req.user.id).populate({
            path: 'bookmarks',
            options: { sort: {createdAt: -1}}
        })
        res.status(200).json(userBookmarks)
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