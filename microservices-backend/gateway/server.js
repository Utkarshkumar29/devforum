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

    // ❌ REMOVE or COMMENT OUT this block
    // pathRewrite: {
    //   "^/api/users": "",
    // },

    onProxyReq: (proxyReq, req) => {
      // Log to verify the path being sent
      console.log("🚀 PROXY:", req.originalUrl, "=>", proxyReq.path); 
    },

    onProxyRes: (proxyRes, req) => {
      proxyRes.headers["Access-Control-Allow-Origin"] = req.headers.origin;
      proxyRes.headers["Access-Control-Allow-Credentials"] = "true";
    },
  })
);

// -------- POST SERVICE PROXY --------
app.use(
  "/api/posts",
  createProxyMiddleware({
    target: process.env.POST_SERVICE_URL,
    changeOrigin: true,
    onProxyRes: (proxyRes, req) => {
      proxyRes.headers["Access-Control-Allow-Origin"] = req.headers.origin;
      proxyRes.headers["Access-Control-Allow-Credentials"] = "true";
    },
  })
);

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
