const mongoose = require('mongoose');

const WorkSpaceSchema =new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true,
    },
    description:{
        type:String,
        default:"",
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true,
    },
    members:[
    {
        user:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'User',
        },
        role:{
            type:String,
            enum:['admin','member'],
            default:'member'
        }
    }],
    boards:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Board',
    },

},{timestamps:true})

module.exports=mongoose.model('WorkSpace',WorkSpaceSchema);