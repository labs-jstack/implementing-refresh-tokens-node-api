import { JwtPayload, sign, verify } from 'jsonwebtoken';
import { env } from '../config/env';

export class RefreshToken {
  static secret = env.REFRESH_TOKEN_SECRET;
  static generate(accountId: string) {
    return sign(
      { sub: accountId },
      this.secret,
      { expiresIn: '10d' }
    );
  }

  static validate(token: string) {
    try {
      const payload = verify(token, this.secret) as JwtPayload;
      return payload.sub;
    } catch {
      return;
    }
  }
}
