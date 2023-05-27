const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')

router.use(bodyParser.urlencoded({extended:true}))
router.use(bodyParser.json())

router.get('/', (req,res) =>{
    res.render('contact', {
        title:'Contact',
    })
})

router.post('/send', (req,res)=>{
    res.redirect('/contact')
})

module.exports = router