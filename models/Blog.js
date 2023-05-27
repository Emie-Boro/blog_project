const mongoose = require('mongoose')

const blogschema = mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    category:{
        type:String
    },
    blogImage1:{
        type:String
    },
    blogImage2:{
        type:String
    },
    content:{
        type:String,
        required:true
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
})

const Blog = mongoose.model('Blog',blogschema)

module.exports = Blog