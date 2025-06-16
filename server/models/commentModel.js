const {Schema, model} = require('mongoose')

const commentSchema = new Schema({
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    creatorName: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        maxlength: 50,
    },
    creatorAvatar: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        maxlength: 200
    },
    postId: {
        type: Schema.Types.ObjectId,
        ref: 'Post',
        required: true,
        index: true
    },
    comment: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        maxlength: 500
    }
}, {timestamps: true})




module.exports = model('Comment', commentSchema)