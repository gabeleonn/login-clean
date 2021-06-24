import { NextFunction, Request, Response } from 'express';
export const applicationJson = (req: Request, res: Response, next: NextFunction): void => {
  res.set('content-type', 'application/json');
  next();
};
