const express=require('express')
const app=express()
const cors=require('cors')
const dotenv=require('dotenv')
const { createProxyMiddleware }=require('http-proxy-middleware')

dotenv.config()
app.use(express.json());
app.use(cors({
    origin:process.env.CLIENT_URL,
    credentials:true
}))

app.use('/api/users', (req, res, next) => {
  console.log(`API Gateway - Incoming request: ${req.method} ${req.originalUrl}`);
  next();
});

app.use('/api/users', createProxyMiddleware({
  target: process.env.USER_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: { '^/api/users': '' },
  onProxyRes: (proxyRes, req, res) => {
    console.log(`API Gateway - Response status: ${proxyRes.statusCode} for ${req.method} ${req.originalUrl}`);
  },
  onError: (err, req, res) => {
    console.error('API Gateway proxy error:', err);
    res.status(500).json({ error: 'Proxy error', details: err.message });
  }
}));

app.use('/api/posts',createProxyMiddleware({
    target:process.env.POST_SERVICE_URL,
    changeOrigin:true
}))

app.get('/',(req,res)=>{
    res.send("API Gateway Running")
})

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Gateway running on port ${PORT}`));