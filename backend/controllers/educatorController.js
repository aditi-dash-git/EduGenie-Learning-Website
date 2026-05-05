import { clerkClient, getAuth } from "@clerk/express";
import User from "../models/User.js";
import { v2 as cloudinary } from "cloudinary";
import Course from "../models/Course.js";
import Purchase from "../models/Purchase.js";
import streamifier from "streamifier";

//Helper Function for Cloudinary Uploads
const uploadFromBuffer = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "courses" },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      },
    );

    streamifier.createReadStream(buffer).pipe(stream);
  });
};

//Update Role
export const updateRoleToEducator = async (req, res) => {
  try {
    const { userId } = getAuth(req);

    console.log("User ID:", userId);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    await clerkClient.users.updateUserMetadata(userId, {
      publicMetadata: {
        role: "educator",
      },
    });

    await User.findOneAndUpdate({ clerkId: userId }, { role: "educator" });

    res.json({
      success: true,
      message: "You can publish a course now",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Add New Course
export const addCourse = async (req, res) => {
  try {
    const { courseData } = req.body;
    const imageFile = req.file;

    console.log(req.body);
    console.log(req.file);

    if (!imageFile) {
      return res.json({
        success: false,
        message: "Thumbnail Not Attached",
      });
    }

    const parsedCourseData = JSON.parse(courseData);

    // TEMP FIX (because userId is coming undefined)
    const { userId } = getAuth(req);
    parsedCourseData.educator = userId;

    // const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
    //   folder: "courses",
    //   use_filename: true,
    //   unique_filename: false,
    //   overwrite: true,
    // });

    const imageUpload = await uploadFromBuffer(imageFile.buffer);

    parsedCourseData.courseThumbnail = imageUpload.secure_url;

    await Course.create(parsedCourseData);

    res.json({
      success: true,
      message: "Course Added",
    });
  } catch (error) {
    console.log("ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Educator Courses
export const getEducatorCourses = async (req, res) => {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const courses = await Course.find({ educator: userId });

    res.json({
      success: true,
      courses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Educator Dashboard Data ( Total Earning, Enrolled Students, No. of Courses)

// Get Educator Dashboard Data
export const educatorDashboardData = async (req, res) => {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const courses = await Course.find({ educator: userId });
    const totalCourses = courses.length;

    const courseIds = courses.map((course) => course._id);

    // IMPORTANT: match your schema field name here
    const purchases = await Purchase.find({
      courseId: { $in: courseIds },
      status: "completed",
    });

    const totalEarnings = purchases.reduce(
      (sum, purchase) => sum + purchase.amount,
      0,
    );

    // Get enrolled students
    const enrolledStudentsData = [];

    for (const course of courses) {
      const students = await User.find(
        { clerkId: { $in: course.enrolledStudents || [] } },
        "name imageUrl",
      );

      students.forEach((student) => {
        enrolledStudentsData.push({
          courseTitle: course.courseTitle,
          student,
        });
      });
    }

    res.json({
      success: true,
      dashboardData: {
        totalEarnings,
        enrolledStudentsData,
        totalCourses,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//Get Enrolled Students Data with Purchase Data
export const getEnrolledStudentsData = async (req, res) => {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const courses = await Course.find({ educator: userId });

    const courseIds = courses.map((course) => course._id);

    const purchases = await Purchase.find({
      courseId: { $in: courseIds },
      status: "completed", // OR paymentStatus
    }).populate("courseId", "courseTitle");

    // 🔥 manually fetch users (because userId is string)
    const enrolledStudents = [];

    for (const purchase of purchases) {
      const student = await User.findOne(
        { clerkId: purchase.userId }, // important
        "name imageUrl",
      );

      enrolledStudents.push({
        student,
        courseTitle: purchase.courseId.courseTitle,
        purchaseDate: purchase.createdAt,
      });
    }

    res.json({
      success: true,
      enrolledStudents,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
