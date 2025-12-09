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

// FIX 1: Handle preflight before proxy
app.use((req, res, next) => {
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Origin", req.headers.origin || "*");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
    return res.sendStatus(200);
  }
  next();
});

// Normal CORS
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);

      console.log("❌ CORS Blocked:", origin);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

// Proxy response headers
const setProxyHeaders = (proxyRes, req) => {
  proxyRes.headers["Access-Control-Allow-Origin"] = req.headers.origin;
  proxyRes.headers["Access-Control-Allow-Credentials"] = "true";
};

// USER SERVICE PROXY
app.use(
  "/api/users",
  createProxyMiddleware({
    target: process.env.USER_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: {
      "^/api/users": "",
    },
    onProxyRes: setProxyHeaders,
    onError: (err, req, res) => {
      console.error("🔥 USER SERVICE ERROR:", err.code);
      res.status(500).json({ message: "User Service unreachable", error: err.code });
    },
  })
);


// POST SERVICE PROXY
app.use(
  "/api/posts",
  createProxyMiddleware({
    target: process.env.POST_SERVICE_URL, // FIX 2
    changeOrigin: true,
    onProxyRes: setProxyHeaders,
  })
);

app.get("/", (req, res) => {
  res.send("API Gateway Running 🚀");
});

app.listen(PORT, () => {
  console.log(`---------------------------------------`);
  console.log(`✅ Gateway running on port ${PORT}`);
  console.log(`🔗 Allowed Origins:`, allowedOrigins);
  console.log(`---------------------------------------`);
});
