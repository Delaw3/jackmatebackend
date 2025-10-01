import mongoose, { Document, Schema } from "mongoose";
import { IOnboarding } from "../interfaces/onboarding.interface";

const OnboardingSchema: Schema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // one onboarding per user
    },
    university: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "University",
      required: true,
    },
    faculty: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Faculty",
      required: true,
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: true,
    },
    level: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Level",
      required: true,
    },
    semester: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Semester",
      required: true,
    },
    studentId: {
      type: String,
      required: true,
      unique: true,
    }
  },
  { timestamps: true }
);

const OnboardingModel = mongoose.model<IOnboarding>(
  "Onboarding",
  OnboardingSchema
);

export default OnboardingModel;
