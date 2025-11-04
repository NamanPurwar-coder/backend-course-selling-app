const express = require("express");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const app = express();

app.use(express.json());

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

app.post("/admin/signup", async (req, res) => {
  const { name, email, password } = req.body;
  const user = await Admin.create({
    email: email,
    name: name,
    password: password,
  });

  res.json({
    user: user,
    msg: "account created successfully",
  });
});

app.post("/admin/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const id = (await Admin.findOne({ email: email, password: password })).id;
    const token = jwt.sign(id, secret);
    res.json({
      msg: "you are logged in ",
      token: token,
    });
  } catch (e) {
    res.json({
      msg: "email or password is wrong ",
      error: e,
    });
  }
});

app.post("/admin/courses", async (req, res) => {
  const id = req.id;
  const user = await Admin.findOne({ _id: id });
  res.json({
    user: user,
    msg: "now you are logged in ",
  });
});

app.put("/admin/courses/:courseId", async (req, res) => {
  const id = req.id;
  const user = await Admin.findOne({ _id: id });
  res.json({
    user: user,
    msg: "now you are logged in ",
  });
});

app.get("/admin/courses", async (req, res) => {
  const id = req.id;
  const user = await Admin.findOne({ _id: id });
  res.json({
    user: user,
    msg: "now you are logged in ",
  });
});

app.post("/users/signup", async (req, res) => {
  const { name, email, password } = req.body;
  const user = await User.create({
    email: email,
    name: name,
    password: password,
  });

  res.json({
    user: user,
    msg: "account created successfully",
  });
});

app.post("/users/login", async (req, res) => {
  // logic to log in user
  const { email, password } = req.body;

  try {
    const id = (await User.findOne({ email: email, password: password })).id;
    const token = jwt.sign(id, secret);
    res.json({
      msg: "you are logged in ",
      token: token,
    });
  } catch (e) {
    res.json({
      msg: "email or password is wrong ",
      error: e,
    });
  }
});

app.get("/users/courses", async (req, res) => {
  const id = req.id;
  const user = await User.findOne({ _id: id });
  res.json({
    user: user,
    msg: "now you are logged in ",
  });
});

app.post("/users/courses/:courseId", async (req, res) => {
  const id = req.id;
  const user = await User.findOne({ _id: id });
  res.json({
    user: user,
    msg: "now you are logged in ",
  });
});

app.get("/users/purchasedCourses", authMiddleware, async (req, res) => {
  const id = req.id;
  const user = await User.findOne({ _id: id });
  res.json({
    user: user,
    msg: "now you are logged in ",
  });
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port} `);
});
