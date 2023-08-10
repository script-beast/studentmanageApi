import express from "express";
import staffController from "../controllers/staff.controller.js";
import staffAuth from "../middlewares/staff.auth.js";

const router = express.Router();

router.post("/register", staffController.register);
router.post("/login", staffController.login);
router.get("/mydata", staffAuth, staffController.getStaff);
router.get("/allstudent", staffAuth, staffController.getAllStudent);

export default router;
