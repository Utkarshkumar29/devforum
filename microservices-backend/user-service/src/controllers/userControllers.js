const jwt=require('jsonwebtoken')
const bcrypt=require('bcrypt')
const { User }=require('../models/userSchema')
const { v4: uuidv4 } = require('uuid')

const createUser=async(req,res)=>{
    const {
        email,
        password,
        display_name,
        photo_url,
        authProvider
    }=req.body
    try {
        const existingUser=await User.findOne({email})
        if(existingUser){
            if(authProvider=="google"){
                const token=jwt.sign(
                    {id:existingUser._id,email:existingUser.email},
                    process.env.JWT_SECRET,
                    {expiresIn:"7d"}
                )

                return res.status(200).send({
                    message:"Logged in successfully",
                    token,
                    user:{
                        email: existingUser.email,
                        display_name: existingUser.display_name,
                        photo_url: existingUser.photo_url,
                        id: existingUser.id
                    }
                })
            }
            if(existingUser.authProvider=="google"){
                return res.status(400).send({
                    message:"This email is registered via Google. Please set your password first."
                })
            }
            return res.status(400).send({ message: "Email already exists" })
        }
        
        let hashedPassword=null
        if (authProvider === "local") {
            hashedPassword = await bcrypt.hash(password, 10);
        }
        const newUser=new User({
            id: `slug-${uuidv4()}`,
            email,
            display_name,
            photo_url,
            password: hashedPassword,
            authProvider
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
                email: newUser.email,
                display_name: newUser.display_name,
                photo_url: newUser.photo_url,
                id:newUser.id
            }
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Server error', error: error.message })
    }
}

const userlogin=async(req,res)=>{
    const {email,password,authProvider}=req.body
    try {
        const existingUser=await User.findOne({email})
        if(!existingUser){
            return res.status(404).send({message:"User not found! Invalid email"})
        }
        if(authProvider=="google"){
            if(existingUser.authProvider=="local"){
                return res.status(400).send({
                    message:"This email is registered as a local account. Please login with password."
                })
            }
            const token = jwt.sign(
                { id: existingUser._id, email: existingUser.email },
                process.env.JWT_SECRET,
                { expiresIn: '7d' }
            )

            return res.status(200).send({
                message: "Logged in successfully",
                token,
                user: {
                    id: existingUser.id,
                    email: existingUser.email,
                    display_name: existingUser.display_name,
                    photo_url: existingUser.photo_url
                }
            });
        }

        if(authProvider=="local"){
            if (existingUser.authProvider === "google") {
                return res.status(400).send({
                    message: "This email was registered using Google. Please login with Google."
                });
            }
            const checkPasword=bcrypt.compare(password,existingUser.password)
            if(!checkPasword){
                return res.status(401).send({
                    message:"Incorrect Passsword"
                })
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
                    id: existingUser.id,
                    email: existingUser.email,
                    display_name: existingUser.display_name,
                    photo_url: existingUser.photo_url
                },
            })
            }
        
        return res.status(400).send({ message: "Invalid auth provider" })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            message:"Internal Server Error",
            error:error.message
        })
    }
}

module.exports={ userlogin, createUser }