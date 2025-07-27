import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateQuizQuestionDto } from './dto/create-quiz-question.dto';
import { UpdateQuizQuestionDto } from './dto/update-quiz-question.dto';

@Injectable()
export class QuizQuestionsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateQuizQuestionDto) {
    return this.prisma.quizQuestion.create({ data: dto });
  }

  async findAll() {
    return this.prisma.quizQuestion.findMany();
  }

  async findOne(id: string) {
    const question = await this.prisma.quizQuestion.findUnique({
      where: { id },
    });
    if (!question) throw new NotFoundException('Quiz question not found');
    return question;
  }

  async update(id: string, dto: UpdateQuizQuestionDto) {
    return this.prisma.quizQuestion.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.prisma.quizQuestion.delete({ where: { id } });
    return { message: 'Quiz question deleted' };
  }
}
