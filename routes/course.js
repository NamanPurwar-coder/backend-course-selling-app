import { router } from "express";

const courseRouter = Router();

courseRouter.get("/", (req, res) => {
  res.send("CourseRouter");
});

export default courseRouter;
