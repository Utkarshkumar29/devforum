const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoutes");

dotenv.config();

// ⭐ Allow multiple client origins
const allowedOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(",")
  : ["http://localhost:3000"];

console.log("Allowed CORS Origins (User Service):", allowedOrigins);

app.use(
  cors({
    origin: function (origin, callback) {
      // allow Postman / server-to-server requests
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.log("❌ CORS Blocked (User Service):", origin);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

app.use(express.json());

app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
  res.send("User Service OK");
});

// Database
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("User DB connected"))
  .catch((err) => console.error("DB error:", err));

// Run server
app.listen(process.env.PORT, () => {
  console.log(`User Service running on ${process.env.PORT}`);
});
