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
    event = stripeInstance.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.log("❌ SIGNATURE ERROR:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  console.log("🔥 EVENT TYPE:", event.type);

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      console.log("SESSION:", session);
      console.log("METADATA:", session.metadata);

      const purchaseId = session.metadata?.purchaseId;

      if (!purchaseId) {
        console.log("❌ purchaseId missing");
        return res.json({ received: true });
      }

      const purchaseData = await Purchase.findById(purchaseId);
      console.log("PURCHASE:", purchaseData);

      if (!purchaseData) {
        console.log("❌ purchase not found");
        return res.json({ received: true });
      }

      const userData = await User.findOne({
        clerkId: purchaseData.userId,
      });

      const courseData = await Course.findById(
        purchaseData.courseId
      );

      console.log("USER:", userData);
      console.log("COURSE:", courseData);

      if (!userData || !courseData) {
        console.log("❌ user or course missing");
        return res.json({ received: true });
      }

      // SAFE ENROLL
      if (
        !courseData.enrolledStudents.some(
          (id) => id.toString() === userData._id.toString()
        )
      ) {
        courseData.enrolledStudents.push(userData._id);
        await courseData.save();
      }

      if (
        !userData.enrolledCourses.some(
          (id) => id.toString() === courseData._id.toString()
        )
      ) {
        userData.enrolledCourses.push(courseData._id);
        await userData.save();
      }

      purchaseData.status = "completed";
      await purchaseData.save();

      console.log("✅ SUCCESS DONE");
    }

    return res.json({ received: true });

  } catch (error) {
    console.log("🔥 INTERNAL ERROR FULL:", error); // IMPORTANT
    return res.status(500).json({ error: error.message });
  }
};