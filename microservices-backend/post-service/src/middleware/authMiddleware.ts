const jwt=require('jsonwebtoken')
const { User } = require("../models/userSchema")

const protect=async(req,res,next)=>{
    try {
        let token

        if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
            token=req.headers.authorization.split(' ')[1]
        }
        
        if(!token){
            return res.status(401).send({
                success:false,
                message:"Unauthorised User"
            })
        }

        const decoded=jwt.verify(token,process.env.JWT_SECRET)
        const user = await User.findById(decoded.id).select('-password')
        if(!user){
            return res.status(401).send({
                success:false,
                message:"User not found or invalid token"
            })
        }

        req.user=user
        next()
    } catch (error) {
        console.log(error)
        res.status(500).send({
            message:"Internal Server Error",
            error:error.message
        })
    }
}

module.exports= { protect }