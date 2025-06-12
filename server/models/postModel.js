const { Schema, model } = require('mongoose')

const postSchema = new Schema({
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    body: {
        type: String,
        required: true,
        trim: true,
        maxlength: 5000,
        minlength: 1
    },
    image: {
        type: String,
        default: '',
    },
    likes: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
        default: []
    }],
    comments: [{
        type: Schema.Types.ObjectId,
        ref: 'Comment',
        default: []
    }],
}, {timestamps: true})



module.exports = model('Post', postSchema)