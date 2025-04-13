import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";

dotenv.config();
const app = express();

const PORT = process.env.PORT;

app.use(express.json());
// jab bhi koi client (frontend,postman etc) json data bhejta hai(post,put,patch) req k through, toh by default express us body ko read nahi kar pata hai
// express.json() ek middleware hai jo request body ko json mai parse karta hai taki us data ko req.body k throuh access kar sake

app.use(cookieParser());


app.use("/api/auth", authRoutes); // if user visite this path then authRoutes will run
app.use("/api/message", messageRoutes);

app.listen(PORT, () => {
  console.log("server is running on port:" + PORT);
  connectDB();
});
