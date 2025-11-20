const express=require("express")
const Router=express.Router()
const { protect } =require('../middleware/authMiddleware')
const { createPost } =require('../controllers/postControllers')

Router.post('/posts/createPost',protect,createPost)

module.exports= Router