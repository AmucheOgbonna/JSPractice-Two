const mongoose = require("mongoose");
const Schema = mongoose.Schema

const PostSchema = new Schema(
    {
   user_id:{
        type:Schema.Types.ObjectId,
        ref:"user",
        required:true,
        unique:true
    },
    body:{
        type:String,
        required:true,
    },
    title:{
        type:String,
        required:true,
    },
},
{
    timestamps:{
        createdAt:"created_at",
        updatedAt:"updated_at"
    }
})

module.exports = mongoose.model('post', PostSchema)