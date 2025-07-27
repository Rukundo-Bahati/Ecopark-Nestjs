import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEnvironmentalDataDto } from './dto/create-environmental-data.dto';
import { UpdateEnvironmentalDataDto } from './dto/update-environmental-data.dto';

@Injectable()
export class EnvironmentalDataService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateEnvironmentalDataDto) {
    return this.prisma.environmentalData.create({ data: dto });
  }

  async findAll() {
    return this.prisma.environmentalData.findMany();
  }

  async findOne(id: string) {
    const data = await this.prisma.environmentalData.findUnique({
      where: { id },
    });
    if (!data) throw new NotFoundException('Environmental data not found');
    return data;
  }

  async update(id: string, dto: UpdateEnvironmentalDataDto) {
    return this.prisma.environmentalData.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.prisma.environmentalData.delete({ where: { id } });
    return { message: 'Environmental data deleted' };
  }
}
