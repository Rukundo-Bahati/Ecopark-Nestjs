import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserQuizAttemptDto } from './dto/create-user-quiz-attempt.dto';
import { UpdateUserQuizAttemptDto } from './dto/update-user-quiz-attempt.dto';

@Injectable()
export class UserQuizAttemptsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateUserQuizAttemptDto) {
    return this.prisma.userQuizAttempt.create({ data: dto });
  }

  async findAll() {
    return this.prisma.userQuizAttempt.findMany();
  }

  async findOne(id: string) {
    const attempt = await this.prisma.userQuizAttempt.findUnique({
      where: { id },
    });
    if (!attempt) throw new NotFoundException('User quiz attempt not found');
    return attempt;
  }

  async update(id: string, dto: UpdateUserQuizAttemptDto) {
    return this.prisma.userQuizAttempt.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.prisma.userQuizAttempt.delete({ where: { id } });
    return { message: 'User quiz attempt deleted' };
  }
}
