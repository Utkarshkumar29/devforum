const express=require('express')
const app=express()
const cors=require('cors')
const dotenv=require('dotenv')
const { createProxyMiddleware }=require('http-proxy-middleware')
const bycrt=require("bycrpt")

dotenv.config()
app.use(cors({
    origin:process.env.CLIENT_URL,
    credentials:true
}))

app.use('/api/users',createProxyMiddleware({
    target:process.env.USER_SERVICE_URL,
    changeOrigin:true
}))

app.use('/api/posts',createProxyMiddleware({
    target:process.env.POST_SERVICE_URL,
    changeOrigin:true
}))

app.get('/',(req,res)=>{
    res.send("API Gateway Running")
})

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Gateway running on port ${PORT}`));