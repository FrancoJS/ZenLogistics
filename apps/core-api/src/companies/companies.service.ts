import { Injectable } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
// import { UpdateCompanyDto } from './dto/update-company.dto';
import { EntityManager, Repository } from 'typeorm';
import { Company } from './entities/company.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
  ) {}

  async create(
    dto: CreateCompanyDto,
    manager?: EntityManager,
  ): Promise<Company> {
    const repo = manager
      ? manager.getRepository(Company)
      : this.companyRepository;

    const newCompany = repo.create({
      ...dto,
      isActive: true,
    });

    return repo.save(newCompany);
  }
}
