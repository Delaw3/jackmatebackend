import mongoose, { Document, Schema } from "mongoose";
import { IUniversity } from "../interfaces/onboarding.interface";


const UniversitySchema: Schema = new Schema(
  {
    name: { type: String, required: true, unique: true, index: true },
    abbreviation: { type: String, default: null },
    type: {
      type: String,
      enum: ["Federal", "State", "Private"],
      default: null,
    },
    state: { type: String, default: null },
    city: { type: String, default: null },
    website: { type: String, default: null },
    source: { type: String, default: null },
  },
  { timestamps: true }
);

const UniversityModel = mongoose.model<IUniversity>("University", UniversitySchema);

export default UniversityModel;
