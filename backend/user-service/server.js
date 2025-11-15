const express=require('express')
const app=express()
const cors=require('cors')
const dotenv=require('dotenv')
const mongoose=require('mongoose')
const userRoutes = require("./routes/userRoutes")

dotenv.config()

app.use(cors({
    methods:["POST","GET","PATCH","PUT","DELTET"],
    origin:process.env.CLIENT_URL,
    credentials:true
}))

app.use(express.json())
app.use("/api/users", userRoutes);

app.get('/',(req,res)=>{
    res.send("User Services are running")
})

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log("Post DB connected"))
    .catch((err) => console.error("Post DB connection error:", err))

app.listen(process.env.PORT || 5001, () => console.log(`User Service running on port ${process.env.PORT}`));