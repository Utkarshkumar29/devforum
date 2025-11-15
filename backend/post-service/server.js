const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");
const postRoutes = require("./routes/postRoutes");

dotenv.config();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL,
  methods: ["GET", "POST", "PATCH", "DELETE", "PUT"],
  credentials: true
}));
app.use(express.json());

// Routes
app.use("/api/posts", postRoutes);

app.get("/", (req, res) => {
  res.send("Post Service Running");
});

// Post DB only
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("Post DB connected"))
  .catch((err) => console.error("Post DB connection error:", err));

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Post Service running on port ${PORT}`));
