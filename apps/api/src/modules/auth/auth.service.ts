import { generateReferralCode } from 'src/shared/utils/nanoid';
import { BcryptUtil } from '../../shared/utils/password';
import { JwtUtil } from '../../shared/utils/jwt';
import { EmailService } from '../../shared/services/email.service';
import { AuthRepository } from './auth.repository';
import {
  RegisterDto,
  LoginDto,
  UserResponse,
  ResetPasswordDto,
  ROLE_PREFIXES,
  UserProfileResponse,
} from '@zagotours/types';
import { Role } from '@zagotours/database';

export class AuthService {
  constructor(private readonly authRepository: AuthRepository) {}

  // ============================================
  // REGISTRATION
  // ============================================
  async register(data: RegisterDto): Promise<UserResponse> {
    const [exists, referrer] = await Promise.all([
      this.authRepository.emailExists(data.email),
      data.referralCode
        ? this.authRepository.findByReferralCode(
            data.referralCode.trim().toUpperCase(),
          )
        : Promise.resolve(null),
    ]);

    if (exists) throw new Error('Email already exists');

    this.validateRoleSpecificFields(data);

    const [hashedPassword, referralCode] = await Promise.all([
      BcryptUtil.hash(data.password),
      this.generateUniqueReferralCode(data.role),
    ]);

    const referredById = referrer?.id ?? null;

    const userData = {
      name: data.name,
      email: data.email,
      password: hashedPassword,
      phone: data.phone,
      country: data.country,
      role: data.role,
      referralCode,
      referredById,
    };

    const profileData = this.extractProfileData(data);

    const user = await this.authRepository.registerWithProfile(
      userData,
      data.role,
      profileData,
    );

    EmailService.sendWelcomeEmail(user.email, user.name).catch((err) =>
      console.error('Email background error:', err),
    );

    return this.mapUserResponse(user);
  }

  // ============================================
  // ADMIN REGISTRATION (SUPER_ADMIN ONLY)
  // ============================================
  async registerAdmin(data: {
    name: string;
    email: string;
    password: string;
    phone?: string;
    country?: string;
  }): Promise<UserResponse> {
    const existingUser = await this.authRepository.findByEmail(data.email);

    if (existingUser) {
      throw new Error('Email already exists');
    }

    const hashedPassword = await BcryptUtil.hash(data.password);
    const referralCode = await this.generateUniqueReferralCode(Role.ADMIN);

    const userData = {
      name: data.name,
      email: data.email,
      password: hashedPassword,
      phone: data.phone,
      country: data.country,
      role: Role.ADMIN,
      referralCode,
      referredById: null,
    };

    const user = await this.authRepository.registerWithProfile(
      userData,
      Role.ADMIN,
      {},
    );

    // Send welcome email
    EmailService.sendWelcomeEmail(user.email, user.name).catch((err) =>
      console.error('Email background error:', err),
    );

    return this.mapUserResponse(user);
  }

  // ============================================
  // LOGIN & AUTH
  // ============================================
  async login(
    data: LoginDto,
  ): Promise<UserResponse & { accessToken: string; refreshToken: string }> {
    const user = await this.authRepository.findByEmail(data.email);

    if (!user || !(await BcryptUtil.compare(data.password, user.password))) {
      throw new Error('Invalid credentials');
    }

    if (user.deletedAt) {
      throw new Error('This account has been deleted. Please contact support.');
    }

    if (user.status === 'SUSPENDED') {
      throw new Error('Your account is currently suspended.');
    }

    // Generate tokens
    const accessToken = JwtUtil.generateAccessToken({
      sub: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    });

    const refreshToken = JwtUtil.generateRefreshToken({ sub: user.id });

    return {
      ...this.mapUserResponse(user),
      accessToken,
      refreshToken,
    };
  }

  // ============================================
  // REFRESH TOKEN
  // ============================================
  async refreshAccessToken(
    refreshToken: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    // Verify refresh token
    const decoded = JwtUtil.verifyRefreshToken(refreshToken);
    if (!decoded) {
      throw new Error('Invalid or expired refresh token');
    }

    const user = await this.authRepository.findById(decoded.sub);

    if (!user || user.deletedAt || user.status === 'SUSPENDED') {
      throw new Error(
        'Access denied. Account is inactive, deleted, or suspended.',
      );
    }
    // Generate new tokens
    const newAccessToken = JwtUtil.generateAccessToken({
      sub: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    });

    const newRefreshToken = JwtUtil.generateRefreshToken({ sub: user.id });

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }

