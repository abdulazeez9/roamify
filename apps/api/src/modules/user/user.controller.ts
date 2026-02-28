import { Response } from 'express';
import { UserService } from './user.service';
import { ResponseUtil } from 'src/shared/utils/responseUtils';
import { Role, UserStatus } from '@zagotours/database';
import {
  ReqBody,
  ReqParams,
  ReqParamsBody,
  ReqQuery,
  TypedRequest,
} from 'src/shared/types/express.types';
import { asyncHandler } from 'src/shared/middleware/async-handler.middleware';
import { UpdateProfileDto, UpdateUserStatusDto } from '@zagotours/types';
import { UuidParam } from 'src/common/validation/common.validation';
import { CloudinaryService } from 'src/shared/services/cloudinary.service';

export class UserController {
  constructor(private readonly userService: UserService) {}

  // ============================================
  // USER PROFILE ENDPOINTS
  // ============================================

  getProfile = asyncHandler(async (req: TypedRequest, res: Response) => {
    const profile = await this.userService.getProfile(req.userId!);
    return ResponseUtil.success(res, profile);
  });

  updateProfile = asyncHandler(
    async (req: ReqBody<UpdateProfileDto>, res: Response) => {
      const updateData = { ...req.body };

      if (req.file) {
        const uploadResult = await CloudinaryService.uploadFile(
          req.file,
          'profile',
          req.userId,
        );

        updateData.image = uploadResult.url;
      }

      const result = await this.userService.updateProfile(
        req.userId!,
        updateData,
      );

      return ResponseUtil.success(res, result, 'Profile updated successfully');
    },
  );

  updateUserProfileById = asyncHandler(
    async (
      req: ReqParams<{ id: string }> & ReqBody<UpdateProfileDto>,
      res: Response,
    ) => {
      const result = await this.userService.updateProfile(
        req.params.id,
        req.body,
      );
      return ResponseUtil.success(
        res,
        result,
        'User profile updated successfully',
      );
    },
  );

  getReferralStats = asyncHandler(async (req: TypedRequest, res: Response) => {
    const stats = await this.userService.getReferralStats(req.userId!);
    return ResponseUtil.success(res, stats);
  });

  // ============================================
  // ADMIN ENDPOINTS
  // ============================================

  getAllUsers = asyncHandler(
    async (
      req: ReqQuery<{
        page?: string;
        limit?: string;
        role?: Role;
        status?: UserStatus;
        search?: string;
      }>,
      res: Response,
    ) => {
      const { page = '1', limit = '10', role, status, search } = req.query;

      const result = await this.userService.getAllUsers({
        page: Number(page),
        limit: Number(limit),
        role,
        status,
        search,
      });

      return ResponseUtil.paginated(res, result);
    },
  );

  /**
   * Get user by ID (admin)
   * GET /api/admin/users/:id
   */
  getUserById = asyncHandler(
    async (req: ReqParams<{ id: string }>, res: Response) => {
      const user = await this.userService.getUserById(req.params.id);
      return ResponseUtil.success(res, user);
    },
  );

  /**
   * Update user status (admin)
   * PATCH /api/admin/users/:id/status
   */
  updateUserStatus = asyncHandler(
    async (
      req: ReqParams<{ id: string }> & ReqBody<UpdateUserStatusDto>,
      res: Response,
    ) => {
      const user = await this.userService.updateUserStatus(
        req.params.id,
        req.body,
      );
      return ResponseUtil.success(
        res,
        user,
        'User status updated successfully',
      );
    },
  );

  /**
   * Promote user to safety ambassador (admin)
   * PATCH /api/admin/users/safety-ambassador
   */
  promoteSafetyAmbassador = asyncHandler(
    async (
      req: ReqParamsBody<UuidParam, { safetyAmbassador?: boolean }>,
      res: Response,
    ) => {
      const user = await this.userService.promoteSafetyAmbassador(
        req.params.id,
        req.body.safetyAmbassador ?? true,
      );
      return ResponseUtil.success(
        res,
        user,
        'Safety ambassador status updated successfully',
      );
    },
  );

  /**
   * Delete user (admin)
   * DELETE /api/admin/users/:id?hard=true
   */
  deleteUser = asyncHandler(
    async (
      req: ReqParams<{ id: string }> & ReqQuery<{ hard?: string }>,
      res: Response,
    ) => {
      const isHard = req.query.hard === 'true';
      await this.userService.deleteUser(req.params.id, req.userId!, isHard);
      return ResponseUtil.success(res, null, 'User deleted successfully');
    },
  );
}
