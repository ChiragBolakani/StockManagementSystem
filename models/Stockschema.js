const mongoose = require('mongoose');

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
}, {collection : 'logins'})

const adminSchema = new mongoose.Schema({
  Email : {
  type : String
  }, 
  Password : {
  type : String
  }
}, {collection : 'admins'})

module.exports = mongoose.model('admin', adminSchema)
const Login = mongoose.model('login', LoginSchema);
module.exports = Login
