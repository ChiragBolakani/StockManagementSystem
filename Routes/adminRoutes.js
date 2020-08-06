const express = require('express');
const app = express();
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const {ObjectId} = require('mongodb');
const checkadmin = require('./checkAdmin.js');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
// const Admin = require('../models/StockSchema.js');
const Login = require('../models/StockSchema.js');
dotenv.config();

router.get('/', (req,res)=>{
    res.render('adminLogin.ejs')
})

router.post('/', (req,res)=>{
    mongoose.model('admin').findOne({Email : req.body.Email.trim()}, (err,admin)=>{
        const Password = req.body.Password;
        if(!admin){
            res.status(401).send("<h1>Cannot Access</h1>")
        }else{
            const token = jwt.sign({_id : admin._id, Email : admin.Email}, process.env.ADMIN_SECRET)
            res.cookie("authToken", token, {httpOnly : true})
            
            bcrypt.compare(Password, admin.Password, (err, compared)=>{
                if(compared){
                    res.redirect("adminpanel")
                }else{
                    res.status(500)
                }
            })
        }
    })
})

// router.get("/test", (req,res)=>{
//         console.log(req.body)
//         const admin = new Admin();
      
//         admin.Email = "kingammar";
//         admin.Password = "121199";
    
//         bcrypt.hash(admin.Password, 10, function(err, hash) {
//            admin.Password = hash;
//            admin.save((err, admin)=>{
//             if(err){
//               console.log(err)
//             }else{
//               res.send(admin)
//             }
//           }) 
//         });
//     })

router.get('/adminpanel', checkadmin, (req,res)=>{
    mongoose.model('login').find((err,attributes)=>{
        if(err){
            res.status(404)
        }else{
            res.render("usersList", {
                attributes : attributes
            })        
        }
    })
})

router.get('/adminpanel/createuser', checkadmin, (req,res)=>{
    res.render("createUser.ejs")
})

router.post("/adminpanel/createuser", checkadmin, (req,res)=>{

    const newUser = new Login({
       Email : req.body.Email.trim(),
       Password : req.body.Password
   })
   
   bcrypt.hash(req.body.Password.trim(), 10, (err,hash)=>{
       if(err){
           res.status(400)
       }else{
           newUser.Password = hash;
           newUser.save((err,user)=>{
               if(err){
                   res.status(400).send('<h1>Could Not Create User</h1>')
               }else{
                   res.redirect("/admin/adminpanel")
               }
           })
       }
   })
})

router.get("/adminpanel/Delete/:id", checkadmin, (req,res)=>{
    mongoose.model('login').findByIdAndRemove(new ObjectId(req.params.id), (err, doc)=>{
      if(err){
        res.status(500)
      }else{
        res.redirect("../")
      }
    })
})


router.post("/logout", checkadmin, (req,res)=>{
    res.clearCookie('authToken').redirect('/admin')
})

module.exports = router;
