import { Router } from "express";
import { loginController } from "../controllers/auth.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.post("/login", loginController);

router.get("/me", authenticate, (req, res) => {
  res.status(200).json({
    success: true,
    data: req.user,
  });
});

export default router;