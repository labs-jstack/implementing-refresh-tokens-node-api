import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { RefreshToken } from '../lib/RefreshToken';
import { RefreshTokenRepository } from '../repositories/RefreshTokenRepository';

export class RefreshTokenController {
  static schema = z.object({
    refreshToken: z.string()
  });

  static handle = async (request: FastifyRequest, reply: FastifyReply) => {
    const result = this.schema.safeParse(request.body);
    if(!result.success) {
      return reply.code(400).send({ errors: result.error.issues });
    }
    const { refreshToken } = result.data;
    const accountId = RefreshToken.validate(refreshToken);
    if(!accountId) {
      await RefreshTokenRepository.delete(refreshToken);
      return reply.code(400).send({ errors: 'Invalid refresh token' });
    }
    const refreshTokenAlreadyUsed = await RefreshTokenRepository.findByToken(refreshToken);
    if(!refreshTokenAlreadyUsed) {
      await RefreshTokenRepository.deleteAllByAccountId(accountId);
      return reply.code(401).send({ errors: 'Invalid refresh token' });
    }
    const newAccessToken = await reply.jwtSign({ sub: accountId });
    const newRefreshToken = RefreshToken.generate(accountId);
    Promise.all([
      RefreshTokenRepository.delete(refreshToken),
      RefreshTokenRepository.create({accountId, token: newRefreshToken})
    ]);
    return reply.code(200).send({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken
    });
  };
}
