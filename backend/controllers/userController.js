import Stripe from "stripe";
import Course from "../models/Course.js";
import Purchase from "../models/Purchase.js";
import User from "../models/User.js";
import { getAuth } from "@clerk/express";

// Get User Data
export const getUserData = async (req, res) => {
  try {
    const { userId } = getAuth(req);

    const user = await User.findOne({ clerkId: userId });

    if (!user) {
      return res.json({
        success: false,
        message: "User Not Found",
      });
    }

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Users Enrolled Courses
export const userEnrolledCourses = async (req, res) => {
  try {
    const { userId } = getAuth(req);

    const userData = await User.findOne({ clerkId: userId }).populate(
      "enrolledCourses",
    );

    if (!userData) {
      return res.json({
        success: false,
        message: "User Not Found",
      });
    }

    res.json({
      success: true,
      enrolledCourses: userData.enrolledCourses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Purchase Course
export const purchaseCourse = async (req, res) => {
  try {
    const { courseId } = req.body;
    const { origin } = req.headers;
    const { userId } = getAuth(req);

    const userData = await User.findOne({ clerkId: userId });
    const courseData = await Course.findById(courseId);

    if (!userData || !courseData) {
      return res.json({
        success: false,
        message: "Data Not Found",
      });
    }

    const amount =
      courseData.coursePrice -
      (courseData.discount * courseData.coursePrice) / 100;

    // ✅ STEP 1: create purchase
    const newPurchase = await Purchase.create({
      courseId,
      userId,
      amount,
      status: "pending",
    });

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    // ✅ STEP 2: create stripe session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",

      line_items: [
        {
          price_data: {
            currency: process.env.CURRENCY.toLowerCase(),
            product_data: {
              name: courseData.courseTitle,
            },
            unit_amount: Math.floor(amount * 100),
          },
          quantity: 1,
        },
      ],

      metadata: {
        purchaseId: newPurchase._id.toString(), // 🔥 KEY
      },

      success_url: `${origin}/loading/my-enrollments`,
      cancel_url: `${origin}/`,
    });

    res.json({
      success: true,
      session_url: session.url,
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

// Update User Course Progress
export const updateUserCourseProgress = async (req, res) => {
  try {
    const userId = req.auth.userId;
    const { courseId, lectureId } = req.body;
    const progressData = await CourseProgress.findOne({ userId, courseId });

    if (progressData) {
      if (progressData.lectureCompleted.includes(lectureId)) {
        return res.json({
          success: true,
          message: "Lecture Already Completed",
        });
      }

      progressData.lectureCompleted.push(lectureId);
      await progressData.save();
    } else {
      await CourseProgress.create({
        userId,
        courseId,
        lectureCompleted: [lectureId],
      });
    }

    res.json({ success: true, message: "Progress Updated" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// get User Course Progress
export const getUserCourseProgress = async (req, res) => {
  try {
    const userId = req.auth.userId;
    const { courseId } = req.params;

    // 🔒 Check if user is enrolled
    const user = await User.findOne({ clerkId: userId });

    if (!user.enrolledCourses.includes(courseId)) {
      return res.status(403).json({
        success: false,
        message: "User not enrolled in this course",
      });
    }

    const progressData = await CourseProgress.findOne({ userId, courseId });

    res.json({
      success: true,
      progressData: progressData || { lectureCompleted: [] },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Add User Ratings to Course

export const addUserRating = async (req, res) => {
  const userId = req.auth.userId;
  const { courseId, rating } = req.body;

  if (!courseId || !userId || !rating || rating < 1 || rating > 5) {
    return res.json({ success: false, message: "InValid Details" });
  }

  try {
    const course = await Course.findById(courseId);

    if (!course) {
      return res.json({ success: false, message: "Course not found." });
    }

    // const user = await User.findById(userId);
    const user = await User.findOne({ clerkId: userId });

    if (
      !user ||
      !user.enrolledCourses.some((id) => id.toString() === courseId)
    ) {
      return res.json({
        success: false,
        message: "User has not purchased this course.",
      });
    }

    const existingRatingIndex = course.courseRatings.findIndex(
      (r) => r.userId.toString() === userId,
    );

    if (existingRatingIndex > -1) {
      course.courseRatings[existingRatingIndex].rating = rating;
    } else {
      course.courseRatings.push({ userId, rating });
    }
    await course.save();
    const totalRatings = course.courseRatings.length;

    const avgRating =
      course.courseRatings.reduce((sum, r) => sum + r.rating, 0) / totalRatings;

    course.avgRating = avgRating;
    await course.save();

    return res.json({ success: true, message: "Rating added" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};
