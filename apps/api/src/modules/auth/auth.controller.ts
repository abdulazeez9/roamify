import { Response } from 'express';
import { AuthService } from './auth.service';
import { ResponseUtil } from '../../shared/utils/responseUtils';
import {
  RegisterDto,
  LoginDto,
  ResetPasswordDto,
  ForgotPasswordDto,
} from '@zagotours/types';
import { asyncHandler } from 'src/shared/middleware/async-handler.middleware';
import { ReqBody, TypedRequest } from 'src/shared/types/express.types';

export class AuthController {
  constructor(private authService: AuthService) {}

  /**
   * Register a new user and their specific profile
   */
  register = asyncHandler(async (req: ReqBody<RegisterDto>, res: Response) => {
    const result = await this.authService.register(req.body);
    return ResponseUtil.success(res, result, 'Registration successful', 201);
  });

  /**
   * Register admin (SUPER_ADMIN only)
   */
  registerAdmin = asyncHandler(
    async (
      req: ReqBody<{
        name: string;
        email: string;
        password: string;
        phone?: string;
        country?: string;
      }>,
      res: Response,
    ) => {
      const result = await this.authService.registerAdmin(req.body);
      return ResponseUtil.success(
        res,
        result,
        'Admin registered successfully',
        201,
      );
    },
  );

  /**
   * Authenticate user and return user data (safe)
   */
  login = asyncHandler(async (req: ReqBody<LoginDto>, res: Response) => {
    const result = await this.authService.login(req.body);
    return ResponseUtil.success(res, result, 'Login successful');
  });

  // Refresh token
  refreshToken = asyncHandler(
    async (req: ReqBody<{ refreshToken: string }>, res: Response) => {
      const result = await this.authService.refreshAccessToken(
        req.body.refreshToken,
      );
      return ResponseUtil.success(res, result, 'Token refreshed');
    },
  );

  /**
   * Fetch current authenticated user profile
   */
  getCurrentUser = asyncHandler(async (req: TypedRequest, res: Response) => {
    const user = await this.authService.getCurrentUser(req.userId!);
    return ResponseUtil.success(res, user);
  });

  /**
   * Initiate password reset flow (sends email)
   */
  forgotPassword = asyncHandler(
    async (req: ReqBody<ForgotPasswordDto>, res: Response) => {
      const result = await this.authService.forgotPassword(req.body.email);
      return ResponseUtil.success(res, null, result.message);
    },
  );

  /**
   * Reset password using a valid token
   */
  resetPassword = asyncHandler(
    async (req: ReqBody<ResetPasswordDto>, res: Response) => {
      const result = await this.authService.resetPassword(req.body);
      return ResponseUtil.success(res, null, result.message);
    },
  );
}
