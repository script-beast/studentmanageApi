import mongoose from "mongoose";

const studentSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  userPdf: {
    data: Buffer,
    contentType: String,
  },
});

export default mongoose.model("Student", studentSchema);
