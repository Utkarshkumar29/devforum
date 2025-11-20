const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoutes");

dotenv.config();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

app.use(express.json());

app.use("/api/users", userRoutes);

app.get('/',(req,res)=>{
  res.send("User Service OK")
})

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("User DB connected"))
  .catch(err => console.error("DB error:", err));

app.listen(process.env.PORT, () => {
  console.log(`User Service running on ${process.env.PORT}`);
});
