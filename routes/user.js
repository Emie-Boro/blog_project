const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')
const bcrypt = require('bcryptjs')
const session = require('express-session')
const mongoose = require('mongoose')
const {check, validationResult} = require('express-validator')
const passport = require('passport')

require('../config/passport')(passport)
const { ensureAuthenticated } = require('../config/auth')

//------------Model----------------------
const User = require('../models/User')
const Blog = require('../models/Blog')

router.use(bodyParser.urlencoded({extended: true}))
router.use(bodyParser.json())

router.use(session({
    secret:process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: false
}))

router.use(passport.initialize())
router.use(passport.session())


router.get('/signup',(req,res) =>{

    if(req.isAuthenticated()) {
        res.redirect('/user')
    }

    res.render('user/signup',{
        layout:'user',
        title:'Signup'
    })
})

router.post('/signup', [
        check('username', 'username is required').not().isEmpty(),
        check('number', 'number is required').not().isEmpty(),
        check('email', 'email is required').not().isEmpty(),
        check('email', 'email incorrect').isEmail(),
        check('password', 'password is required/ password do not match').not().isEmpty(),
    ], async (req,res) =>{
    
    const username = req.body.username
    const number = req.body.number
    const email = req.body.email
    const password = req.body.password

    const emailExist = await User.findOne({email:email}).lean()
    const numberExist = await User.findOne({number:number}).lean()
    const usernameExist = await User.findOne({username:username}).lean()
    
    if(req.body.password2 !== password){
        res.send('Password do not match')
    } 
    if(emailExist || usernameExist || numberExist ){
        res.send('User Exist')
        console.log(emailExist,usernameExist)
    }else{
        const errors = validationResult(req)

        if(!errors.isEmpty()) {
            res.json(errors)
        }else{
            let newUser = await new User({
                email:email,
                username:username,
                number:number,
                password:password
            })
            bcrypt.genSalt(10, (err, salt)=>{
                bcrypt.hash(newUser.password, salt, (err, hash)=>{
                    if(err) {
                        console.log(err)
                    }
                    newUser.password = hash;
                    newUser.save()
                })
            })        
        }
        res.redirect('/user/login')

    }
})


router.get('/login',(req,res) =>{
    if(req.isAuthenticated()) {
        res.redirect('/user')
    }
    res.render('user/login',{
        layout:'user',
        title:'Login'
    })
})

router.post('/login',(req,res,next) =>{
    passport.authenticate('local', {
        successRedirect:'/user',
        failureRedirect:'/user/login',
    })(req,res,next)
})

router.get('/', ensureAuthenticated, async (req,res)=>{
    const blog = await Blog.find({user:req.user.id}).lean()
    res.render('user/dashboard', { 
        layout:'user',
        title: 'Trip Blog',
        username: req.user.username,
        blog
    })
})

router.get('/logout', (req,res)=>{
    req.logOut((err=>{
        if(err) throw err
    }))
    res.redirect('/user/login')
})
module.exports = router