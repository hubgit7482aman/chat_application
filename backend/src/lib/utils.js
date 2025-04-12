import jwt from "jsonwebtoken";

export const generateToken = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d"
  });

  // send generated token to cookie on browser
  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
    httpOnly: true,                  // Prevents XSS attacks (JS can't access cookie)
    sameSite: "strict",              // Helps prevent CSRF
    secure: process.env.NODE_ENV !== "development"  // Only true in production
  });
  return token;
};
