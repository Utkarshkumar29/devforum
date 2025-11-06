const express = require("express")
const app = express()
const dotenv = require("dotenv")
const cors = require("cors")
const mongoose = require("mongoose")
const uploadRoutes = require("./routes/uploadRoutes")
const testRoutes = require("./routes/testRoutes")

dotenv.config()

// Middleware
app.use(cors())
app.use(express.json())

// Routes
app.use("/api", uploadRoutes)
app.use("/api",testRoutes)


app.get("/", (req, res) => {
  res.send("Server is running with nodemon!")
})

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err))

// Start server
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running at port ${PORT}`)
})
