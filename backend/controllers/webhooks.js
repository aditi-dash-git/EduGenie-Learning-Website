import { Webhook } from "svix";
import User from "../models/User.js";
import Stripe from "stripe";
import Course from "../models/Course.js";
import Purchase from "../models/Purchase.js";


const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);

// ================= CLERK WEBHOOK =================
export const clerkWebhooks = async (req, res) => {
  try {
    const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    await whook.verify(JSON.stringify(req.body), {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    });

    const { data, type } = req.body;

    switch (type) {
      case "user.created": {
        await User.create({
          clerkId: data.id,
          email: data.email_addresses[0].email_address,
          name: data.first_name + " " + data.last_name,
          imageUrl: data.image_url,
          username: data.username || "",
        });
        break;
      }

      case "user.updated": {
        await User.findOneAndUpdate(
          { clerkId: data.id },
          {
            email: data.email_addresses[0].email_address,
            name: data.first_name + " " + data.last_name,
            imageUrl: data.image_url,
          }
        );
        break;
      }

      case "user.deleted": {
        await User.findOneAndDelete({ clerkId: data.id });
        break;
      }

      default:
        break;
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.log("❌ Clerk webhook error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const stripeWebhooks = async (req, res) => {
  const sig = req.headers["stripe-signature"];

  let event;

  try {
    // ⚠️ req.body must be RAW buffer (server.js already handled)
    event = stripeInstance.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.log("❌ Stripe signature failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  console.log("🔥 Stripe Event:", event.type);

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      const { courseId, userId } = session.metadata;

      // ================= FETCH DATA =================
      const userData = await User.findOne({ clerkId: userId });
      const courseData = await Course.findById(courseId);

      if (!userData || !courseData) {
        console.log("❌ User or Course not found");
        return res.json({ received: true });
      }

      // ================= ENROLL USER =================
      const isStudentEnrolled = courseData.enrolledStudents.some(
        (id) => id.toString() === userData._id.toString()
      );

      if (!isStudentEnrolled) {
        courseData.enrolledStudents.push(userData._id);
        await courseData.save();
      }

      const isCourseAdded = userData.enrolledCourses.some(
        (id) => id.toString() === courseData._id.toString()
      );

      if (!isCourseAdded) {
        userData.enrolledCourses.push(courseData._id);
        await userData.save();
      }

      // ================= UPDATE PURCHASE =================
      const purchaseData = await Purchase.findOne({
        courseId,
        userId,
        status: "pending",
      });

      if (purchaseData) {
        purchaseData.status = "completed";
        await purchaseData.save();
      }

      console.log("✅ Payment success → enrolled + purchase updated");
    }

    // ================= FAILURE CASE =================
    if (event.type === "checkout.session.async_payment_failed") {
      const session = event.data.object;
      const { courseId, userId } = session.metadata;

      const purchaseData = await Purchase.findOne({
        courseId,
        userId,
        status: "pending",
      });

      if (purchaseData) {
        purchaseData.status = "failed";
        await purchaseData.save();
      }

      console.log("❌ Payment failed → purchase updated");
    }

    res.json({ received: true });

  } catch (error) {
    console.log("🔥 INTERNAL ERROR:", error.message);
    res.status(500).json({ error: error.message });
  }
};