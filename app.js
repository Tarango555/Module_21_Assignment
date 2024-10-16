import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import mongoose from "mongoose";
import cookieParser from 'cookie-parser';
import {DATABASE, MAX_JSON_SIZE, PORT, REQUEST_NUMBER, REQUEST_TIME, MESSAGE, URL_ENCODE, WEB_CACHE} from "./app/config/config.js";
import router from "./routes/api.js";

const app= express();

// Serve static files from the "uploads" folder
app.use('/uploads', express.static('uploads'));

//App use default middleware
app.use(cors());
app.use(express.json({limit: MAX_JSON_SIZE}));
app.use(express.urlencoded({extended: URL_ENCODE}));
app.use(helmet());
app.use(cookieParser());

//App use limiter
const limiter= rateLimit({
    windowMs: REQUEST_TIME,
    max: REQUEST_NUMBER,
    message: MESSAGE
});
app.use(limiter);

//Cache
app.set('etag', WEB_CACHE);

//Database connection
mongoose.connect(DATABASE, {autoIndex: true}).then(()=>{
    console.log("MongoDB connected");
}).catch(()=>{
    console.log("MongoDB disconnected");
});

app.use("/api", router);

app.listen(PORT, ()=>{
    console.log(`Server started on port ${PORT}...`);
});