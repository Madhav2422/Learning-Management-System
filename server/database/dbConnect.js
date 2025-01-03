import mongoose from "mongoose"

const connectDB= async ()=>{
    try {
        await mongoose.connect(process.env.Mongo_Url);
        console.log("Mongodb Connected");

    } catch (error) {
        console.log("Error occured ",error);
    }
}

export default connectDB