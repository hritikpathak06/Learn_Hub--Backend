const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const {ErrorMiddleware} = require("./middlewares/Error");


// Middlewares
app.use(express.json({limit:"1000mb"}));
app.use(morgan("common"));
app.use(bodyParser.urlencoded({extended:true,limit:"1000mb"}));
app.use(cookieParser());


app.use(cors({
    origin:"http://localhost:3000",
    // origin:"https://learnhub-tau.vercel.app",
    credentials:true
}));



// Routes Path
const courseRoutes = require("./routes/courseRoutes");
const userRoutes = require("./routes/userRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const otherRoutes = require("./routes/otherRoutes");

// Routes
app.use("/api/v1",courseRoutes);
app.use("/api/v1",userRoutes);
app.use("/api/v1",paymentRoutes);
app.use("/api/v1",otherRoutes);



module.exports = app

app.use(ErrorMiddleware);
