import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import postRoutes from "./routes/postRoutes";

dotenv.config()
const app = express()

app.use(cors({
  origin: process.env.CLIENT_URL,
  methods: ["GET", "POST", "PATCH", "DELETE", "PUT"],
  credentials: true
}));
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
