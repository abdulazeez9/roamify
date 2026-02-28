import { prisma, Prisma, Role, User } from '@zagotours/database';
import { BaseRepository } from 'src/common/repository/base.repository';

export class AuthRepository extends BaseRepository<
  User,
  Prisma.UserWhereInput,
  Prisma.UserCreateInput,
  Prisma.UserUpdateInput,
  Prisma.UserInclude
> {
  protected readonly modelDelegate = prisma.user;

  //===== FIND BY UNIQUE EMAIL =======
  async findByEmail(email: string): Promise<User | null> {
    return this.modelDelegate.findFirst({
      where: { email, deletedAt: null },
      include: {
        independentDetails: true,
        cooperateDetails: true,
        affiliateDetails: true,
        _count: {
          select: { referees: true },
        },
      },
    });
  }

  async emailExists(email: string): Promise<boolean> {
    const user = await this.modelDelegate.findFirst({
      where: { email, deletedAt: null },
      select: { id: true },
    });
    return !!user;
  }

  //===== FIND BY ID (if you have this method) =======
  async findById(id: string): Promise<User | null> {
    return this.modelDelegate.findFirst({
      where: { id, deletedAt: null },
      include: {
        independentDetails: true,
        cooperateDetails: true,
        affiliateDetails: true,
        _count: {
          select: { referees: true },
        },
      },
    });
  }

  //===== FIND BY UNIQUE REFERRAL-CODE =======
  async findByReferralCode(code: string): Promise<User | null> {
    return this.modelDelegate.findUnique({
      where: { referralCode: code },
    });
  }

  //===== FIND BY UNIQUE RESET-TOKEN =======
  async findByResetToken(token: string): Promise<User | null> {
    return this.modelDelegate.findFirst({
      where: {
        resetPasswordToken: token,
        resetPasswordExpires: { gte: new Date() },
      },
    });
  }

  //===== SAVE RESET-TOKEN =======
  async saveResetToken(
    userId: string,
    token: string,
    expiresAt: Date,
  ): Promise<User> {
    return this.update(userId, {
      resetPasswordToken: token,
      resetPasswordExpires: expiresAt,
    });
  }

  //===== CLEAR RESET-TOKEN =======
  async clearResetToken(userId: string): Promise<User> {
    return this.update(userId, {
      resetPasswordToken: null,
      resetPasswordExpires: null,
    });
  }

  // ======= REGISTER USERS WITH ROLE-SPECIFIC PROFILE =======

  async registerWithProfile(
    userData: Omit<
      Prisma.UserCreateInput,
      'independentDetails' | 'cooperateDetails' | 'affiliateDetails'
    >,
    role: Role,
    profileData: Record<string, any>,
  ): Promise<User> {
    return prisma.$transaction(async (tx) => {
      // Create base user
      const user = await tx.user.create({
        data: userData,
        include: {
          independentDetails: true,
          cooperateDetails: true,
          affiliateDetails: true,
        },
      });

      // Create role-specific profile
      const profileCreators: Partial<Record<Role, () => Promise<any>>> = {
        [Role.INDEPENDENT_AGENT]: () =>
          tx.independentAgent.create({
            data: {
              userId: user.id,
              certifications: profileData.certifications || [],
              howDidYouHear: profileData.howDidYouHear,
            },
          }),

        [Role.COOPERATE_AGENT]: () =>
          tx.cooperateAgent.create({
            data: {
              userId: user.id,
              companyName: profileData.companyName,
              travelBusinessDescription: profileData.travelBusinessDescription,
              howDidYouHear: profileData.howDidYouHear,
            },
          }),

        [Role.AFFILIATE]: () =>
          tx.affiliate.create({
            data: {
              userId: user.id,
              communityBrand: profileData.communityBrand,
              socialLinks: profileData.socialLinks || [],
              howDidYouHear: profileData.howDidYouHear,
            },
          }),
      };

      const createProfile = profileCreators[role];
      if (createProfile) {
        await createProfile();
      }

      // Fetch complete user with profile
      return tx.user.findUniqueOrThrow({
        where: { id: user.id },
        include: {
          independentDetails: true,
          cooperateDetails: true,
          affiliateDetails: true,
          _count: {
            select: { referees: true },
          },
        },
      });
    });
  }
}
