import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { app,server } from "./lib/socket.js";
import path from "path";

dotenv.config();

const PORT = process.env.PORT;
const __dirname = path.resolve();

app.use(express.json());
// jab bhi koi client (frontend,postman etc) json data bhejta hai(post,put,patch) req k through, toh by default express us body ko read nahi kar pata hai
// express.json() ek middleware hai jo request body ko json mai parse karta hai taki us data ko req.body k throuh access kar sake

app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use("/api/auth", authRoutes); // if user visite this path then authRoutes will run
app.use("/api/messages", messageRoutes);

if(process.env.NODE_ENV === "production"){
  app.use(express.static(path.join(__dirname, "../frontend/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend","dist","index.html"));
  });
}

server.listen(PORT, () => {
  console.log("server is running on port:" + PORT);
  connectDB();
});
