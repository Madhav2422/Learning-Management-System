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
    console.log("Razorpay Keys:", process.env.RAZORPAY_KEY_ID, process.env.RAZORPAY_KEY_SECRET);


    try {
        const { courseId } = req.body;
        const userId = req.id;

        console.log("🔍 Received purchase request for courseId:", courseId, "from userId:", userId);

        const course = await Course.findById(courseId);
        if (!course) {
            console.log("❌ Course not found for ID:", courseId);
            return res.status(404).json({ message: "Course not found" });
        }

        const amount = course.coursePrice * 100; // Amount in paisa
        console.log("💰 Course Price:", course.coursePrice, "→ Amount in paisa:", amount);

        const receipt = `${userId}-${crypto.randomBytes(5).toString("hex")}`;
        console.log("🧾 Receipt ID:", receipt);

        const options = {
            amount,
            currency: process.env.CURRENCY || "INR",
            receipt,
        };

        // Separated try-catch to isolate Razorpay errors
        let order;
        try {
            order = await razorpayInstance.orders.create(options);
            console.log("✅ Razorpay Order Created:", order);
        } catch (razorErr) {
            console.error("❌ Razorpay Order Creation Failed:", razorErr);
            return res.status(500).json({
                success: false,
                message: "Razorpay order creation failed",
                error: razorErr,
            });
        }

        const newPurchase = new CoursePurchase({
            courseId,
            userId,
            amount,
            status: "Pending",
            razorpayOrderId: order.id,
        });

        await newPurchase.save();
        console.log("🛒 New Purchase Saved to DB:", newPurchase);

        res.status(201).json({ success: true, order });
    } catch (error) {
        console.error("❌ Razorpay Payment Error:", error);
        res.status(500).json({ success: false, message: "Payment failed", error: error.message });
    }
};





// export const verifyPayment = async (req, res) => {
//     try {
//         const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

//         if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
//             return res.status(400).json({ success: false, message: "Invalid payment data" });
//         }

//         const purchase = await CoursePurchase.findOne({ razorpayOrderId: razorpay_order_id });

//         if (!purchase) {
//             return res.status(404).json({ success: false, message: "Purchase record not found" });
//         }

//         const courseId = purchase.courseId; // ✅ Fetch `courseId`
//         const course = await Course.findById(courseId).populate("lectures"); // ✅ Fetch the course with lectures

//         if (!course) {
//             return res.status(404).json({ success: false, message: "Course not found" });
//         }

//         if (purchase.status === "Completed") {
//             return res.status(200).json({ success: true, message: "Payment already verified" });
//         }

//         // ✅ Mark payment as completed
//         purchase.status = "Completed";
//         purchase.paymentId = razorpay_payment_id;
//         await purchase.save();

//         if (course.lectures.length > 0) {
//             await Lecture.updateMany(
//                 { _id: { $in: course.lectures } },
//                 { $set: { isPreviewFree: true } }
//             );
//             console.log("Lectures unlocked for the user.");
//         }

//         res.status(200).json({
//             success: true,
//             message: "Payment verified successfully!",
//             redirectUrl: `http://localhost:5173/course-progress/${courseId}`,
//         });

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

        const courseId = purchase.courseId;
        const course = await Course.findById(courseId).populate("lectures");

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

        // ✅ Unlock lectures
        if (course.lectures.length > 0) {
            await Lecture.updateMany(
                { _id: { $in: course.lectures } },
                { $set: { isPreviewFree: true } }
            );
            console.log("Lectures unlocked for the user.");
        }

        // ✅ Update User: Add courseId to enrolledCourses
        await User.findByIdAndUpdate(
            purchase.userId,
            { $addToSet: { enrolledCourses: course._id } }, // prevent duplicates
            { new: true }
        );

        // ✅ Update Course: Add userId to enrolledStudents
        await Course.findByIdAndUpdate(
            course._id,
            { $addToSet: { enrolledStudents: purchase.userId } },
            { new: true }
        );

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
        const userId = req.id;

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
// export const allPurchasedCourses = async (_, res) => {
//     try {
//         const purchasedCourses = await CoursePurchase.find({ status: "Completed" }).populate("courseId");
//         // if (!purchasedCourses) {
//         //     return res.status(404).json({
//         //         purchasedCourses: []
//         //     })
//         // }
//         return res.status(200).json({
//             purchasedCourses
//         });

//     } catch (error) {
//         console.log(error);
//     }
// }
export const allPurchasedCourses = async (_, res) => {
    try {
        const purchasedCourses = await CoursePurchase.find({ status: "Completed" }).populate("courseId");
        return res.status(200).json({
            success: true,
            purchasedCourses // Changed from purchasedCourses to match frontend expectation
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch purchased courses"
        });
    }
}