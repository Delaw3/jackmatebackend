import mongoose, { Schema, Document } from "mongoose";
import { ISemester } from "../interfaces/onboarding.interface";


const SemesterSchema: Schema = new Schema(
  {
    name: {
      type: String,
      enum: ["First Semester", "Second Semester"],
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

const SemesterModel = mongoose.model<ISemester>("Semester", SemesterSchema);
export default SemesterModel;
