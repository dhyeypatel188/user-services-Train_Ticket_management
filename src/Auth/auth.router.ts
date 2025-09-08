import { Router } from "express";
import { AuthController } from "./auth.controller";

const router = Router();
const authController = new AuthController();

router.post("/login", authController.login.bind(authController));
router.post("/logout", authController.logout.bind(authController));
router.post("/refresh-token", authController.refreshToken.bind(authController));

export default router;
    