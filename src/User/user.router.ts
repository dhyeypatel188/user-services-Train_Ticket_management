import { Router } from "express";
import { AdminController } from "../Admin/admin.controller";
import { adminOnly } from "../middleware/admin.middleware";
import { UserController } from "./user.controller";

const router = Router();
const userController = new UserController();

// Admin-only routes
router.post("/users",userController.create.bind(userController));
router.delete(
  "/users/:id",
  userController.deleteUser.bind(userController)
);

// Public routes
// router.get("/users", userController.listUsers);

export default router;
