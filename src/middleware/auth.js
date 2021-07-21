const jwt = require('jsonwebtoken');
const User = require('../models/register')

const auth = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        const verifyUser = jwt.verify(token, process.env.SECRET_KEY);
        const person = await User.findOne({_id: verifyUser.id});
        
        req.token = token;
        req.person = person;
        next();
    } catch (error) {
        res.redirect('/login')
    }
    
}

module.exports = auth;
