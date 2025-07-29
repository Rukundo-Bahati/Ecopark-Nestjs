import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { UpdateQuizDto } from './dto/update-quiz.dto';

@Injectable()
export class QuizzesService {
  constructor(private readonly prisma: PrismaService) {}

  async createQuiz(dto: CreateQuizDto, userId: string) {
    if (!userId) {
      throw new Error('Invalid or missing user ID');
    }

    // Create the quiz with nested questions (without quizId)
    return this.prisma.quiz.create({
      data: {
        title: dto.title,
        description: dto.description,
        createdById: userId,
        questions: dto.questions?.length
          ? {
              create: dto.questions.map((q) => ({
                question: q.question,
                options: q.options,
                correct: q.correct,
                explanation: q.explanation,
                // quizId not needed here
              })),
            }
          : undefined,
      },
      include: {
        questions: true, // optional: return quiz with questions
      },
    });
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
    const { questions, ...rest } = dto;

    const data: any = {
      ...rest,
    };

    if (questions) {
      // Delete old questions and recreate new ones (simpler approach)
      data.questions = {
        deleteMany: {}, // delete all existing questions for this quiz
        create: questions.map((q) => ({
          question: q.question,
          options: q.options,
          correct: q.correct,
          explanation: q.explanation,
        })),
      };
    }

    return this.prisma.quiz.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    await this.prisma.quiz.delete({ where: { id } });
    return { message: 'Quiz deleted' };
  }
}
