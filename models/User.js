const { default: mongoose } = require('mongoose');
const moongoose = require('mongoose');

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
    },
    password:{
        type:String,
        required:true,
        minlength:6,
    },
    avantar:{
        type:String,
        default:"",
    }
},{timestamps:true}
)

module.exports=moongoose.model('User',userSchema);