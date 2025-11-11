import { Router } from "express";

const userRouter = Router();

userRouter.get("/", (req, res) => {
  res.send("userRoutes");
});

export default userRouter;
