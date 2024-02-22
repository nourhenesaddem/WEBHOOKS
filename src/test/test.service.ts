import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Test } from './Entity/test.entity';
import { Repository } from 'typeorm';
import { CreateTestDto } from './dto/create.test.dto';

@Injectable()
export class TestService {
  constructor(
    @InjectRepository(Test)
    private readonly testRepository: Repository<Test>,
  ) {}

  async getAll(): Promise<Test[]> {
    return this.testRepository.find();
  }
  async create(dto: CreateTestDto): Promise<Test> {
    const test = this.testRepository.create(dto);
    return this.testRepository.save(test);
  }
}
