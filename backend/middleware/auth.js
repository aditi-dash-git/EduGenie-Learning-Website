import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Protects routes using JWT Authentication
const protect = async (req, res, next) => {
  // stores JWT token
  let token;

  

  console.log("JWT_SECRET:", process.env.JWT_SECRET);
  // Check if token exists in Authorization header
  // Standard JWT format is Bearer <token>
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) 
  {
    try {
      // exclude "Bearer" and store the token sent by frontend
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      // retriever the full user document exluding the password (to prevent senstitive data exposure)
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: "User not found",
          statusCode: 401,
        });
      }

      
      // everything is valid and the user exists
      next();
    } catch (error) {
      console.error("Auth middleware error:", error.message);

      if (error.name === "TokenExpiredError") {
        return res.status(401).json({
          success: false,
          error: "Token has expired",
          statusCode: 401,
        });
      }

      return res.status(401).json({
        success: false,
        error: "Not authorized, token failed",
        statusCode: 401,
      });
    }
  }
  if (!token) {
    return res.status(401).json({
      success: false,
      error: "Not authorized, no token",
      statusCode: 401,
    });
  }
};

export default protect;
