const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const express = require('express');
const app = express();

//set cookie parser
app.use(cookieParser())

//bodyparser
app.use(express.json())
app.use(express.urlencoded({exteded : false}))

module.exports = function (req,res,next){
    const token = req.cookies('auth-token');
    if(!token) return res.status(401).send('access denied');
    
    try {
        const verified = jwt.verify(token, process.env.TOKEN_SECRET); 
        req.user = verified;
        next();
    } catch {
        res.status(400).send('invalid token');
    }
}
