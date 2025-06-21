const { Schema, model } = require('mongoose')




const userSchema = new Schema({
    fullName: {
        type: String, 
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 50
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        match: /.+\@.+\..+/,
        minlength: 5,
        maxlength: 50,
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        maxlength: 100,
        select: true, // Exclude password from queries by default if false
    },
    profilePicture: {
        type: String,
        default: 'http://localhost:5000/uploads/02758dd2-45f6-4619-b352-f907731567d8-myPic.jpg',
        trim: true,
        validate: {
            validator: function(v) {
                return v === '' || /^https?:\/\/.+\.(jpg|jpeg|png|gif)$/.test(v);
            },
            message: props => `${props.value} is not a valid URL for a profile picture!`
        }
    },
    bio: {
        type: String,
        default: 'No bio yet',
        trim: true,
        maxlength: 200,
    },
    followers: [{
        type: Schema.Types.ObjectId, 
        ref: 'User',
        default: []
    }],
    following: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
        default: []
    }],
    bookmarks: [{
        type: Schema.Types.ObjectId,
        ref: 'Post',
        default: []
    }],
    posts: [{
        type: Schema.Types.ObjectId,
        ref: 'Post',
        default: []
    }]
}, {
    timestamps: true,
    // versionKey: false,
})




module.exports = model('User', userSchema)