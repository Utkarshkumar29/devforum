const express=require("express")
const router=express.Router()
const { uploadFile }=require("../controllers/uploadControllers")
const multer=require("multer")

const upload=multer({storage:multer.memoryStorage()})

router.post("/upload",upload.single("file"),uploadFile)

module.exports = router