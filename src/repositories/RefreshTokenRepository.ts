import { RefreshToken } from '@prisma/client';
import { prisma } from '../lib/prisma';

interface ICreateDTO {
  accountId: string;
  token: string;
}

export class RefreshTokenRepository {
  static create({ accountId, token }: ICreateDTO): Promise<RefreshToken> {
    return prisma.refreshToken.create({
      data: {
        token,
        accountId
      }
    });
  }

  static delete(token: string) {
    return prisma.refreshToken.deleteMany({
      where: {
        token
      }
    });
  }

  static deleteAllByAccountId(accountId: string) {
    return prisma.refreshToken.deleteMany({
      where: {
        accountId
      }
    });
  }

  static async findByToken(token: string): Promise<RefreshToken | null> {
    const refreshToken = await prisma.refreshToken.findFirst({
      where: {
        token
      }
    });
    return refreshToken;
  }
}
