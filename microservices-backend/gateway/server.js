const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

const allowedOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(",")
  : ["http://localhost:3000"];

console.log("Allowed Origins:", allowedOrigins);

// -------- CORS --------
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

// -------- LOGGING --------
app.use("/api/users", (req, res, next) => {
  console.log("👉 Incoming:", req.originalUrl);
  console.log("👉 Stripped Path:", req.url);
  next();
});

// -------- USER SERVICE PROXY --------
// -------- USER SERVICE PROXY --------
app.use(
  "/api/users",
  createProxyMiddleware({
    target: process.env.USER_SERVICE_URL,
    changeOrigin: true,

    // ⭐ RE-ADD THE NECESSARY PREFIX ⭐
    // The incoming path is now '/login' due to Express stripping '/api/users'.
    // We must rewrite it back to '/api/users/login' for the target service.
    pathRewrite: (path, req) => {
      // path here will be '/login' (req.url)
      // We return '/api/users' + '/login'
      return "/api/users" + path;
    },

    onProxyReq: (proxyReq, req) => {
      // 🔍 DEBUG: Log the FINAL path sent to the service
      console.log("🚀 PROXY FINAL PATH:", proxyReq.path); 
    },
    
    // ... rest of your configuration (onProxyRes, etc.)
  })
);

// -------- POST SERVICE PROXY --------
// -------- POST SERVICE PROXY --------
app.use(
  "/api/posts",
  createProxyMiddleware({
    target: process.env.POST_SERVICE_URL,
    changeOrigin: true,

    // ⭐ CRITICAL FIX: RE-ADD THE NECESSARY PREFIX ⭐
    // Express stripped '/api/posts', so we rewrite the path to re-include it.
    pathRewrite: (path, req) => {
      // If path comes in as '/getPosts', this returns '/api/posts/getPosts'
      return "/api/posts" + path;
    },
    
    // Add logging to verify the path
    onProxyReq: (proxyReq, req) => {
      console.log("🚀 POST PROXY FINAL PATH:", proxyReq.path); 
    },

    onProxyRes: (proxyRes, req) => {
      proxyRes.headers["Access-Control-Allow-Origin"] = req.headers.origin;
      proxyRes.headers["Access-Control-Allow-Credentials"] = "true";
    },
  })
)

// -------- ROOT --------
app.get("/", (req, res) => {
  res.send("API Gateway Running 🚀");
});

// -------- START SERVER --------
app.listen(PORT, () => {
  console.log("---------------------------------------");
  console.log(`✅ Gateway running on port ${PORT}`);
  console.log("🔗 Allowed Origins:", allowedOrigins);
  console.log("---------------------------------------");
});
