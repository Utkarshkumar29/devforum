const createPost=async(req,res)=>{
    const {
        
    }=req.body
    try {
        
    } catch (error) {
        console.log(error)
        res.status(500).send({
            message:"Internal Server error",
            error:error.message
        })
    }
}