import { Account } from '@prisma/client';
import { prisma } from '../lib/prisma';

interface ICreateDTO {
  email: string;
  password: string;
  name: string;
}

export class AccountsRepository {
  static async findByEmail(email: string): Promise<Account | null> {
    const account = await prisma.account.findUnique({
      where: {
        email
      }
    });
    return account;
  }

  static async create({email, name, password}: ICreateDTO): Promise<Account> {
    return prisma.account.create({
      data: {
        email,
        name,
        password
      }
    });
  }
}
