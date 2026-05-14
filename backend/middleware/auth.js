import { getAuth } from "@clerk/express";

const protect = async (req, res, next) => {
  try {

    console.log("HEADERS:", req.headers);
    console.log("AUTH HEADER:", req.headers.authorization);

    const { userId } = getAuth(req);

    console.log("CLERK USER ID:", userId);

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized",
      });
    }

    req.user = {
      _id: userId,
    };

    next();

  } catch (error) {
    console.log("AUTH ERROR:", error);

    return res.status(401).json({
      success: false,
      error: "Unauthorized",
    });
  }
};

export default protect;