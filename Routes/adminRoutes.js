const express = require('express');
const app = express();
const router = express.Router();
const Admin = require('../models/StockSchema.js');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

router.get('/', (req,res)=>{
    res.render('adminLogin.ejs')
})

router.post('/', (req,res)=>{
    //some bcrypt code here
    Admin.findOne({Email : req.body.Email, Password : req.body.Password}, (err,admin)=>{
        if(!admin){
            res.send("cannot access")
        }else{
            res.redirect("adminpanel")
        }
    })
})

router.get('/adminpanel', (req,res)=>{
    res.send('after login inside admin panel')
})

// router.get("/test", (req,res)=>{
//     console.log(req.body)
//     const admin = new Admin();
  
//     admin.Email = "admin@gmail.com";
//     admin.Password = "admin";

//     bcrypt.hash(admin.Password, 10, function(err, hash) {
//        admin.Password = hash;
//        admin.save((err, admin)=>{
//         if(err){
//           console.log(err)
//         }else{
//           res.send(admin)
//         }
//       }) 
//     });
// })


  

module.exports = router;