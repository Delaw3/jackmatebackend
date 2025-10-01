import mongoose, { Document, Schema } from "mongoose";
import { IUser } from "../interfaces/user.interface";



const UserSchema: Schema = new Schema(
  {
    email: { 
        type: String, 
        required: true, 
        unique: true 
    },
    password: { 
        type: String, 
        required: true 
    },
    isVerified:{
        type: Boolean,
        default: false
    },
    onboardingCompleted: {
        type: Boolean,
        default: false
    },

    studentId: {
        type: String,
        default: null
    },

  },
  { timestamps: true }
);

const UserModel = mongoose.model<IUser>("User", UserSchema);

export default UserModel;
