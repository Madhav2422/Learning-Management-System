import Razorpay from "razorpay";
import { Course } from "../models/courseModel.js";
import { CoursePurchase } from "../models/purchaseCourseModel.js";
import { User } from "../models/userModel.js"
import crypto from "crypto";
import mongoose from "mongoose";
import { Lecture } from "../models/lectureModel.js";

const { ObjectId } = mongoose.Types;

const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export const paymentRazorpay = async (req, res) => {
    try {
        const { courseId } = req.body;
        const userId = req.id;


        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        // 📝 Step 1: Create an order
        const amount = course.coursePrice * 100; // Convert to paisa
        const options = {
            amount,
            currency: process.env.CURRENCY || "INR",
            receipt: `${userId}-${crypto.randomBytes(5).toString("hex")}`, // ✅ Store userId in receipt
        };

        const order = await razorpayInstance.orders.create(options);

        // 🛍️ Step 2: Store purchase details in DB
        const newPurchase = new CoursePurchase({
            courseId,
            userId, // ✅ Store userId
            amount,
            status: "Pending",
            razorpayOrderId: order.id, // ✅ Store Razorpay order ID
        });

        await newPurchase.save();

        console.log("New Purchase:", newPurchase);

        res.status(201).json({ success: true, order }); // ✅ Return order
    } catch (error) {
        console.error("Razorpay Payment Error:", error);
        res.status(500).json({ success: false, message: "Payment failed", error: error.message });
    }
};



//Verify Payment 

// ✅ **Verify Razorpay Payment**
// export const verifyPayment = async (req, res) => {
//     try {
//         const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body; // Get details from frontend

//         const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);
//         console.log("Fetched Order:", orderInfo);

//         if (orderInfo.status === "paid") {
//             const updatedPurchase = await CoursePurchase.findOneAndUpdate(
//                 { razorpayOrderId: razorpay_order_id }, // ✅ Find by Razorpay Order ID
//                 { status: "Completed", paymentId: razorpay_payment_id }, // ✅ Mark as completed
//                 { new: true });


//             console.log("Updated Purchase:", updatedPurchase);

//             // const courseId = purchase.courseId;
//              // Fetch the course to get its lectures
//             const course = await Course.findById(course._id).populate("lectures");

//             if (course && course.lectures.length > 0) {
//                 // Update all lectures to make them visible
//                 await Lecture.updateMany(
//                     { _id: { $in: course.lectures } },
//                     { $set: { isPreviewFree: true } }
//                 );
//                 console.log("Lectures unlocked for the user.");
//             }
//             await course.save();


//             return res.status(200).json({
//                 success: true, message: "Payment verified successfully!",
//                 // redirectUrl: `${process.env.FRONTEND_URL}/course-progress/${courseId}`
//             });
//         } else {
//             return res.json({
//                 success: false, message: "Payment failed",
//                 // redirectUrl: `${process.env.FRONTEND_URL}/course-detail/${courseId}`
//             });
//         }

//     } catch (error) {
//         console.error("Payment Verification Error:", error);
//         res.status(500).json({ success: false, message: "Verification failed", error: error.message });
//     }
// };

export const verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return res.status(400).json({ success: false, message: "Invalid payment data" });
        }

        const purchase = await CoursePurchase.findOne({ razorpayOrderId: razorpay_order_id });

        if (!purchase) {
            return res.status(404).json({ success: false, message: "Purchase record not found" });
        }

        const courseId = purchase.courseId; // ✅ Fetch `courseId`
        const course = await Course.findById(courseId).populate("lectures"); // ✅ Fetch the course with lectures

        if (!course) {
            return res.status(404).json({ success: false, message: "Course not found" });
        }

        if (purchase.status === "Completed") {
            return res.status(200).json({ success: true, message: "Payment already verified" });
        }

        // ✅ Mark payment as completed
        purchase.status = "Completed";
        purchase.paymentId = razorpay_payment_id;
        await purchase.save();

        if (course.lectures.length > 0) {
            await Lecture.updateMany(
                { _id: { $in: course.lectures } },
                { $set: { isPreviewFree: true } }
            );
            console.log("Lectures unlocked for the user.");
        }

        res.status(200).json({
            success: true,
            message: "Payment verified successfully!",
            redirectUrl: `http://localhost:5173/course-progress/${courseId}`,
        });

    } catch (error) {
        console.error("Payment Verification Error:", error);
        res.status(500).json({ success: false, message: "Verification failed", error: error.message });
    }
};


export const getCourseDetailWithPurchaseStatus = async (req, res) => {
    try {
        const { courseId } = req.params;
        const userId  = req.id;

        const course = await Course.findById(courseId).populate({ path: "creator" }).populate({ path: "lectures" });
        const purchased = await CoursePurchase.findOne({ userId, courseId });

        if (!course) {
            return res.status(404).json({
                message: "Course Not Found"
            })
        }

        return res.status(200).json({
            course,
            purchased: !!purchased,//true if purhcased ,false otherwise
        })

    } catch (error) {
        console.log(error);
    }
}

//All Purchased Courses
export const allPurchasedCourses = async (_, res) => {
    try {
        const purchasedCourses = await CoursePurchase.find({ status: "Completed" }).populate("courseId");
        if (!purchasedCourses) {
            return res.status(404).json({
                purchasedCourses: []
            })
        }
        return res.json(200).json({
            purchasedCourses
        })

    } catch (error) {
        console.log(error);
    }
}