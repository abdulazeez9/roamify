import { Request, Response, NextFunction, RequestHandler } from 'express';

/**
 * A Generic Async Handler that supports custom Params, Body, and Query types
 */
export const asyncHandler = <
  P = any, // Params
  Res = any, // Response Body
  ReqB = any, // Request Body
  ReqQ = any, // Request Query
>(
  fn: (
    req: Request<P, Res, ReqB, ReqQ>,
    res: Response<Res>,
    next: NextFunction
  ) => Promise<any>
): RequestHandler<P, Res, ReqB, ReqQ> => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
