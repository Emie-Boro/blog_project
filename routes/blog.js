const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const path = require('path')
const fs = require('fs')
const bodyParser = require('body-parser')
const multer = require('multer')
const passport = require('passport')
const { ensureAuthenticated } = require('../config/auth')
let errors = []


//----------Blog Model------------
const Blog = require('../models/Blog')

//--------------------------Multer------------------------------
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        if(file.fieldname === 'blogImage1') {
            cb(null, path.join(__dirname, '../public/images'))
        }
        if(file.fieldname === 'blogImage2'){
            cb(null, path.join(__dirname, '../public/images'))
        }
        
    },
    filename: function(req, file, cb) {
        if(file.fieldname === 'blogImage1') {
            cb(null, req.body.category+'-'+req.user.number+'-'+Date.now()+path.extname(file.originalname))
        }
        if(file.fieldname === 'blogImage2'){
            cb(null, req.body.category+'-'+req.user.number+'-'+Date.now()+path.extname(file.originalname))
        } 
    }
})
const upload = multer({
    storage: storage,
    fileFilter: function(req, file, cb) {
        checkFileType(file, cb)
    },
    limits: { fileSize: 400000 },
})
function checkFileType(file, cb){
    const fileType = /jpeg|jpg|png|gif|jfif/

    const extname = fileType.test(path.extname(file.originalname).toLowerCase())

    const mimetype = fileType.test(file.mimetype)

    if(mimetype && extname) {
        return cb(null, true)
    } else{
        cb('File type not allowed')
    }
}


router.use(methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
      // look in urlencoded POST bodies and delete it
      let method = req.body._method
      delete req.body._method
      return method
    }
}))

router.use(bodyParser.urlencoded({extended: true}))
router.use(bodyParser.json())

//----------------Add Post---------------------
router.get('/add', ensureAuthenticated, (req,res) =>{
    res.render('user/blog/add', {
        layout: 'user'
    })
})

router.post('/add', 
    upload.fields([{name: 'blogImage1', maxCount: 1,},
        {name:'blogImage2', maxCount: 1}], ((err) =>{
            if(err) {
                console.log(err)
            }
        })
    ), async (req,res)=>{

    
    let blogImage1 = null;
    let blogImage2 = null;
    
    if(req.files.blogImage1 == undefined) {
        blogImage1 = 'blogImage1'
    }else if(req.files.blogImage1 != undefined){
        blogImage1 = req.files.blogImage1[0].filename
    }

    if(req.files.blogImage2 == undefined) {
        blogImage2 = 'blogImage2'
    }else if(req.files.blogImage2 != undefined) {
        blogImage2 = req.files.blogImage2[0].filename
    }
        
    await new Blog({
        title:req.body.title,
        category:req.body.category,
        content:req.body.content,
        blogImage1:blogImage1,
        blogImage2:blogImage2,
        user:req.user.id
    }).save()
    res.redirect('/user')
    
    
})

//----------------------Politics------------------------------
router.get('/politics', async(req,res) =>{
    const politics = await Blog.find({'category':'politics'}).lean()
    res.render('tripblog/politics', {
        title:'Politics',
        politics
    })
})
router.get('/politics/:id', async (req,res) =>{
    const politics = await Blog.findById(req.params.id).populate('user').lean()
    res.render('page/politics',{
        title: politics.title,
        politics
    })
})

//-------------------------Economy----------------------------
router.get('/economy', async(req,res) =>{
    const economy = await Blog.find({'category':'economy'}).lean()
    res.render('tripblog/economy', {
        title:'economy',
        economy
    })
})
router.get('/economy/:id', async (req,res) =>{
    const economy = await Blog.findById(req.params.id).populate('user').lean()
    res.render('page/economy',{
        title: economy.title,
        economy
    })
})


//-----------------------Education---------------------------
router.get('/education', async(req,res) =>{
    const education = await Blog.find({'category':'education'}).lean()
    res.render('tripblog/education', {
        title:'education',
        education
    })
})
router.get('/education/:id', async (req,res) =>{
    const education = await Blog.findById(req.params.id).populate('user').lean()
    res.render('page/education',{
        title: education.title,
        education
    })
})

