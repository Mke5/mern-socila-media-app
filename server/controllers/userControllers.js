const HttpError = require('../models/errorModel')
const userModel = require('../models/userModel')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const sanitizeHtml = require('sanitize-html')



// register user
// POST : /api/users/register
// unprotected route
const registerUser = async (req, res, next) => {
    try {
        if(!req.body){
            return next(new HttpError('No data provided', 400))
        }
        let {fullName, email, password, confirmPassword} = req.body
        fullName = sanitizeHtml(fullName.trim(),{
            allowedTags: [],
            allowedAttributes: {}
        })
        email = sanitizeHtml(email.trim(),{
            allowedTags: [],
            allowedAttributes: {}
        })
        password = sanitizeHtml(password.trim(),{
            allowedTags: [],
            allowedAttributes: {}
        })
        if(!fullName || !email || !password || !confirmPassword){
            return next(new HttpError('All fields are required', 400))
        }

        if(await userModel.findOne({email: email})){
            return next(new HttpError('Email already exists', 422))
        }
        if(password.length < 8){
            return next(new HttpError('Passwords must be more than 8 characters', 422))
        }
        if(password !== confirmPassword){
            return next(new HttpError('Passwords do not match', 422))
        }
        const salt = await bcrypt.genSalt(12)
        password = await bcrypt.hash(password, salt)
        const newUser = await userModel.create({
            fullName: fullName,
            email: email,
            password: password
        })
        res.status(201).json(newUser)
    } catch (error) {
        return next(new HttpError(error.message, error.statusCode))
    }
}




// login user
// POST : /api/users/login
// unprotected route
const loginUser = async (req, res, next) => {
    try {
        if(!req.body){
            return next(new HttpError('No data provided', 400))
        }
        let { email, password } = req.body
        if(!email || !password){
            return next(new HttpError('All fields are required', 400))
        }
        const user = await userModel.findOne({email: email})
        if(!user){
            return next(new HttpError('Invalid Credentials', 422))
        }
        if(!await bcrypt.compare(password, user.password)){
            return next(new HttpError('Invalid credentials', 422))
        }

        const token = await jwt.sign({id: user._id}, process.env.JWT_SECRET,{
            expiresIn: '30d'
        })
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
            maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
        }) 
        res.status(200).json({ 
            user: {
                id: user._id,
                email: user.email,
                fullName: user.fullName,
                profilePhoto: user.profilePicture
            }
        })
    } catch (error) {
        return next(new HttpError(error.message, error.statusCode))
    }
}





// logout user
// POST : /api/users/logout
// unprotected route
const logoutUser = (req, res, next) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict'
        }) 
        return res.status(200).json({ message: 'Logged out successfully' }) 
    } catch (error) {
        return next(new HttpError('Logout failed', 500)) 
    }
} 




// get user
// POST : /api/users/:id
// unprotected route
const getUser = async (req, res, next) => {
    try {
        if(!req.params){
            return next(new HttpError('No data provided', 400))
        }
        const {id} = req.params
        const user = await userModel.findBy(id).select('-password')
        if(!user || user === ''){
            return next(new HttpError('User not found', 404))
        }
        res.status(200).json({ token, user: { id: user._id, email: user.email, fullName: user.fullName } }) 
    } catch (error) {
        return next(new HttpError(error.message, error.statusCode))
    }
}









// get users
// POST : /api/users/:id
// unprotected route
const getUsers = async (req, res, next) => {
    try {
        const users = await userModel.find().limit(10).sort({createdAt: -1}).select('-password')
        if(!users){
            return next(new HttpError('No users yet', 404))
        }
        res.json(users).status(200)
    } catch (error) {
        return next(new HttpError(error.message, error.statusCode))
    }
}




