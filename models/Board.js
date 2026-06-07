const mongoose = require('mongoose');

const BoardSchema =new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true,
    },
    workspace:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'WorkSpace',
    },
    color:{
        type:String,
        default:"#0079bf",
    },
    columns: [
      {
        name: {
          type: String,
          required: true
        },
        order: {
          type: Number,
          default: 0
        }
      }
    ],
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
    }
},{timestamps:true})

module.exports = mongoose.model('Board',BoardSchema);