const express = require('express')
const app = express()
const path = require('path')
const exphbs = require('express-handlebars')
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const connectDB = require('./config/db')
const bodyParser = require('body-parser')
const passport = require('passport')
const session = require('express-session')

// Mongoose Blog
const Blog = require('./models/Blog')

// Load Config
dotenv.config({path: './config/config.env' })

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())


app.use(session({
    secret:process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: false
}))

app.use(passport.initialize())
app.use(passport.session())

const PORT = process.env.PORT || 8080

// Connect MongoDB 
connectDB()

const { formatDate } = require('./helpers/hbs')
// Handlebars
app.engine('.hbs', exphbs.engine({ 
    helpers:{ formatDate}, defaultLayout: "main", extname:'.hbs'}
))
app.set('view engine', '.hbs')


app.use(express.static(path.join(__dirname, 'public')))

app.get('/', async (req,res) =>{
    const politics = await Blog.find({'category':'politics'}).lean()
    res.render('main', {
        title:'Trip Blog',
        politics
    })
})


// Defining Routes
const about = require('./routes/about')
const contact = require('./routes/contact')
const user = require('./routes/user')
const blog = require('./routes/blog')


// Using Defined routes
app.use('/user', user)
app.use('/about', about)
app.use('/contact', contact)
app.use('/blog', blog)



app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}...`))