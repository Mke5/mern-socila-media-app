const HttpError = require('../models/errorModel')
const CommentModel = require('../models/commentModel')
const PostModel = require('../models/postModel')
const UserModel = require('../models/userModel')
const sanitizeHtml = require('sanitize-html');



// create comments API
// POST /api/comments/:id
// protected
const createComment = async(req, res, next) => {
    try{
        const {postId} = req.params
        const {comment} = req.body
        if(!comment || comment.trim() === ''){
            return next(new HttpError('Comment cannot be empty', 400))
        }
        const cleanBody = sanitizeHtml(comment.trim(), {
            allowedTags: [], // disallow all HTML tags
            allowedAttributes: {} // disallow all attributes
        });

        const commentCreator = await UserModel.findById(req.user.id)
        if(!commentCreator){
            return next(new HttpError('User not found', 404))
        }
        const newComment = await CommentModel.create({
            creator: req.user.id,
            creatorName: commentCreator.fullName,
            creatorAvatar: commentCreator.profilePicture,
            postId: postId,
            comment: cleanBody
        })
        await PostModel.findByIdAndUpdate(postId, {
            $push: { comments: newComment._id }
        }, {new: true})

        res.status(200).json(newComment)
    }catch(error){
        return next(new HttpError(error.message, error.statusCode))
    }
}



// get post comments API
// GET /api/comments/:postId
// protected
const getPostComment = async(req, res, next) => {
    try{
        const {postId} = req.params
        const comments = await PostModel.findById(postId).populate({
            path: 'comments',
            options: {
                sort: {createdAt: -1}
            }
        })
        res.status(200).json(comments)
    }catch(error){
        return next(new HttpError(error.message, error.statusCode))
    }
}





// delete comments API
// DELETE /api/comments/:commentId
// protected
const deleteComment = async(req, res, next) => {
    try{
        const {commentId} = req.params
        const comment = await CommentModel.findById(commentId)
        const commentCreator = await UserModel.findById(comment?.creator?.creatorId)

        if(commentCreator?._id !== req.user.id){
            return next(new HttpError('Unauthorized actions', 403))
        }
        await PostModel.findByIdAndUpdate(comment?.postId, {
            $pull: {comments: commentId}
        })
        await CommentModel.findByIdAndDelete(commentId)
        res.json({
            message: "comment deleted"
        })
    }catch(error){
        return next(new HttpError(error.message, error.statusCode))
    }
}




module.exports = {
    createComment,
    getPostComment,
    deleteComment
}