  // ============================================
  // GET CURRENT USER
  // ============================================
  async getCurrentUser(userId: string): Promise<UserResponse> {
    const user = await this.authRepository.findById(userId);
    if (!user) throw new Error('User not found');

    return this.mapUserResponse(user);
  }

  // ============================================
  // PASSWORD RECOVERY
  // ============================================

  async forgotPassword(email: string): Promise<{ message: string }> {
    const user = await this.authRepository.findByEmail(email);

    if (user) {
      const resetToken = JwtUtil.generateResetToken(user.id);
      const expiresAt = new Date(Date.now() + 3600000); // 1 hour

      await this.authRepository.saveResetToken(user.id, resetToken, expiresAt);
      await EmailService.sendPasswordResetEmail(user.email, resetToken).catch(
        (err) => console.error('Email background error:', err),
      );
    }

    return { message: 'If that email exists, a reset link has been sent' };
  }

  // ============================================
  // RESET PASSWORD
  // ============================================
  async resetPassword(data: ResetPasswordDto): Promise<{ message: string }> {
    const decoded = JwtUtil.verifyResetToken(data.token);
    const user = await this.authRepository.findByResetToken(data.token);

    if (!decoded || !user) {
      throw new Error('Invalid or expired reset token');
    }

    const hashedPassword = await BcryptUtil.hash(data.newPassword);

    await this.authRepository.update(user.id, { password: hashedPassword });
    await this.authRepository.clearResetToken(user.id);

    return { message: 'Password reset successful' };
  }

  // ============================================
  // PRIVATE HELPERS
  // ============================================

  private mapUserResponse(user: any): UserResponse {
    const {
      password,
      resetPasswordToken,
      resetPasswordExpires,
      independentDetails,
      cooperateDetails,
      affiliateDetails,
      ...safeUser
    } = user;

    //ReferralLink
    const referralLink = `${process.env.FRONTEND_URL}/register?ref=${user.referralCode}`;

    let profile: UserProfileResponse = null;

    // Discriminated Union mapping
    if (user.role === Role.INDEPENDENT_AGENT && independentDetails) {
      profile = { ...independentDetails };
    } else if (user.role === Role.COOPERATE_AGENT && cooperateDetails) {
      profile = { ...cooperateDetails };
    } else if (user.role === Role.AFFILIATE && affiliateDetails) {
      profile = { ...affiliateDetails };
    }

    return {
      ...safeUser,
      referralLink,
      profile,
      referralCount: user._count?.referees ?? 0,
    };
  }

  // ============================================
  // VALIDATE SPECIFIC ROLE
  // ============================================
  private validateRoleSpecificFields(data: RegisterDto): void {
    if (data.role === Role.INDEPENDENT_AGENT) {
      if (!data.agentDetails || data.agentDetails.certifications.length === 0) {
        throw new Error('Certifications are required for Independent Agents');
      }
    }

    if (data.role === Role.COOPERATE_AGENT) {
      if (!data.cooperateDetails?.companyName) {
        throw new Error('Company name is required for Corporate Agents');
      }
    }

    if (data.role === Role.AFFILIATE) {
      if (!data.affiliateDetails?.communityBrand) {
        throw new Error('Community brand is required for Affiliates');
      }
    }
  }

  // ============================================
  // EXTRACT PROFILE DATA
  // ============================================
  private extractProfileData(data: RegisterDto): Record<string, any> {
    if (data.role === Role.INDEPENDENT_AGENT && data.agentDetails) {
      return {
        certifications: data.agentDetails.certifications,
        howDidYouHear: data.agentDetails?.howDidYouHear,
      };
    }
    if (data.role === Role.COOPERATE_AGENT && data.cooperateDetails) {
      return {
        companyName: data.cooperateDetails.companyName,
        travelBusinessDescription:
          data.cooperateDetails.travelBusinessDescription,
        howDidYouHear: data.cooperateDetails?.howDidYouHear,
      };
    }
    if (data.role === Role.AFFILIATE && data.affiliateDetails) {
      return {
        communityBrand: data.affiliateDetails.communityBrand,
        socialLinks: data.affiliateDetails.socialLinks,
        howDidYouHear: data.affiliateDetails?.howDidYouHear,
      };
    }
    return {};
  }

  // ============================================
  // GENERATE UNIQUE REFFERAL CODE
  // ============================================
  private async generateUniqueReferralCode(role: Role): Promise<string> {
    const prefix = ROLE_PREFIXES[role] || 'USR';
    let attempts = 0;
    while (attempts < 5) {
      const code = `${prefix}-${generateReferralCode().toUpperCase()}`;
      const existing = await this.authRepository.findByReferralCode(code);
      if (!existing) return code;
      attempts++;
    }
    throw new Error('Failed to generate unique referral code');
  }
}
