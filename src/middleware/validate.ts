// middleware/validate.ts
import { Request, Response, NextFunction } from "express";
import { ObjectSchema } from "joi";
import { errorResponse } from "../utils/response";

export const validate =
  (schema: ObjectSchema) => (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      const messages = error.details.map((d) => d.message).join(", ");
      return errorResponse(res, messages, 422); // 422 = Unprocessable Entity
    }

    next();
  };
