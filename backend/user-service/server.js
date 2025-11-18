const express=require('express')
const app=express()
const cors=require('cors')
const dotenv=require('dotenv')
const mongoose=require('mongoose')
const userRoutes = require("./routes/userRoutes")

dotenv.config()

app.use(cors({
    methods:["POST","GET","PATCH","PUT","DELETE"],
    origin:process.env.CLIENT_URL,
    credentials:true
}))

app.use(express.json())
app.use("/", userRoutes);

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("User DB connected"))
.catch((err) => console.error("User DB connection error:", err));


{/*app.listen(process.env.PORT || 5001, () => console.log(`User Service running on port ${process.env.PORT}`));
const PORT = process.env.PORT || 5001;*/}

app.listen(process.env.PORT, '0.0.0.0', () => {
  console.log(`User Service running on port ${process.env.PORT}`);
});
