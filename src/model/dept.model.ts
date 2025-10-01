import { Schema, model, Document, Types } from "mongoose";
import { DepartmentDocument } from "../interfaces/onboarding.interface";



const DepartmentSchema = new Schema<DepartmentDocument>(
  {
    name: { type: String, required: true, unique: true },
    faculty: { type: Schema.Types.ObjectId, ref: "Faculty", required: true },
  },
  { timestamps: true }
);
DepartmentSchema.index({ name: 1, faculty: 1 }, { unique: true });

export const DepartmentModel = model<DepartmentDocument>("Department", DepartmentSchema);
