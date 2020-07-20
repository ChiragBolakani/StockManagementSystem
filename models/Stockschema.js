const mongoose = require('mongoose');

const StockSchema = new mongoose.Schema({
  Modelnumber : {
    type: String,
    required : true,
    index : true
  },
  Itemtype : {
    type: String,
    lowercase : true,
    required : true
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
  },
  Date : {
    type : Date,
    default : Date.now
  }
},{
  timestamps : {
    createdAt : 'created_at',
    updatedAt : 'updated_at'
  }
})

const LoginSchema = new mongoose.Schema({
  Email : {
    type: String,
    required : true
  },
  Password : {
    type : String,
    required : true
  }
},{
  timestamps : {
    createdAt : 'created_at',
    updatedAt : 'updated_at'
  }
})

const adminSchema = new mongoose.Schema({
  Email : {
  type : String, 
  required : true
  }, 
  Password : {
  type : String, 
  required : true
  }
})


StockSchema.index({Modelnumber : 'text'})

const Login = mongoose.model('login', LoginSchema)
const Stock = mongoose.model('stock', StockSchema)
const Admin = mongoose.model('admin', adminSchema)

module.exports = Stock;
module.exports = Login;
module.exports = Admin;