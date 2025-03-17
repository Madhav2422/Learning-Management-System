import express from "express";
import isAuthenticated from "../middleware/isAuthenticated.js";

import { allPurchasedCourses, getCourseDetailWithPurchaseStatus, paymentRazorpay, verifyPayment } from "../controllers/purchaseCourseController.js";

const router=express.Router();

router.post("/purchaseCourse", isAuthenticated, paymentRazorpay);
router.post("/verifyPayment", isAuthenticated, verifyPayment);
router.route("/course/:courseId/detail-with-status").get(isAuthenticated,getCourseDetailWithPurchaseStatus);
router.route("/").get(isAuthenticated,allPurchasedCourses);

export default router;