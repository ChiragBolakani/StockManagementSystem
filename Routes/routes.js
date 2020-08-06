const express = require('express');
const router = express.Router();
const Stock = require('../models/StockSchema.js')
const mongoose = require('mongoose');
const {ObjectId} = require('mongodb');
const db = require('../index.js')
const Login = require('../models/StockSchema.js');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const checktoken = require('./checktoken.js');
const cookieParser = require('cookie-parser');
const { collection } = require('../models/StockSchema.js');
const bcrypt = require('bcrypt');
dotenv.config();

const schemaoptions = {
  timestamps : {
    createdAt : 'created_at',
    updatedAt : 'updated_at'
  } 
}

const StockSchema = new mongoose.Schema({

  Modelnumber : {
    type: String,
    required : true,
    index : true
  },
  Itemtype : {
    type: String,
    required : true,
    index : true
  },
  Quantity:{
    type: Number,
    required: true
  },
  Company:{
    type: String,
    required : true
  },
  Mrp : {
    type: String,
    required : true
  }
},{
  timestamps : {
    createdAt : 'created_at',
    updatedAt : 'updated_at'
  } 
})

StockSchema.index({Modelnumber : 'text', Itemtype : 'text'})
const test = mongoose.model('test', StockSchema)

router.get("/home", (req, res) =>{
  res.send("hello there")
})

//login
router.get("/", (req, res)=>{
  res.render("login")
})

router.post('/', (req,res)=>{
  mongoose.model('login').findOne({Email : req.body.Email.trim()}, (err,user)=>{
    const Password = req.body.Password;
    if(!user){
        res.send("<h1>Cannot Access</h1>").status(401)
    }else{
        const token = jwt.sign({_id : user._id, Email : user.Email}, process.env.TOKEN_SECRET)
        res.cookie("authToken", token, {httpOnly : true})

        bcrypt.compare(Password, user.Password, (err, compared)=>{
            if(compared){
                res.redirect("list")
            }else{
                res.send("blunder")
            }
        })
    }
  })
})

//create stock
router.get("/createstock", checktoken, (req,res)=>{
  res.render("Statspage.ejs")
})

router.post("/createstock", checktoken, (req,res)=>{

  const Company = req.body.Company.trim()
  const capitalizeCompany = Company.charAt(0).toUpperCase() + Company.slice(1)

  const Itemtype = req.body.Itemtype.trim()
  const capitalizeItemType = Itemtype.charAt(0).toUpperCase() + Itemtype.slice(1)

  const stockitem = new test({
  Modelnumber : req.body.Modelnumber.trim(),
  Itemtype : capitalizeItemType,
  Quantity : req.body.Quantity,
  Mrp : req.body.Mrp,
  Company : capitalizeCompany
  });
  
  stockitem.save((err)=>{
    if(err){
      res.status(500)
    }else{
      res.redirect("./list")
     }
  })
})

//search
router.post("/list/search", checktoken, (req,res)=>{
  const Itemtype = req.body.type.trim()
  const capitalizeItemType = Itemtype.charAt(0).toUpperCase() + Itemtype.slice(1)

  var filterItemtype = capitalizeItemType;
  var filterSearch = req.body.Modelnumbersearch.trim();

  if(filterItemtype!=="" && filterSearch!== "" ){
    var filterParam = {Itemtype : {$regex : filterItemtype, $options : 'i'}, Modelnumber : {$regex : filterSearch, $options : 'i'}}
      
  }else if(filterItemtype == "" && filterSearch!= ""){
    var filterParam = {Modelnumber : {$regex : filterSearch, $options: 'i'}}

  }else if (filterItemtype!== "" && filterSearch== "") {
    var filterParam = {Itemtype : {$regex :  filterItemtype, $options : 'i'}}

  }

  mongoose.model('test').find(filterParam, (err, attributes)=>{
    if(err){
      res.status(500)
    }else{
      res.render("list", {
        attributes : attributes
      })
    }
  })
})

//editstock
router.get("/EditStock/:id", checktoken, (req,res)=>{
  mongoose.model('test').findById(req.params.id, (err, attributes)=>{
    if(err){
      res.status(500)
    }else{
      res.render("EditStock.ejs", {
        attributes : attributes
      })
    }
  })
})

router.post("/EditStock/", checktoken, (req,res) => {
  const Company = req.body.Company.trim()
  const capitalizeCompany = Company.charAt(0).toUpperCase() + Company.slice(1)

  const Itemtype = req.body.Itemtype.trim()
  const capitalizeItemType = Itemtype.charAt(0).toUpperCase() + Itemtype.slice(1)

  const stockitem = {
  Modelnumber : req.body.Modelnumber.trim(),
  Itemtype : capitalizeItemType,
  Quantity : req.body.Quantity,
  Mrp : req.body.Mrp,
  Company : capitalizeCompany
  }
  mongoose.model('test').findByIdAndUpdate({_id : req.body._id}, stockitem, { new:true }, (err, doc)=>{
    if(err){
      res.status(500)
    }else{
      res.redirect("list")
    }
  })
})

//logout
router.post("/logout", checktoken, (req,res)=>{
  res.clearCookie('authToken').redirect('/users')
  
})

//Listing Stock
router.get('/list', checktoken,(req,res) =>{
  mongoose.model('test').find((err,attributes)=>{
    if(err){
      res.status(500)
    }else{
      res.render("list.ejs", {
        attributes : attributes
      })
    }
  })
})


//delete stock
router.get("/Delete/:id", checktoken, (req,res)=>{
  mongoose.model('test').findByIdAndRemove(new ObjectId(req.params.id), (err, doc)=>{
    if(err){
      res.status(500)
    }else{
      res.redirect("../list")
    }
  })
})

module.exports = router;
