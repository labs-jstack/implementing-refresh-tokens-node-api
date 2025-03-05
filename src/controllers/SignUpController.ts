import { hash } from 'bcryptjs';
import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { AccountsRepository } from '../repositories/AccountsRepository';

export class SignUpController {
  static schema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
    name: z.string().min(2)
  });

  static  handle = async (request: FastifyRequest, reply: FastifyReply) => {
    const result = this.schema.safeParse(request.body);
    if(!result.success) {
      return reply.code(400). send({ erros: result.error.issues });
    }
    const { email, password, name } = result.data;
    const isEmailAlreadyUsed = await AccountsRepository.findByEmail(email);
    if(isEmailAlreadyUsed) {
      return reply.code(409).send({ errors: 'Email already in use.' });
    }
    const passwordHashed = await hash(password, 10);
    const account = await AccountsRepository.create({ email, name, password: passwordHashed });
    // const accessToken = await reply.jwtSign({ sub: account.id });
    return reply.code(200).send({ account });
  };
}
