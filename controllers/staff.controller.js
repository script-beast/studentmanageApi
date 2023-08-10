import bcrpyt from "bcryptjs";
import jwt from "jsonwebtoken";
import StudentModel from "../models/Student.model.js";
import StaffModel from "../models/Staff.model.js";

const routes = {};

routes.register = async (req, res) => {
  const { name, email, password } = req.body;

  // console.log(req.body);

  try {
    const olduser = await StaffModel.findOne({ email });

    if (olduser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const salt = await bcrpyt.genSalt(10);
    const hashedPassword = await bcrpyt.hash(password, salt);

    const staff = new StaffModel({
      name,
      email,
      password: hashedPassword,
    });

    const savedStaff = await staff.save();

    res.status(201).json({ Sucess: "Staff registered successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

routes.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await StaffModel.findOne({ email });

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

    res.status(200).json({ token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

routes.getStaff = async (req, res) => {
  const id = req.userId;
  try {
    const user = await StaffModel.findById(id).select("-password");

    if (!user) return res.status(404).json({ error: "Staff not found" });

    res.status(200).json({ user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

routes.getAllStudent = async (req, res) => {
  try {
    const students = await StudentModel.find().select("-password");
    res.status(200).json({ students });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

export default routes;
