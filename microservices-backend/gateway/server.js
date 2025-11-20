const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();
const CLIENT = process.env.CLIENT_URL || "http://localhost:3000";
const PORT = process.env.PORT || 8000;

// 1. CORS - Handle it here so User Service doesn't have to worry about it
app.use(cors({
  origin: CLIENT,
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

// ❗ IMPORTANT: Do NOT use express.json() here.
// Let the data pass through raw to the User Service.

// 2. USER SERVICE PROXY
app.use(
  "/api/users",
  createProxyMiddleware({
    // FIX: Target includes the base path because Express strips it
    target: process.env.USER_SERVICE_URL + '/api/users', 
    changeOrigin: true,
    onProxyRes: (proxyRes) => {
      proxyRes.headers["Access-Control-Allow-Origin"] = CLIENT;
      proxyRes.headers["Access-Control-Allow-Credentials"] = "true";
    },
    onError: (err, req, res) => {
      console.error("🔥 PROXY ERROR:", err.code);
      console.error("   Trying to reach:", process.env.USER_SERVICE_URL + req.url);
      res.status(500).json({ message: "Gateway could not reach User Service", error: err.code });
    }
  })
);

// 3. POST SERVICE PROXY
app.use(
  "/api/posts",
  createProxyMiddleware({
    target: process.env.POST_SERVICE_URL + '/api/posts',
    changeOrigin: true,
    onProxyRes: (proxyRes) => {
      proxyRes.headers["Access-Control-Allow-Origin"] = CLIENT;
      proxyRes.headers["Access-Control-Allow-Credentials"] = "true";
    },
  })
);

app.get("/", (req, res) => {
  res.send("API Gateway Running 🚀");
});

app.listen(PORT, () => {
  console.log(`---------------------------------------`);
  console.log(`✅ Gateway running on port ${PORT}`);
  console.log(`🔗 Target User Service: ${process.env.USER_SERVICE_URL}`);
  console.log(`---------------------------------------`);
});