//----------------------Entertainment-----------------------------------
router.get('/entertainment', async(req,res) =>{
    const entertainment = await Blog.find({'category':'entertainment'}).lean()
    res.render('tripblog/entertainment', {
        title:'entertainment',
        entertainment
    })
})
router.get('/entertainment/:id', async (req,res) =>{
    const entertainment = await Blog.findById(req.params.id).populate('user').lean()
    res.render('page/entertainment',{
        title: entertainment.title,
        entertainment
    })
})

//-------------------------------Food-----------------------------------
router.get('/food', async(req,res) =>{
    const food = await Blog.find({'category':'food'}).lean()
    res.render('tripblog/food', {
        title:'food',
        food
    })
})
router.get('/food/:id', async (req,res) =>{
    const food = await Blog.findById(req.params.id).populate('user').lean()
    res.render('page/food',{
        title: food.title,
        food
    })
})

//-------------------------Health------------------------------
router.get('/health', async(req,res) =>{
    const health = await Blog.find({'category':'health'}).lean()
    res.render('tripblog/health', {
        title:'health',
        health
    })
})
router.get('/health/:id', async (req,res) =>{
    const health = await Blog.findById(req.params.id).populate('user').lean()
    res.render('page/health',{
        title: health.title,
        health
    })
})

//-------------------------Movie-------------------------------
router.get('/movie', async(req,res) =>{
    const movie = await Blog.find({'category':'movie'}).lean()
    res.render('tripblog/movie', {
        title:'movie',
        movie
    })
})
router.get('/movie/:id', async (req,res) =>{
    const movie = await Blog.findById(req.params.id).populate('user').lean()
    res.render('page/movie',{
        title: movie.title,
        movie
    })
})

//----------------------------Music------------------------------
router.get('/music', async(req,res) =>{
    const music = await Blog.find({'category':'music'}).lean()
    res.render('tripblog/music', {
        title:'music',
        music
    })
})
router.get('/music/:id', async (req,res) =>{
    const music = await Blog.findById(req.params.id).populate('user').lean()
    res.render('page/music',{
        title: music.title,
        music
    })
})

//-------------------------Technology-------------------------------
router.get('/technology', async(req,res) =>{
    const technology = await Blog.find({'category':'technology'}).lean()
    res.render('tripblog/technology', {
        title:'technology',
        technology
    })
})
router.get('/technology/:id', async (req,res) =>{
    const technology = await Blog.findById(req.params.id).populate('user').lean()
    res.render('page/technology',{
        title: technology.title,
        technology
    })
})

//-----------------------Update Blog-----------------------------
router.get('/edit/:id', ensureAuthenticated, async(req,res)=>{
    const blog = await Blog.findById(req.params.id).lean()
    if(req.user.id == blog.user) {
        res.render('user/blog/edit', {
            title: `Edit ${blog.title}`, blog,
        })
    } else{
        res.redirect('/user/login')
    }
})

router.post('/edit/:id', ensureAuthenticated,  async(req,res)=>{ 
    await Blog.updateOne({_id: req.params.id}, {
        title : req.body.title,
        content : req.body.content
    })
    res.redirect('/user')
})

router.delete('/:id', ensureAuthenticated, async (req,res,next) =>{
    const blogImage = await Blog.findById(req.params.id)
    await Blog.deleteOne({_id:req.params.id})
    
    if(fs.existsSync(path.join(__dirname, `../public/images/${blogImage.blogImage1}`))) {
        fs.unlink(path.join(__dirname, `../public/images/${blogImage.blogImage1}`), (err) =>{
            if(err) {
                console.log(err)
            }
        })
    } 
    if(fs.existsSync(path.join(__dirname, `../public/images/${blogImage.blogImage2}`))) {
        fs.unlink(path.join(__dirname, `../public/images/${blogImage.blogImage2}`), (err) =>{
            if(err) {
                console.log(err)
            }
        })
    } 
    res.redirect('/user')
})


module.exports = router