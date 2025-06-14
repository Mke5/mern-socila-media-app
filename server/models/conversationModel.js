const {Schema, model} = require('mongoose')


const conversationSchema = new Schema({
    participants: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }],
    lastMessage: {
        text: {
            type: String,
            required: true
        },
        senderId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }
    }

}, {timestamps: true})



module.exports = model('Conversation', conversationSchema)