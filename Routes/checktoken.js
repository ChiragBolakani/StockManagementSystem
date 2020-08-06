const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const express = require('express');
const app = express();

//set cookie parser
app.use(cookieParser())

//bodyparser
app.use(express.json())
app.use(express.urlencoded({extended : true}))

module.exports = function checktoken(req,res,next){
    const token = req.cookies['authToken'];
    if(!token) return res.status(401).send('<h1>Access Denied</h1>');
    
    try {
        const verified = jwt.verify(token, process.env.TOKEN_SECRET); 
        req.user = verified;
        next();
    } catch {
        res.status(400).send('<h1>Invalid Token</h1>');
    }
}
  