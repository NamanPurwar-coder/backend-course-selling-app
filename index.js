import express from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
import adminRouter from "./routes/admin.js";
import userRouter from "./routes/user.js";
import courseRouter from "./routes/course.js";
const app = express();

app.use(express.json());
app.use("/user", userRouter);
app.use("/admin", adminRouter);
app.use("/course", courseRouter);

const secret = process.env.JWT_SECRET;
const port = process.env.PORT;
const mongo_url = process.env.MONGO_URL;

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  purchasedCourses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },
  ],
});

const adminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  imageLink: {
    type: String,
  },
  published: {
    type: Boolean,
    default: false,
  },
});

const User = mongoose.model("User", userSchema);
const Admin = mongoose.model("Admin", adminSchema);
const Course = mongoose.model("Course", courseSchema);

const authMiddleware = (req, res, next) => {
  const token = req.headers.token;
  try {
    const id = jwt.verify(token, secret);
  } catch (e) {
    return res.status(403).json({ msg: "unauthorized" });
  }
  req.id = id;
  next();
};

mongoose.connect(mongo_url);

app.listen(port, () => {
  console.log(`Server is listening on port ${port} `);
});
