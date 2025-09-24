import { Response } from "express";
import { IApiResponse } from "../interfaces/response.inerface";


export const successResponse = (
  res: Response,
  message: string,
  data: any = null,
  statusCode: number 
) => {
  const response: IApiResponse = {
    status: "success",
    message,
  };
  if (data) response.data = data;

  return res.status(statusCode).json(response);
};


export const errorResponse = (
  res: Response,
  message: string,
  statusCode: number 
) => {
  const response: IApiResponse = {
    status: "error",
    message,
  };

  return res.status(statusCode).json(response);
};
