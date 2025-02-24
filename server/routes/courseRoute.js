import { createCourse, createLecture, editCourse, editLecture, getCourseByID, getCourseLecture, getCreatorCourses, getLecturebyId, getPublishedCourses, removeLecture, togglePublishCourse } from "../controllers/courseController.js";
import isAuthenticated from "../middleware/isAuthenticated.js";
import express from "express"
import upload from "../utils/multer.js"


const router=express.Router();

router.route("/").post(isAuthenticated,createCourse);
router.route("/published-courses").get(isAuthenticated,getPublishedCourses)
router.route("/").get(isAuthenticated,getCreatorCourses);
router.route("/:courseId").put(isAuthenticated,upload.single("courseThumbnail"),editCourse);
router.route("/:courseId").get(isAuthenticated,getCourseByID);
router.route("/:courseId/lecture").post(isAuthenticated,createLecture);
router.route("/:courseId/lecture").get(isAuthenticated,getCourseLecture);
router.route("/:courseId/lecture/:lectureId").post(isAuthenticated,editLecture)
router.route("/lecture/:lectureId").delete(isAuthenticated,removeLecture);
router.route("/lecture/:lectureId").get(isAuthenticated,getLecturebyId);
router.route("/:courseId").patch(isAuthenticated, togglePublishCourse);












export default router