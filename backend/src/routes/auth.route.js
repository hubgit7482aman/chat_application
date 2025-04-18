import express from "express";
import { checkAuth, login, logout, signup, updateProfile } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();


router.post("/signup", signup);

router.post("/login", login);
 
router.post("/logout", logout);

router.put("/update-profile",protectRoute,updateProfile);  
// ham protect route vala code har component mai likh sakte hai lekin kai route honge jinmai enter karne se pahle user(authenticate hai ya nahi check karna padega), toh separate protectroute bana liye as a middleware

router.get("/check",protectRoute, checkAuth);

export default router;
