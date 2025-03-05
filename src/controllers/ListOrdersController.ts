import { FastifyReply, FastifyRequest } from 'fastify';
import { randomUUID } from 'node:crypto';

export class ListOrdersController {
  static handle = async (request: FastifyRequest, reply: FastifyReply) => {
    return reply
      .code(200)
      .send({
        orders: [
          {
            id: randomUUID(),
            orderNumber: '#001',
            date: Date.now()
          },
          {
            id: randomUUID(),
            orderNumber: '#002',
            date: Date.now()
          },
          {
            id: randomUUID(),
            orderNumber: '#003',
            date: Date.now()
          }
        ]
      });
  };
}
