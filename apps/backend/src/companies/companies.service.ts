import { Injectable, ConflictException, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JobOffer } from './entities/company.entity';
import { CreateJobOfferDto } from './dto/create-company.dto';
import { UpdateJobOfferDto } from './dto/update-company.dto';
import axios from 'axios';

@Injectable()
export class CompaniesService {
  private readonly logger = new Logger(CompaniesService.name);
  private readonly webhookUrl =
    'https://n8n.draw-me-the-moon.fr/webhook-test/58fc3205-46d2-4492-b75e-02dc5eed601a';

  constructor(
    @InjectRepository(JobOffer)
    private readonly companyRepository: Repository<JobOffer>,
  ) {}

  async create(createJobOfferDto: CreateJobOfferDto): Promise<JobOffer> {
    // Vérifier les doublons
    if (createJobOfferDto.name) {
      const existingByName = await this.companyRepository.findOne({
        where: { name: createJobOfferDto.name },
      });

      if (existingByName) {
        throw new ConflictException(
          `Une offre avec le nom "${createJobOfferDto.name}" existe déjà`,
        );
      }
    }

    const existingBySlug = await this.companyRepository.findOne({
      where: { slug: createJobOfferDto.slug },
    });

    if (existingBySlug) {
      throw new ConflictException(`Une offre avec le slug "${createJobOfferDto.slug}" existe déjà`);
    }

    const existingByUrl = await this.companyRepository.findOne({
      where: { url: createJobOfferDto.url },
    });

    if (existingByUrl) {
      throw new ConflictException(`Une offre avec l'URL "${createJobOfferDto.url}" existe déjà`);
    }

    const company = this.companyRepository.create(createJobOfferDto);
    const savedJobOffer = await this.companyRepository.save(company);

    // Appeler le webhook n8n
    try {
      this.logger.log(`Envoi de l'offre au webhook: ${savedJobOffer.id}`);
      await axios.post(this.webhookUrl, {
        id: savedJobOffer.id,
        name: savedJobOffer.name,
        slug: savedJobOffer.slug,
        url: savedJobOffer.url,
        createdAt: savedJobOffer.createdAt,
      });
      this.logger.log('Webhook appelé avec succès');
    } catch (error) {
      this.logger.error(`Erreur lors de l'appel du webhook: ${error.message}`);
      // Ne pas bloquer la création si le webhook échoue
    }

    return savedJobOffer;
  }

  async findAll(): Promise<JobOffer[]> {
    return await this.companyRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<JobOffer> {
    const company = await this.companyRepository.findOne({ where: { id } });
    if (!company) {
      throw new NotFoundException(`JobOffer with ID "${id}" not found`);
    }
    return company;
  }

  async findBySlug(slug: string): Promise<JobOffer> {
    const company = await this.companyRepository.findOne({ where: { slug } });
    if (!company) {
      throw new NotFoundException(`JobOffer with slug "${slug}" not found`);
    }
    return company;
  }

  async remove(id: string): Promise<void> {
    const company = await this.findOne(id);
    await this.companyRepository.remove(company);
  }

  async update(id: string, updateJobOfferDto: UpdateJobOfferDto): Promise<JobOffer> {
    const company = await this.findOne(id);

    // Mettre à jour les champs fournis
    Object.assign(company, updateJobOfferDto);

    return await this.companyRepository.save(company);
  }

  async updateBySlug(slug: string, updateJobOfferDto: UpdateJobOfferDto): Promise<JobOffer> {
    const company = await this.findBySlug(slug);

    // Mettre à jour les champs fournis
    Object.assign(company, updateJobOfferDto);

    return await this.companyRepository.save(company);
  }
}
