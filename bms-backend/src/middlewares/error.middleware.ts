import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let statusCode = err.status || err.statusCode || 500;
  let message = err.message || "Something went wrong!";

  if (err instanceof ZodError) {
    statusCode = 400;
    message = "Validation error!";
  }

  res.status(statusCode).json({
    success: false,
    message,
  });
};
