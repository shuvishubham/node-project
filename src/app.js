require('dotenv').config()
const express = require('express');
const app = express();
require('./db/initDB')
const hbs = require('hbs')
const path = require('path')
const User = require('./models/register')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
const auth = require('./middleware/auth')


const partialsPath = path.join(__dirname, "../views/partials" )
hbs.registerPartials(partialsPath)

app.use(express.static(path.join(__dirname, "../public")))

app.set('view engine', 'hbs');

app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(cookieParser());

app.get("/", (req, res) => {
    res.render('index')
})

app.get("/about" , async (req, res) => {
    try {
    const token = req.cookies.jwt;
    const verifyUser = jwt.verify(token, process.env.SECRET_KEY);
    const person = await User.findOne({_id: verifyUser.id});

    res.render('about', {
        firstname: person.firstname,
        lastname: person.lastname,
        email:person.email,
    })

    } catch (error) {
        res.redirect('/login')
    }
    
})

app.get("/register", (req, res) => {
    res.render('register')
})

app.post("/register", async (req, res) => {
    try {
        const {firstname, lastname, email, gender, phone, age, password, confirmpassword} = req.body;
        
        if(password === confirmpassword){
            const registerUser = new User({
                firstname, lastname, email, gender, phone, age, password
            });

            // Hashing Password -- defined in model

            const result = await registerUser.save()
            res.redirect('/login')
        }else{
            res.status(400).redirect('/register')
        }
        
    } catch (error) {
        res.status(400).redirect('/register')
    }
})


app.get('/login', (req, res) => {
    res.render('login')
})

app.post('/login', async(req,res) => {
    try {
        const {email, password} = req.body;
        const loginUser = await User.findOne({email});

        const passwordCompare = await bcrypt.compare(password, loginUser.password)
        if(passwordCompare){
                const token = await jwt.sign({id: loginUser._id}, process.env.SECRET_KEY)
                const saveToken = await User.updateOne({_id: loginUser._id}, {$set: {token: token}}); 
                await res.cookie("jwt", token,{
                    expires: new Date(Date.now() + 86400000),
                    httpOnly:true,
                    // secure:true --for https only
                });
                res.redirect('/')
        }else{
            res.status(400).redirect('/login')
        }
        
    } catch (error) {
        res.status(400).redirect('/login')
    }
})

app.get('/logout', auth ,async (req, res) => {
    try {
        res.clearCookie('jwt');
        const removeToken = await User.updateOne({_id: req.person._id}, {$set: {token: ""}})
        res.redirect('/login')
    } catch (error) {
        res.redirect('/')
    }
})

app.listen(3000, () => {
    console.log("App is Running at Localhost 3000")
})