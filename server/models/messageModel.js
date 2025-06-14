const {Schema, model} = require('mongoose')





const messageSchema = new Schema({
    conversationId: {
        type: Schema.Types.ObjectId,
        ref: 'Conversation',
        required: true,
        index: true
    },
    senderId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    text: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        maxlength: 500
    },
    attachments: [{
        type: {
            type: String,
            enum: ['image', 'video', 'file'],
            required: false
        }
    }],
    readBy: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
        default: []
    }],
}, {timestamps: true})



module.exports = model('Message', messageSchema)