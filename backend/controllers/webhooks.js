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
          },
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
  try {
    const sig = req.headers["stripe-signature"];

    const event = stripeInstance.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    console.log("🔥 EVENT TYPE:", event.type);

    // ✅ ONLY handle checkout session
    if (event.type !== "checkout.session.completed") {
      console.log("⚡ Ignored event:", event.type);
      return res.status(200).json({ received: true });
    }

    const session = event.data.object;

    const purchaseId = session.metadata?.purchaseId;

    if (!purchaseId) {
      console.log("❌ No purchaseId found in metadata");
      return res.status(200).json({ received: true });
    }

    console.log("✅ Purchase ID:", purchaseId);

    await Purchase.findByIdAndUpdate(purchaseId, {
      status: "completed",
    });

    const purchase = await Purchase.findById(purchaseId);

    await User.findOneAndUpdate(
      { clerkId: purchase.userId },
      { $addToSet: { enrolledCourses: purchase.courseId } }
    );

    console.log("🎉 User enrolled successfully");

    return res.status(200).json({ received: true });

  } catch (error) {
    console.error("❌ Webhook Error:", error.message);
    return res.status(200).json({ received: true });
  }
};