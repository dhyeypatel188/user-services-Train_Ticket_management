import { Router } from "express";
import { AdminController } from "../Admin/admin.controller";

const router = Router();
// const userController = new UserController();
const adminController = new AdminController();

// User routes
// router.post('/users', userController.createUser);
// router.get('/users', userController.listUsers);

// Admin routes (no separate file needed)
router.post("/admins", adminController.create.bind(adminController));

export default router;
