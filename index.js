const express =  require('express');
const mongoose = require('mongoose');
const ejs = require('ejs');
const app = express();
const cookieParser = require('cookie-parser');

//set view engine
app.set('view engine', 'ejs');

//set cookie parser
app.use(cookieParser())

//bodyparser
app.use(express.json())
app.use(express.urlencoded({exteded : false}))

//routes
app.use('/users/', require('./Routes/routes.js'))
app.use('/admin/', require('./Routes/adminRoutes.js'))

//conect to mongodb
const db = 'mongodb+srv://chiragbolakani:chirag2016@mynodeapp-llu7u.mongodb.net/test?retryWrites=true&w=majority';
mongoose.connect(db, {useNewUrlParser : true})
 .then(() => console.log("mongodb connected"))
 .catch(err => console.log(err));

app.listen(1234, console.log("listening to port 1234"));

module.exports = db;
