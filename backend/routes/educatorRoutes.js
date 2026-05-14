import express from "express";
import { addCourse, educatorDashboardData, getEducatorCourses, getEnrolledStudentsData, updateRoleToEducator } from "../controllers/educatorController.js";
import upload from "../middleware/courseUpload.js";
import { protectEducator } from "../middleware/authMiddleware.js";
// import { requireAuth } from "@clerk/express";
import protect from "../middleware/auth.js";

const educatorRouter = express.Router();

educatorRouter.post('/update-role', protect, updateRoleToEducator);
// educatorRouter.post('/add-course',protectEducator, upload.single('image'),  addCourse)
educatorRouter.post("/add-course",upload.single('image'),addCourse)
educatorRouter.get('/courses',protect,protectEducator,getEducatorCourses);
educatorRouter.get('/dashboard',protect,protectEducator, educatorDashboardData);
educatorRouter.get('/enrolled-students',protect,protectEducator, getEnrolledStudentsData);



export default educatorRouter;