const mongoose=require('mongoose')

const post=new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    slug:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    likes:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    }],
    comments:[{
        user:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        },
        text:String,
        createdAt: { type: Date, default: Date.now },
    }],
    createdAt: { type: Date, default: Date.now },
})

const postSchema=mongoose.model("Post",post)

module.exports={postSchema}