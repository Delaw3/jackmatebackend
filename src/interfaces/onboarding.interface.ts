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