import { Request } from "express";

export interface IUser extends Document {
  _id: string;
  email: string;
  password: string;
}


export interface URequest extends Request{
    user?: IUser
}