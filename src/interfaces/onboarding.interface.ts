import { Types } from "mongoose";

export type UniversityType = "Federal" | "State" | "Private";

export interface IUniversity extends Document {
  name: string;
  abbreviation?: string | null;
  type?: UniversityType | null;
  state?: string | null;
  city?: string | null;
  website?: string | null;
  source?: string | null; // where this record came from (api url)
}

export interface FacultyDocument extends Document {
  name: string;
  university: Types.ObjectId; // reference to University
}

export interface DepartmentDocument extends Document {
  name: string;
  faculty: Types.ObjectId; // reference to Faculty
}

export interface ILevel extends Document {
  name: "100" | "200" | "300" | "400" | "500" | "600";
}

export interface ISemester extends Document {
  name: "First Semester" | "Second Semester";
}


export interface IOnboarding extends Document {
  user: Types.ObjectId;
  university: Types.ObjectId;
  faculty: Types.ObjectId;
  department: Types.ObjectId;
  level: Types.ObjectId;
  semester: Types.ObjectId;
  studentId: string;
  createdAt?: Date;
  updatedAt?: Date;
}
