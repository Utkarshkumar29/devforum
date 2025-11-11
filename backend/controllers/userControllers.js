const jwt=require('jsonwebtoken')
const bcrypt=require('bcrypt')
const { User }=require('../models/userSchema')
const { v4: uuidv4 } = require('uuid')

const createUser=async(req,res)=>{
    const {
        email,
        firebase_uid,
        display_name,
        photo_url,
        password
    }=req.body
    try {
        const existingUser=await User.findOne({email})
        if(existingUser){
            return res.status(400).send({message:"Email already exists"})
        }
        const hashedPassword=await bcrypt.hash(password, 10)
        const newUser=new User({
            id:`slug-${uuidv4()}`,
            email,
            email,
            firebase_uid,
            display_name,
            photo_url,
            password: hashedPassword,
        })
        await newUser.save()

        const token=jwt.sign(
            {id:newUser._id,email:newUser.email},
            process.env.JWT_SECRET,
            {expiresIn:'7d'}
        )
        res.status(200).send({
            message:"User created successfully",
            token,
            user: {
                id: newUser._id,
                email: newUser.email,
                display_name: newUser.display_name,
                photo_url: newUser.photo_url,
                slug:newUser.id
            }
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Server error', error: error.message })
    }
}

const userlogin=async(req,res)=>{
    const {email,password}=req.body
    try {
        const existingUser=await User.findOne({email})
        if(!existingUser){
            return res.status(404).send({message:"User not found"})
        }
        const comparePassword=bcrypt.compareSync(password,existingUser.password)
        if(!comparePassword){
            return res.status(404).send({message:"User not found"})
        }
        const token=jwt.sign(
            {id:existingUser._id,email:existingUser.email},
            process.env.JWT_SECRET,
            {expiresIn:'7d'}
        )
        res.status(200).send({
            message:"Logged in successfully",
            token,
            user: {
                id: existingUser._id,
                email: existingUser.email,
                display_name: existingUser.display_name,
                photo_url: existingUser.photo_url
            },
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            message:"Internal Server Error",
            error:error.message
        })
    }
}

module.exports={ userlogin, createUser }