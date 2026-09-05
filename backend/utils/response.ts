import { Response } from 'express';
import { ApiResponse } from '../models/earlyAccess';

export function sendSuccess<T>(res: Response, data?: T, message = 'Success', statusCode = 200) {
  const payload: ApiResponse<T> = {
    success: true,
    message,
    data,
  };
  return res.status(statusCode).json(payload);
}

export function sendError(
  res: Response,
  message = 'An error occurred',
  statusCode = 400,
  errors?: Record<string, string>
) {
  const payload: ApiResponse = {
    success: false,
    message,
    errors,
  };
  return res.status(statusCode).json(payload);
}
