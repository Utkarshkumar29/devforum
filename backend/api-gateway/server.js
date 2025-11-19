// server.js
const express = require("express");
const cors = require("cors");
const { createProxyMiddleware } = require("http-proxy-middleware");
const dotenv = require("dotenv");

dotenv.config();
const app = express();

// ---------------- CORS ----------------
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
    allowedHeaders: "*",
    methods: "*",
  })
);

// ---------------- LOG REQUESTS ----------------
app.use((req, res, next) => {
  console.log("GW RECEIVED →", req.method, req.url);
  next();
});

// ---------------- USER SERVICE PROXY (NO REWRITE) ----------------
app.use(
  "/api/users",
  createProxyMiddleware({
    target: process.env.USER_SERVICE_URL, // http://localhost:5001
    changeOrigin: true,

    onProxyReq(proxyReq, req) {
      console.log(
        `GW → Forwarding ${req.method} ${req.originalUrl} → ${process.env.USER_SERVICE_URL}${req.originalUrl}`
      );
    },

    onProxyRes(proxyRes, req) {
      console.log(
        `GW ← Response ${proxyRes.statusCode} for ${req.method} ${req.originalUrl}`
      );
    },
  })
);

// ---------------- POST SERVICE PROXY (NO REWRITE) ----------------
app.use(
  "/api/posts",
  createProxyMiddleware({
    target: process.env.POST_SERVICE_URL, // http://localhost:5002
    changeOrigin: true,
  })
);

// ---------------- BODY PARSER AFTER PROXY ----------------
app.use(express.json());

// ---------------- ROOT CHECK ----------------
app.get("/", (req, res) => {
  res.send("API Gateway running.");
});

// ---------------- START SERVER ----------------
const PORT = process.env.PORT || 8000;
app.listen(PORT, "0.0.0.0", () =>
  console.log(`API Gateway running on port ${PORT}`)
);
