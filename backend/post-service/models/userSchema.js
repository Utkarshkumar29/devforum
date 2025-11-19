    const mongoose=require('mongoose')

    const userSchema=new mongoose.Schema(
        {
            id:{
                type:String,
                required:true,
                unique:true,
            },
            email:{
                type:String,
                required:true,
                unique:true,
            },
            firebase_uid:{
                type:String
            },
            email_verified:{
                type:Boolean,
                default:false
            },
            display_name:{
                type:String,
                required:true
            },
            photo_url:{
                type:String
            },
            created_at:{
                type:String,
                default:Date.now
            },
            last_login_at: {
                type: Date,
                default: Date.now,
            },
            password:{
                type:String,
                default:null
            },
            authProvider:{
                type:String,
                enum:['local','google'],
                default:'local'
            }
        },
        { timestamps:true }
    )

    const User=mongoose.model("User",userSchema)

    module.exports={ User }