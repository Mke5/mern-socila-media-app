const HttpError = require('../models/errorModel')
const MessageModel = require('../models/messageModel')
const ConversationModel = require('../models/conversationModel')
const sanitizeHtml = require('sanitize-html')
const path = require('path');
const { v4: uuid } = require('uuid');





// create message
// GET : /api/messages/:recieverID
// protected
const getMessage = async(req, res, next) => {
    try{

    }catch(error){
        return next(new HttpError(error.message, error.statusCode))
    }
}







// get conversation messages
// GET : /api/messages/:recieverID
// protected
const getConversation = async(req, res, next) => {
    try{

    }catch(error){
        return next(new HttpError(error.message, error.statusCode))
    }
}










// create message
// POST : /api/messages/:recieverID
// protected
const createMessage = async(req, res, next) => {
    // try{
    //     const {recieverId} = req.params
    //     let {message} = req.body
    //     message = sanitizeHtml(message.trim(), {
    //         allowedTags: [],
    //         allowedAttributes: {}
    //     })
    //     if(!recieverId || !message){
    //         return next(new HttpError('Reciever ID and message are required', 400))
    //     }
    //     // check if there is a conversation between the sender and reciever
    //     let conversation = await ConversationModel.findOne({
    //         participants: {$all: [req.user.id, recieverId]}
    //     })
    //     // create a new conversation if none was found
    //     if(!conversation){
    //         conversation = await ConversationModel.create({
    //             participants: [req.user.id, recieverId],
    //             lastMessage: {text: messageBody, senderId: req.user.id}
    //         })
    //     }
    //     // create a new message
    //     const newMessage = await MessageModel.create({conversationId: conversation._id, senderId: req.user.id, text: message})
    //     await conversation.updateOne({
    //         lastMessage: {text: message, senderId: req.user.id}
    //     })
    //     res.status(200).json(newMessage)
    // }catch(error){
    //     return next(new HttpError(error.message, error.statusCode))
    // }

    try {
        const { recieverId } = req.params;
        let { message } = req.body;

        // Sanitize and trim text (optional)
        message = message?.trim();
        const cleanText = message
            ? sanitizeHtml(message, { allowedTags: [], allowedAttributes: {} })
            : '';

        const attachments = [];

        if (req.files && req.files.attachments) {
            const files = Array.isArray(req.files.attachments)
                ? req.files.attachments
                : [req.files.attachments];

            // for (const file of files) {
            //     if (!file.mimetype.startsWith('image/') &&
            //         !file.mimetype.startsWith('video/') &&
            //         !file.mimetype.startsWith('application/')
            //     ) {
            //         return next(new HttpError('Unsupported file type', 400));
            //     }

            //     if (file.size > 10 * 1024 * 1024) {
            //         return next(new HttpError('File too large (max 10MB)', 400));
            //     }

            //     const ext = path.extname(file.name);
            //     const fileName = `${uuid()}${ext}`;
            //     const filePath = path.join(__dirname, '../uploads', fileName);

            //     await file.mv(filePath);

            //     attachments.push({
            //         type: file.mimetype.startsWith('image/')
            //             ? 'image'
            //             : file.mimetype.startsWith('video/')
            //             ? 'video'
            //             : 'file',
            //         fileName
            //     });
            // }
            await Promise.all(files.map(async (file) =>{
                if (
                    !file.mimetype.startsWith('image/') &&
                    !file.mimetype.startsWith('video/') &&
                    !file.mimetype.startsWith('application/')
                ) {
                    throw new HttpError('Unsupported file type', 400);
                }
    
                if (file.size > 10 * 1024 * 1024) {
                    throw new HttpError('File too large (max 10MB)', 400);
                }
    
                const ext = path.extname(file.name);
                const fileName = `${uuid()}${ext}`;
                const filePath = path.join(__dirname, '../uploads', fileName);
    
                await file.mv(filePath)
    
                attachments.push({
                    type: file.mimetype.startsWith('image/')
                        ? 'image'
                        : file.mimetype.startsWith('video/')
                        ? 'video'
                        : 'file',
                    fileName,
                })
            }))
        }

        // Require at least a message or one file
        if (!cleanText && attachments.length === 0) {
            return next(new HttpError('Message or attachment is required', 400));
        }

        // Check for existing conversation
        let conversation = await ConversationModel.findOne({
            participants: { $all: [req.user.id, recieverId] }
        });

        // Create new conversation if not found
        if (!conversation) {
            conversation = await ConversationModel.create({
                participants: [req.user.id, recieverId],
                lastMessage: {
                    text: cleanText || '[Attachment]',
                    senderId: req.user.id
                }
            });
        }

        // Create the message
        const newMessage = await MessageModel.create({
            conversationId: conversation._id,
            senderId: req.user.id,
            text: cleanText,
            attachments,
            readBy: [req.user.id]
        });

        // Update conversation last message
        conversation.lastMessage = {
            text: cleanText || '[Attachment]',
            senderId: req.user.id
        };
        await conversation.save();

        return res.status(201).json(newMessage);

    } catch (error) {
        return next(new HttpError(error.message, error.statusCode));
    }
}








module.exports = {
    getMessage,
    getConversation,
    createMessage
}