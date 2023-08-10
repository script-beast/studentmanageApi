import bcrpyt from "bcryptjs";
import jwt from "jsonwebtoken";
import fs from "fs";
import StudentModel from "../models/Student.model.js";

const routes = {};

routes.register = async (req, res) => {
  const { name, email, password, phone } = req.body;
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Please upload a file" });
    }

    const olduser = await StudentModel.findOne({ email });
    if (olduser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const salt = await bcrpyt.genSalt(10);
    const hashedPassword = await bcrpyt.hash(password, salt);

    const student = new StudentModel({
      name,
      email,
      password: hashedPassword,
      phone,
      userPdf: {
        data: fs.readFileSync("uploads/" + req.file.filename),
        contentType: "application/pdf",
      },
    });

    const savedStudent = await student.save();

    res.status(201).json({ success: "Student registered successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

routes.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await StudentModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    const isMatch = await bcrpyt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    // console.log(user);
    res.status(200).json({ token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

routes.getStudent = async (req, res) => {
  const id = req.userId;

  try {
    const student = await StudentModel.findById(id).select("-password");
    if (!student) return res.status(404).json({ error: "Student not found" });
    res.status(200).json({ user: student });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

export default routes;
