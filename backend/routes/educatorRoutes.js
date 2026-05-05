import express from "express";
import { addCourse, educatorDashboardData, getEducatorCourses, getEnrolledStudentsData, updateRoleToEducator } from "../controllers/educatorController.js";
import upload from "../middleware/courseUpload.js";
import { protectEducator } from "../middleware/authMiddleware.js";
import { requireAuth } from "@clerk/express";

const educatorRouter = express.Router();

educatorRouter.post('/update-role', requireAuth(), updateRoleToEducator);
// educatorRouter.post('/add-course',protectEducator, upload.single('image'),  addCourse)
educatorRouter.post("/add-course",upload.single('image'),addCourse)
educatorRouter.get('/courses',requireAuth(),protectEducator,getEducatorCourses);
educatorRouter.get('/dashboard',requireAuth(),protectEducator, educatorDashboardData);
educatorRouter.get('/enrolled-students',requireAuth(),protectEducator, getEnrolledStudentsData);



export default educatorRouter;