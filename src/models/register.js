const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
  firstname:{
      type:String,
      required:true,
      trim: true
  },
  lastname:{
    type:String,
    required:true,
    trim: true
  },
  email: {
    type:String,
    required:true,
    trim:true,
    unique:true
  },
  gender: {
      type:String,
      required:true,
      trim:true
  },
  phone:{
    type:Number,
    required:true,
    trim:true,
    unique:true
  },
  age: {
    type:Number,
    required:true,
    trim:true
  },
  password: {
    type:String,
    required:true,
    trim:true
  },
  token: {
    default: "",
    type: String,
    trim: true
  } 
})


userSchema.pre('save', async function(next){
  if(this.isModified('password')){
    this.password = await bcrypt.hash(this.password, 10);
  }
  next(); 
})


const User = new mongoose.model('user', userSchema);
module.exports = User;