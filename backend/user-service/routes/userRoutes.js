const express=require("express")
const router=express.Router()
const { createUser, userlogin } = require("../controllers/userControllers")

router.post('/user/signUp',createUser)
router.post('/user/login',userlogin)

module.exports=router
