var mongoose = require('mongoose');
const passport = require('passport');
var plm = require('passport-local-mongoose');

mongoose.connect("mongodb://127.0.0.1:27017/instaCloan");

var userSchema = mongoose.Schema({
    username:{
        type:String
    },
    email:{
        type:String
    },
    name:{
        type:String
    },
    dp:{
        type:String,
        default:"https://images.unsplash.com/photo-1700044568474-38f1fc89f7ef?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDEwfHx8ZW58MHx8fHx8"
    },
    posts:{
        type:[{type:mongoose.Schema.Types.ObjectId,ref:"post"}]
    },
    bio:{
        type:String
    }, 
    password:{
        type:String
    } 

}); 

userSchema.plugin(plm);

module.exports = mongoose.model("user",userSchema)