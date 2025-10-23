import express from "express";
import cors from "cors";
// import cookieParser from 'cookie-parser';

// initializing express application
const app = express();

//basic app confiduration
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
// app.use(cookieParser());

// cors configuration
app.use(
    cors({
        origin: process.env.CORS_ORIGIN?.split(",") || "http://localhost:5173",
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);

// Routes import
import healthCheckRouter from "./routes/healthCheck.routes.js";

// routes
app.use("/api/v1/health", healthCheckRouter);

app.get("/", (req, res) => {
    res.send("Welcome to Nawaz's API");
});

export default app;
