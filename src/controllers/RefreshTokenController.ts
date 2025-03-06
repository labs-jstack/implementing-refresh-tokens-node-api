import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { EXPIRATION_TIME_IN_DAYS } from '../config/constants';
import { RefreshTokenRepository } from '../repositories/RefreshTokenRepository';

export class RefreshTokenController {
  static schema = z.object({
    refreshToken: z.string().uuid()
  });

  static handle = async (request: FastifyRequest, reply: FastifyReply) => {
    const result = this.schema.safeParse(request.body);
    if(!result.success) {
      return reply.code(400).send({ errors: result.error.issues });
    }
    const { refreshToken: refreshTokenId } = result.data;
    const refreshToken = await RefreshTokenRepository.findById(refreshTokenId);
    if(!refreshToken) {
      return reply.code(401).send({ errors: 'Invalid refresh token' });
    }
    if(Date.now() > refreshToken.expiresAt.getTime()) {
      await RefreshTokenRepository.delete(refreshToken.id);
      return reply.code(401).send({ errors: 'Invalid refresh token.' });
    }
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + EXPIRATION_TIME_IN_DAYS);
    const [newRefreshToken, accessToken] = await Promise.all([
      RefreshTokenRepository.create({ accountId: refreshToken.accountId, expiresAt }),
      reply.jwtSign({ sub: refreshToken.accountId }),
      RefreshTokenRepository.delete(refreshToken.id),
    ]);
    return reply.code(200).send({
      accessToken,
      refreshToken: newRefreshToken.id
    });
  };
}
