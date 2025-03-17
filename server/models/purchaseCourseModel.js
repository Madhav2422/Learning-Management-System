import mongoose, { mongo } from "mongoose";

const coursePurchaseSchema = new mongoose.Schema({
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Completed', 'Failed'],
        default: "Pending"
    },
    paymentId: {
        type: String,
        default: null

    },
    razorpayOrderId: {  // ✅ Add this field to track orders correctly
        type: String,
        required: true
    }


}, { timestamps: true });

export const CoursePurchase = mongoose.model('CoursePurchase', coursePurchaseSchema)