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