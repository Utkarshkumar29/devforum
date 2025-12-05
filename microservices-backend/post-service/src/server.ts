import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import postRoutes from "./routes/postRoutes";

dotenv.config()
const app = express()

const allowedOrigins = process.env.CLIENT_URL.split(",");
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.log("❌ CORS Blocked (Post Service):", origin);
      return callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST", "PATCH", "DELETE", "PUT"],
    credentials: true
  })
)
app.use(express.json());


app.use("/api/posts", postRoutes);

app.get("/", (req, res) => {
  res.send("Post Service Running");
});

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("Post DB connected")) 
  .catch((err) => console.error("Post DB connection error:", err));

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Post Service running on port ${PORT}`));
