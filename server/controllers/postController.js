const HttpError = require('../middlewares/errorMiddleware')
const PostModel = require('../models/postModel')
const UserModel = require('../models/userModel')
const {v4, uuid} = require('uuid')
const fs = require('fs')
const path = require('path')




// create post API
// POST /api/posts
// protected
const createPost = async (req, res, next) => {
    try{
        res.json('Create POst')
    }catch(error){
        return next(new HttpError(error.message, error.statusCode))
    }
}







// create post API
// GET /api/posts/:id
// protected
const getPost = async (req, res, next) => {
    try{
        res.json('get post')
    }catch(error){
        return next(new HttpError(error.message, error.statusCode))
    }
}







// get post API
// GET /api/posts
// protected
const getPosts = async (req, res, next) => {
    try{
        res.json('get posts')
    }catch(error){
        return next(new HttpError(error.message, error.statusCode))
    }
}





// update post API
// PACTH /api/posts/:id
// protected
const updatePost = async (req, res, next) => {
    try{
        res.json('update POst')
    }catch(error){
        return next(new HttpError(error.message, error.statusCode))
    }
}








// delete post API
// DELETE /api/posts/:id
// protected
const deletePost = async (req, res, next) => {
    try{
        res.json('delete POst')
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