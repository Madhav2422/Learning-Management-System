import { createCourse, getCreatorCourses } from "../controllers/courseController.js";
import isAuthenticated from "../middleware/isAuthenticated.js";
import express from "express"


const router=express.Router();

router.route("/").post(isAuthenticated,createCourse)
router.route("/").get(isAuthenticated,getCreatorCourses)




export default router