// edit user
// POST : /api/users/edit
// unprotected route
const editUser = async (req, res, next) => {
    try {
        if(!req.body){
            return next(new HttpError('No data provided', 400))
        }
        const { name, email, currentPassword, newPassword, confirmPassword } = req.body 

        if (!name || !email || !currentPassword || !newPassword || !confirmPassword) {
            return next(new HttpError('Fill all fields!', 422)) 
        }

        const user = await User.findById(req.user.id) 
        if (!user) {
            return next(new HttpError('User not found', 404)) 
        }
        if (user.email !== email) {
            const emailExists = await User.findOne({ email }) 
            if (emailExists) {
                return next(new HttpError('Email already in use by another account', 409)) 
            }
        }
        const isMatch = await bcrypt.compare(currentPassword, user.password) 
        if (!isMatch) {
            return next(new HttpError('Incorrect current password', 401)) 
        }
        if (newPassword !== confirmPassword) {
            return next(new HttpError('New passwords do not match', 422)) 
        }
        const salt = await bcrypt.genSalt(12) 
        const hashedPassword = await bcrypt.hash(newPassword, salt) 

        user.name = name 
        user.email = email 
        user.password = hashedPassword 

        await user.save() 

        res.status(200).json({ message: 'User updated successfully' }) 
    } catch (error) {
        return next(new HttpError(error.message, error.statusCode))
    }
}






// follow/unfollow user
// PATCH : /api/users/:id/follow
// unprotected route
const followUnfollowUser = async (req, res, next) => {
    try {
        if(!req.params.id){
            return next(new HttpError('No data provided', 400))
        }
        const userToFollow = req.params.id
        if(req.user.id === req.params.id){
            return next(new HttpError(`Can't follow yourself`, 400))
        }
        const currentUser = await userModel.findById(req.user.id).select('-password')
        if(!currentUser.following.includes(userToFollow)){
            const updatedUser = await userModel.findByIdAndUpdate(userToFollow, {
                $push: {
                    followers: req.user.id
                }
            }, {
                new: true
            }).select('-password')

            await userModel.findByIdAndUpdate(req.user.id, {
                $push: {
                    following: userToFollow
                }
            }, {
                new: true
            })
            
            res.json(updatedUser)
        }else {
            const updatedUser = await userModel.findByIdAndUpdate(userToFollow, {
                $pull: {
                    followers: req.user.id
                }
            }, {
                new: true
            }).select('-password')

            await userModel.findByIdAndUpdate(req.user.id, {
                $pull: {
                    following: userToFollow
                }
            }, {
                new: true
            })
            
            res.json(updatedUser)
        }
    } catch (error) {
        return next(new HttpError(error.message, error.statusCode))
    }
}




// change user picture
// PACTH : /api/users/avatar
// unprotected route
const changeUserAvatar = async (req, res, next) => {
    try {
        if(!req.user || !req.user.id){
            return next(new HttpError('Cannot identify user', 401))
        }

        if(!req.files){
            return next(new HttpError('PLease choose an image', 422))
        }

        const user = await User.findById(req.user.id)
        if (!user) {
            return next(new HttpError('User not found', 404)) 
        }
        if(user.avatar){
            fs.unlink(path.join(__dirname, '..', 'uploads', user.avatar), (err) => {
                if(err){
                    return next(new HttpError(err, err.statusCode))
                }
            })
        }

        const {avatar} = req.files
        if(avatar.size > 500000){
            return next(new HttpError('file size greater than 500kb', 422))
        }

        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'] 
        if (!allowedTypes.includes(avatar.mimetype)) {
            return next(new HttpError('Only image files are allowed (jpeg, png, gif, webp)', 422)) 
        }

        const fileExt = path.extname(avatar.name) 
        const safeBaseName = path.basename(avatar.name, fileExt).replace(/[^a-zA-Z0-9_-]/g, '') 
        const newFileName = `${safeBaseName}-${uuid()}${fileExt}` 
        const uploadPath = path.join(__dirname, '..', 'uploads', newFileName) 

        avatar.mv(uploadPath, async (err) => {
            if (err) {
                return next(new HttpError('Failed to upload image', 500)) 
            }

            user.avatar = newFileName 
            await user.save() 

            res.status(200).json({ message: 'Avatar updated successfully', avatar: newFileName }) 
        }) 
    } catch (error) {
        return next(new HttpError(error.message, error.statusCode))
    }
}





module.exports = {
    registerUser,
    changeUserAvatar,
    loginUser,
    getUser,
    editUser,
    getUsers,
    followUnfollowUser,
    logoutUser
}