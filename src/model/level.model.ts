import mongoose, { Schema, Document } from "mongoose";
import { ILevel } from "../interfaces/onboarding.interface";



const LevelSchema: Schema = new Schema(
  {
    name: {
      type: String,
      enum: ["100", "200", "300", "400", "500", "600"],
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

const LevelModel = mongoose.model<ILevel>("Level", LevelSchema);
export default LevelModel;
