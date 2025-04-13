import cloudinary from "../lib/cloudinary.js";
import { generateToken } from "../lib/utils.js";
import User from "./../models/user.model.js";
import bcrypt from "bcryptjs";

// signup controller
export const signup = async (req, res) => {
  const { fullName, email, password } = req.body;

  try {
    // validation
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are Required" });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    // check if user already exists
    const user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "Email already exists" });

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // create user
    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
    });

    if (newUser) {
      generateToken(newUser._id, res);
      await newUser.save();
      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePic: newUser.profilePic,
      });
    } else {
      res.status(400).json({ message: "Invalid user data" }); // fixed Status -> status
    }
  } catch (error) {
    console.log("Error in signup controller", error.message);
    res.status(500).json({ message: "Internal Server error" });
  }
};

// login controller
export const login = async (req, res) => {
  // email,password nikalo
  const { email, password } = req.body;
  try {
    // if email not exist return it
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid login credentials" });
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password); // normal pass,pass stored in mongo, return a boolean
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid login credentials" });
    }
    generateToken(user._id, res);
    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
    });
  } catch (error) {
    console.log("Error in login controller", error.message);
    res.status(500).json({ message: "Internal server Error" });
  }
};

// logout controller
export const logout = (req, res) => {
  // logout matlab cookie se data erase kar do
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in logout controller", error.message);
    res.status(500).json({ message: "Internal server Error" });
  }
};

// update profile(image update)
export const updateProfile = async (req, res) => {
  // so, for updating the profile for a user we need a functionality for image uploadation
  // we will use cloudinary (it provides us free storage for uploading the image and video)
  try {
    const { profilePic } = req.body;
    const userId = req.user._id; // we are getting userid from req.user because this route will run after a protected route and in protected route we are setting req.user =user means in req.user we are setting the user that we have found from the database, now by req.user._id we can get user id in any controller that will run after this secure route
    if (!profilePic) {
      return res.status(400).json({ message: "Profile pic is required" });
    }
    const uploadResponse = await cloudinary.uploader.upload(profilePic); // upload the image in the cloudinary bucket
    const updateUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: uploadResponse.secure_url },
      { new: true }
    );

    res.status(200).json(updateUser);
  } catch (error) {
    console.log("error in update profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// check auth

export const checkAuth = (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.log("Error in checkAuth controller", error.message);
    res.status(500).json({ message: "Internal server Error" });
  }
};
