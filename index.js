const express = require("express");
const fileUpload = require("express-fileupload"); // Import fileUpload
const app = express();

const userRoutes = require("./routes/User");
const profileRoutes = require("./routes/Profile");
const paymentRoutes = require("./routes/Payments");
const courseRoutes = require("./routes/Course");

const database = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { cloudinary } = require("./config/cloudinary");
const dotenv = require("dotenv").config();

const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(
    cors({
        origin: "http://localhost:3000", // Adjust this as needed
        credentials: true,
    })
);

app.use(
    fileUpload({
        useTempFiles: true,
        tempFileDir: "/tmp",
    })
);

// Database connection
const db = require('./config/database');
db.connect();

// Cloudinary connection
cloudinaryConnect(); // Ensure this is defined

// Routes
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/course", courseRoutes);
app.use("/api/v1/payment", paymentRoutes);

// Default route
app.get("/", (req, res) => {
    return res.json({
        success: true,
        message: "Your Server is Up and running.",
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`App is Running fine at Port ${PORT}`);
});