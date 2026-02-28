import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const JWT_SECRET = (process.env.NEXTAUTH_SECRET ||
  process.env.JWT_SECRET ||
  'your-secret-key') as jwt.Secret;
const RESET_TOKEN_EXPIRY = (process.env.JWT_EXPIRES_IN ||
  '1h') as jwt.SignOptions['expiresIn'];

export class JwtUtil {
  // ============================================
  // ACCESS TOKEN (for authentication)
  // ============================================
  static generateAccessToken(payload: {
    sub: string;
    email: string;
    role: string;
    name: string;
  }): string {
    return jwt.sign(payload, JWT_SECRET, {
      expiresIn: '15m', // 15 minutes
    });
  }

  static verifyAccessToken(token: string): any {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new Error('ACCESS_TOKEN_EXPIRED');
      }
      throw new Error('INVALID_TOKEN');
    }
  }

  // ============================================
  // REFRESH TOKEN (for renewing access tokens)
  // ============================================
  static generateRefreshToken(payload: { sub: string }): string {
    return jwt.sign(payload, JWT_SECRET, {
      expiresIn: '7d', // 7 days
    });
  }

  static verifyRefreshToken(token: string): { sub: string } | null {
    try {
      return jwt.verify(token, JWT_SECRET) as { sub: string };
    } catch {
      return null;
    }
  }

  // ============================================
  // PASSWORD RESET TOKEN (existing)
  // ============================================
  static generateResetToken(userId: string): string {
    return jwt.sign({ userId, type: 'password-reset' }, JWT_SECRET, {
      expiresIn: RESET_TOKEN_EXPIRY,
    });
  }

  static verifyResetToken(token: string): { userId: string } | null {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;

      if (decoded.type !== 'password-reset') {
        return null;
      }

      return { userId: decoded.userId };
    } catch (error) {
      return null;
    }
  }

  // ============================================
  // RANDOM TOKEN GENERATOR (existing)
  // ============================================
  static generateRandomToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }
}
