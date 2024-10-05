const mongoose=require('mongoose');


const loginSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }
})
const collection=new mongoose.model('users',loginSchema);

module.exports=collection;