import { Schema, model, Document, Types } from "mongoose";
import { FacultyDocument } from "../interfaces/onboarding.interface";


const FacultySchema = new Schema<FacultyDocument>(
  {
    name: { type: String, required: true, unique: true },
    university: { type: Schema.Types.ObjectId, ref: "University", required: true },
  },
  { timestamps: true }
);
FacultySchema.index({ name: 1 }, { unique: true });

export const FacultyModel = model<FacultyDocument>("Faculty", FacultySchema);
