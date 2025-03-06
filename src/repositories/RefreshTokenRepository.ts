import { RefreshToken } from '@prisma/client';
import { prisma } from '../lib/prisma';

interface ICreateDTO {
  accountId: string;
  expiresAt: Date;
}

export class RefreshTokenRepository {
  static findById(id: string): Promise<RefreshToken | null> {
    const refreshToken = prisma.refreshToken.findUnique({
      where: {
        id
      }
    });
    return refreshToken;
  }

  static create({ accountId, expiresAt }: ICreateDTO): Promise<RefreshToken> {
    return prisma.refreshToken.create({
      data: {
        expiresAt,
        accountId
      }
    });
  }

  static delete(id: string) {
    return prisma.refreshToken.delete({
      where: {
        id
      }
    });
  }
}
