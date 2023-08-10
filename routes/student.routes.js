import express from "express";
import studentController from "../controllers/student.controller.js";
import multerStorage from "../middlewares/multer.storage.js";
import studentAuth from "../middlewares/student.auth.js";

const router = express.Router();

router.post(
  "/register",
  multerStorage.single("userPdf"),
  studentController.register
);
router.post("/login", studentController.login);
router.get("/mydata", studentAuth, studentController.getStudent);

export default router;
