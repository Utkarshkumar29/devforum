const {bucket}=require("../config/firebase")

const uploadFile=async(req,res)=>{
    try {
        if(!req.file){
            return res.status(400).json({message:"No file uploaded"})
        }
        const blob=bucket.file(req.file.originalname) //blob is short for “binary large object” — a common term for files or data objects stored in cloud systems
        const blobStream=blob.createWriteStream({ //opens a stream that allows you to write the file’s data into Firebase Storage
            metadata:{ //defines additional info — here you set the file’s contentType (like image/png, application/pdf, etc.)
                contentType:req.file.mimetype,
            }
        })

        blobStream.on("error",(err)=>{
            console.log(err)
            res.status(500).json({
                message:"Upload failed"
            })
        })

        blobStream.on("finish",async()=>{
            const publicURL=`https://storage.googleapis.com/${bucket.name}/${blob.name}`
            res.status(200).json({
                message:"File uploaded successfully",
                url:publicURL
            })
        })

        blobStream.end(req.file.buffer)
    } catch (error) {
        console.log(err)
        res.status(500).json({
            message:"Something went wrong"
        })
    }
}

module.exports = { uploadFile }