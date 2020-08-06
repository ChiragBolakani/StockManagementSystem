const express =  require('express');
const mongoose = require('mongoose');
const ejs = require('ejs');
const app = express();
const cookieParser = require('cookie-parser');
const nocache = require('nocache');

//set view engine
app.set('view engine', 'ejs');


//caching headers
app.use(nocache())

//set cookie parser
app.use(cookieParser())

//bodyparser
app.use(express.json())
app.use(express.urlencoded({extended : true}))

//routes
app.use('/users/', require('./Routes/routes.js'))
app.use('/admin/', require('./Routes/adminRoutes.js'))

//conect to mongodb
const db = process.env.MONGO_URI
mongoose.connect(db, {useNewUrlParser : true, useUnifiedTopology : true, useFindAndModify : false,useCreateIndex : true})
.then(app.listen(1234 || process.env.PORT))
.catch(err=> console.log(err))

