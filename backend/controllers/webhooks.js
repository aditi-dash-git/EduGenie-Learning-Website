import { Webhook } from "svix";
import User from "../models/User.js";
import Stripe from "stripe";
import Purchase from "../models/Purchase.js";
import Course from "../models/Course.js";

// API Controller Function to Manage Clerk User with database

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
        const userData = {
          clerkId: data.id,
          email: data.email_addresses[0].email_address,
          name: data.first_name + " " + data.last_name,
          imageUrl: data.image_url,
          username: data.username || "",
        };
        await User.create(userData);
        res.status(200).json({ success: true });
        break;
      }

      case "user.updated": {
        const userData = {
          email: data.email_addresses[0].email_address,
          name: data.first_name + " " + data.last_name,
          imageUrl: data.image_url,
        };
        await User.findOneAndUpdate({ clerkId: data.id }, userData);
        res.status(200).json({ success: true });
        break;
      }

      case "user.deleted": {
        await User.findOneAndDelete({ clerkId: data.id });
        res.status(200).json({ success: true });
        break;
      }

      default:
        break;
    }
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Stripe Webhooks
const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);

export const stripeWebhooks = async (req, res) => {
  // const sig = req.headers["stripe-signature"];

  // let event;
  // console.log("🔥 STRIPE WEBHOOK HIT");

  // try {
  //   event = stripeInstance.webhooks.constructEvent(
  //     req.body,
  //     sig,
  //     process.env.STRIPE_WEBHOOK_SECRET,
  //   );
  // } catch (err) {
  //   console.log("Webhook Error:", err.message);
  //   return res.status(400).send(`Webhook Error: ${err.message}`);
  // }

  const sig = req.headers["stripe-signature"];

  let event;

  try {
    const rawBody = await getRawBody(req);

    event = stripeInstance.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (err) {
    console.log("❌ Webhook signature failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  console.log("🔥 STRIPE WEBHOOK HIT:", event.type);

  switch (event.type) {
    case "checkout.session.completed": {
      console.log("EVENT TYPE:", event.type);
      const session = event.data.object;

      const { purchaseId } = session.metadata;

      const purchaseData = await Purchase.findById(purchaseId);

      if (!purchaseData) return res.json({ received: true });

      const userData = await User.findOne({
        clerkId: purchaseData.userId,
      });

      const courseData = await Course.findById(purchaseData.courseId);

      // ✅ enroll user
      if (!courseData.enrolledStudents.includes(userData._id)) {
        courseData.enrolledStudents.push(userData._id);
        await courseData.save();
      }

      if (!userData.enrolledCourses.includes(courseData._id)) {
        userData.enrolledCourses.push(courseData._id);
        await userData.save();
      }

      // ✅ update purchase
      purchaseData.status = "completed";
      await purchaseData.save();

      console.log("✅ Payment success, user enrolled");
      break;
    }

    case "checkout.session.async_payment_failed": {
      const session = event.data.object;
      const { purchaseId } = session.metadata;

      const purchaseData = await Purchase.findById(purchaseId);

      if (purchaseData) {
        purchaseData.status = "failed";
        await purchaseData.save();
      }

      break;
    }

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
};
