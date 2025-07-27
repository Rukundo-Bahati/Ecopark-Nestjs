import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { EnvironmentalDataService } from './environmental-data.service';
import { CreateEnvironmentalDataDto } from './dto/create-environmental-data.dto';
import { UpdateEnvironmentalDataDto } from './dto/update-environmental-data.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { MyLoggerService } from '../my-logger/my-logger.service';

@ApiTags('environmental-data')
@Controller('environmental-data')
export class EnvironmentalDataController {
  constructor(
    private readonly environmentalDataService: EnvironmentalDataService,
    private readonly logger: MyLoggerService,
  ) {
    this.logger.setContext(EnvironmentalDataController.name);
  }

  @ApiBearerAuth('Bearer')
  @ApiOperation({ summary: 'Create a new environmental data record' })
  @ApiResponse({
    status: 201,
    description: 'Environmental data created successfully.',
  })
  @Post()
  async create(@Body() dto: CreateEnvironmentalDataDto) {
    this.logger.log(
      `Create environmental data request: source ${dto.source}, type ${dto.dataType}, location ${dto.location}`,
    );
    const result = await this.environmentalDataService.create(dto);
    this.logger.log(
      `Create environmental data ${result ? 'successful' : 'failed'}: source ${dto.source}, type ${dto.dataType}`,
    );
    return result;
  }

  @ApiBearerAuth('Bearer')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get all environmental data records' })
  @ApiResponse({
    status: 200,
    description: 'List of environmental data records.',
  })
  @Get()
  async findAll() {
    this.logger.log('Get all environmental data request');
    const result = await this.environmentalDataService.findAll();
    this.logger.log(
      `Get all environmental data successful, found ${result.length} environmental data entries`,
    );
    return result;
  }

  @ApiBearerAuth('Bearer')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get an environmental data record by ID' })
  @ApiResponse({ status: 200, description: 'Environmental data details.' })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    this.logger.log(`Get environmental data request: ${id}`);
    const result = await this.environmentalDataService.findOne(id);
    this.logger.log(
      `Get environmental data ${result ? 'successful' : 'failed'}: ${id}`,
    );
    return result;
  }

  @ApiBearerAuth('Bearer')
  @ApiOperation({ summary: 'Update an environmental data record' })
  @ApiResponse({
    status: 200,
    description: 'Environmental data updated successfully.',
  })
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateEnvironmentalDataDto,
  ) {
    this.logger.log(
      `Update environmental data request: ${id}, updates: ${JSON.stringify(dto)}`,
    );
    const result = await this.environmentalDataService.update(id, dto);
    this.logger.log(
      `Update environmental data ${result ? 'successful' : 'failed'}: ${id}`,
    );
    return result;
  }

  @ApiBearerAuth('Bearer')
  @ApiOperation({ summary: 'Delete an environmental data record' })
  @ApiResponse({
    status: 200,
    description: 'Environmental data deleted successfully.',
  })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    this.logger.log(`Delete environmental data request: ${id}`);
    const result = await this.environmentalDataService.remove(id);
    this.logger.log(
      `Delete environmental data ${result ? 'successful' : 'failed'}: ${id}`,
    );
    return result;
  }
}
