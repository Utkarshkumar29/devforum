const express=require("express")
const router=express.Router()
const { createUser, userlogin } = require("../controllers/userControllers")

router.post('/signUp',createUser)
router.post('/login',userlogin)

module.exports=router
