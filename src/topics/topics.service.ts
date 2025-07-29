import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; // Adjust path to your PrismaService
import { CreateTopicDto } from './dto/create-topic.dto';
import { UpdateTopicDto } from './dto/update-topic.dto';
import { CustomApiResponse } from 'src/@types/response';

@Injectable()
export class TopicsService {
  constructor(private prisma: PrismaService) {}

  async create(createTopicDto: CreateTopicDto) {
    return this.prisma.topic.create({
      data: createTopicDto,
    });
  }

  async findAll() {
    return this.prisma.topic.findMany();
  }

  async findOne(id: string) {
    const topic = await this.prisma.topic.findUnique({ where: { id } });
    if (!topic) throw new NotFoundException(`Topic ${id} not found`);
    return topic;
  }

  async update(
      id: string,
      dto: UpdateTopicDto,
    ): Promise<CustomApiResponse<null>> {
      try {
        const existingtopic = await this.prisma.topic.findUnique({
          where: { id },
        });
  
        if (!existingtopic) {
          throw new NotFoundException(`topic with ID ${id} not found`);
        }
  
        const updatedDto = await this.prisma.topic.update({
          where: { id },
          data: {
            ...dto,
            updatedAt: new Date(),
          },
        });
  
        return new CustomApiResponse(
          true,
          'Topic updated successfully',
          null,
          null,
        );
      } catch (error) {
        return new CustomApiResponse(
          false,
          error.message ?? 'Something went wrong',
          null,
          error,
        );
      }
    }

  async deleteTopic(id: string): Promise<CustomApiResponse<null>> {
      try {
        const topic = await this.prisma.topic.findUnique({ where: { id } });
  
        if (!topic) {
          return new CustomApiResponse(false, 'Invalid Topic ID', null);
        }
  
        await this.prisma.topic.update({
          where: { id },
          data: {},
        });
  
        return new CustomApiResponse(true, 'Topic  deleted!', null);
      } catch (error) {
        return new CustomApiResponse(
          false,
          'Something went wrong',
          null,
          error,
        );
      }
    }
}
