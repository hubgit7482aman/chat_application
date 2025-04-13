import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return res
        .status(400)
        .json({ message: "Unauthorized - No Token Provided" });
    }
    // if token exist then verify it
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // verify token with the secret key (secret key vahi hai jisse token ko banaya gaya tha)
    if (!decoded) {
      return res
        .status(400)
        .json({ message: "Unauthorized - No Token Provided" });
    }

    // now token mai userid hota hai us id se user ko database mai find karenge
    const user = await User.findById(decoded.userId).select("-password"); // select everything from user based on id except password

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // evrything is fine, then
    req.user = user;
    next();
  } catch (error) {
    console.log("Error in protectRoute middleware", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};
