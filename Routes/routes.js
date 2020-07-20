const express = require('express');
const router = express.Router();
const Stock = require('../models/StockSchema.js')
const mongoose = require('mongoose');
const {ObjectId} = require('mongodb');
const db = require('../index.js')
const Login = require('../models/StockSchema.js');
const jwt = require('jsonwebtoken');
const verify = require('./verifyToken.js')
const dotenv = require('dotenv');
const verifyToken = require('./verifyToken.js');
const cookieParser = require('cookie-parser');
dotenv.config();

router.get("/home", (req, res) =>{
  res.send("hello there")
})

router.get("/", (req, res)=>{
  res.render("login")
})

router.post("/", (req,res)=>{

 const user = {
   Email : req.body.Email,
   Password : req.body.Password,

 }

 Login.findOne({ Email : user.Email, Password : user.Password}, (err,User)=>{

   if(User){
     const token = jwt.sign({_id : User._id, Email : user.Email}, process.env.TOKEN_SECRET)
     res.cookie("authToken", token, {httpOnly : true})
     console.log('user exists')
     res.redirect("list")
   }else{
     res.send('User Not Found', 401)
   }
 })
})

router.get("/StockStats", checktoken,(req,res)=>{
  res.render("Statspage.ejs")
})

router.post("/StockStats", (req,res)=>{
  console.log(req.body)
  const newStock = new Stock();

  newStock.Modelnumber = req.body.Modelnumber;
  newStock.Itemtype = req.body.Itemtype;
  newStock.Quantity = req.body.Quantity;
  newStock.Mrp = req.body.Mrp;
  newStock.Company = req.body.Company;

  newStock.save((err, newStock)=>{
    if(err){
      console.log(err)
    }else{
      res.redirect("./list")
      console.log("saved")    }
  })
})

router.post("/list/search", (req,res)=>{

  var filterItemtype = req.body.type;
  var filterSearch = req.body.Modelnumbersearch;

  if(filterItemtype!=="" && filterSearch!== "" ){
    var filterParam = {$and : [{Itemtype : filterItemtype}, {Modelnumber : {$regex : filterSearch}}]}

  }else if(filterItemtype == "" && filterSearch!= ""){
    console.log("item khaali aur search bhara")
    var filterParam = {Modelnumber : {$regex : filterSearch}}

  }else if (filterItemtype!== "" && filterSearch== "") {
    console.log("item bhara aur search khali")
    var filterParam = {Itemtype : filterItemtype}

  }else{
    console.log("inside else")
  }

  mongoose.model('stock').find(filterParam, (err, attributes)=>{
    if(err){
      console.log(err)
    }else{
      // res.send(attributes)
      res.render("list", {
        attributes : attributes
      })
    }
  })
})

router.get("/EditStock/:id", (req,res)=>{
  Stock.findById(req.params.id, (err, attributes)=>{
    if(err){
      console.log(err)
    }else{
      res.render("EditStock.ejs", {
        attributes : attributes
      })
    }
  })
})

router.post("/EditStock/", (req,res) => {
  Stock.findOneAndUpdate({_id : req.body._id}, req.body, { new:true }, (err, doc)=>{
    if(err){
      console.log(err)
    }else{
      res.redirect("list")
    }
  })
  console.log(req.body)
})

function checktoken(req,res,next){
  const token = req.cookies['authToken'];
  // const decoded = jwt.decode(token)
  // const email = decoded.Email;
  if(!token) return res.status(401).send('access denied');
  
  try {
      const verified = jwt.verify(token, process.env.TOKEN_SECRET); 
      req.user = verified;
      next();
  } catch {
      res.status(400).send('invalid token');
  }
}

router.post("/logout", (req,res)=>{
  res.clearCookie('authToken').redirect('/users')
  
})

//Listing Stock
router.get('/list',checktoken, (req,res) =>{
  mongoose.model('stock').find((err,attributes)=>{
    if(err){
      console.log(err)
    }else{
      // res.send(attributes)
      res.render("list.ejs", {
        attributes : attributes
      })
    }
  })
})

router.get("/Delete/:id", (req,res)=>{
  console.log(req.params.id);
  Stock.findByIdAndRemove(new ObjectId(req.params.id), (err, doc)=>{
    if(err){
      console.log(err)
    }else{
      res.redirect("../list")

          }
  })
})



module.exports = router;
