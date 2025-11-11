import { Router } from "express";

const adminRouter = Router();

adminRouter.get("/", (req, res) => {
  res.send("adminRoutes");
});

export default adminRouter;
