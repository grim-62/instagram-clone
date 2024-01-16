var mongoose = require('mongoose');

var postSchema = mongoose.Schema({
    Image:{
        type:String
    },
    caption:{
        type:String
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    date:{
        type:Date,
        default:Date.now()
    },
    likes:[{
        type:mongoose.Schema.Types.ObjectId ,
        ref:"user"
    }]
  

});

module.exports = mongoose.model("post",postSchema)