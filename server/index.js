import express from "express";
import dotenv from "dotenv";
import connectDB from "./database/dbConnect.js";
import userRoute from "./routes/userRoutes.js"
import cookieParser from "cookie-parser";
import cors from "cors";
import courseRoute from "./routes/courseRoute.js";
import purchaseRoute from "./routes/purchaseCourseRoute.js";
import mediaRoute from "./routes/mediaRoute.js";
import courseProgressRoute from "./routes/courseProgressRoute.js"

dotenv.config({});

//calling database
connectDB();

const app=express();

const PORT=process.env.PORT||3000;

//default middleware
app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin:process.env.FRONTEND_URL,
    credentials:true
}))

//Apis
app.use("/api/v1/media",mediaRoute);
app.use("/api/v1/user",userRoute);
app.use("/api/v1/course",courseRoute);
app.use("/api/v1/purchase",purchaseRoute);
app.use("/api/v1/progress",courseProgressRoute);



app.listen(PORT,()=>{
    console.log(`Server listening at ${PORT}`);
})