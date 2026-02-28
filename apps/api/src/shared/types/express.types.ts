import { Role } from '@zagotours/types';
import { Request } from 'express';

interface AuthUser {
  id: string;
  email: string;
  role: Role;
  name: string;
}

/**
 * @template TParams  - type for req.params
 * @template TBody    - type for req.body
 * @template TQuery   - type for req.query
 */
export type TypedRequest<TParams = {}, TBody = {}, TQuery = {}> = Request<
  TParams,
  any,
  TBody,
  TQuery
> & {
  userId?: string;
  user?: AuthUser;
};

/**
 * Convenience aliases
 */
export type ReqParams<TParams> = TypedRequest<TParams>;
export type ReqBody<TBody> = TypedRequest<{}, TBody>;
export type ReqQuery<TQuery> = TypedRequest<{}, {}, TQuery>;
export type ReqParamsBody<TParams, TBody> = TypedRequest<TParams, TBody>;
export type ReqParamsQuery<TParams, TQuery> = TypedRequest<TParams, {}, TQuery>;
export type ReqBodyQuery<TBody, TQuery> = TypedRequest<{}, TBody, TQuery>;
export type ReqAll<TParams, TBody, TQuery> = TypedRequest<
  TParams,
  TBody,
  TQuery
>;
