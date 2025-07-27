import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { UpdateQuizDto } from './dto/update-quiz.dto';

@Injectable()
export class QuizzesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateQuizDto) {
    return this.prisma.quiz.create({ data: dto });
  }

  async findAll() {
    return this.prisma.quiz.findMany();
  }

  async findOne(id: string) {
    const quiz = await this.prisma.quiz.findUnique({ where: { id } });
    if (!quiz) throw new NotFoundException('Quiz not found');
    return quiz;
  }

  async update(id: string, dto: UpdateQuizDto) {
    return this.prisma.quiz.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.prisma.quiz.delete({ where: { id } });
    return { message: 'Quiz deleted' };
  }
}
