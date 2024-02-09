const app = require("./app");
const colors = require("colors");
const dotenv = require("dotenv");
const connectDB = require("./db/database");
const cloudinary = require("cloudinary");
const RazorPay = require("razorpay");
const nodeCron = require("node-cron");
const Stats = require("./models/statsModel")

// Main Config
dotenv.config();
connectDB();

// Clodinary Config
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

nodeCron.schedule("0 0 0 1 * *",async() => {
  try {
    await Stats.create({});
  } catch (error) {
    console.log(error)
  }
});

// Port Config
const port = process.env.PORT || 8080;

// Local Server Demo
app.get("/", (req, res) => {
  res.send("Server Working Properly || Origin Chnaged || Stats Added");
});

// Listening the port
app.listen(port, () => {
  console.log(`Server Started Running Successfully On The Port:${port}`.bold);
});
