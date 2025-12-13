import { Injectable, ConflictException, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JobOffer } from './entities/job-offer.entity';
import { CreateJobOfferDto } from './dto/create-job-offer.dto';
import { UpdateJobOfferDto } from './dto/update-job-offer.dto';
import axios from 'axios';

@Injectable()
export class JobOffersService {
  private readonly logger = new Logger(JobOffersService.name);
  private readonly webhookUrl =
    'https://n8n.draw-me-the-moon.fr/webhook/58fc3205-46d2-4492-b75e-02dc5eed601a';

  constructor(
    @InjectRepository(JobOffer)
    private readonly jobOfferRepository: Repository<JobOffer>,
  ) {}

  async create(createJobOfferDto: CreateJobOfferDto): Promise<JobOffer> {
    // Vérifier les doublons
    if (createJobOfferDto.name) {
      const existingByName = await this.jobOfferRepository.findOne({
        where: { name: createJobOfferDto.name },
      });

      if (existingByName) {
        throw new ConflictException(
          `Une offre avec le nom "${createJobOfferDto.name}" existe déjà`,
        );
      }
    }

    const existingBySlug = await this.jobOfferRepository.findOne({
      where: { slug: createJobOfferDto.slug },
    });

    if (existingBySlug) {
      throw new ConflictException(`Une offre avec le slug "${createJobOfferDto.slug}" existe déjà`);
    }

    const existingByUrl = await this.jobOfferRepository.findOne({
      where: { url: createJobOfferDto.url },
    });

    if (existingByUrl) {
      throw new ConflictException(`Une offre avec l'URL "${createJobOfferDto.url}" existe déjà`);
    }

    const jobOffer = this.jobOfferRepository.create(createJobOfferDto);
    const savedJobOffer = await this.jobOfferRepository.save(jobOffer);

    // Appeler le webhook n8n
    await this.callWebhook(savedJobOffer);

    return savedJobOffer;
  }

  async findAll(): Promise<JobOffer[]> {
    return await this.jobOfferRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<JobOffer> {
    const jobOffer = await this.jobOfferRepository.findOne({ where: { id } });
    if (!jobOffer) {
      throw new NotFoundException(`JobOffer with ID "${id}" not found`);
    }
    return jobOffer;
  }

  async findBySlug(slug: string): Promise<JobOffer> {
    const jobOffer = await this.jobOfferRepository.findOne({ where: { slug } });
    if (!jobOffer) {
      throw new NotFoundException(`JobOffer with slug "${slug}" not found`);
    }
    return jobOffer;
  }

  async remove(id: string): Promise<void> {
    const jobOffer = await this.findOne(id);
    await this.jobOfferRepository.remove(jobOffer);
  }

  async update(id: string, updateJobOfferDto: UpdateJobOfferDto): Promise<JobOffer> {
    const jobOffer = await this.findOne(id);

    // Mettre à jour les champs fournis
    Object.assign(jobOffer, updateJobOfferDto);

    return await this.jobOfferRepository.save(jobOffer);
  }

  async updateBySlug(slug: string, updateJobOfferDto: UpdateJobOfferDto): Promise<JobOffer> {
    const jobOffer = await this.findBySlug(slug);

    // Mettre à jour les champs fournis
    Object.assign(jobOffer, updateJobOfferDto);

    return await this.jobOfferRepository.save(jobOffer);
  }

  async upsert(createJobOfferDto: CreateJobOfferDto): Promise<JobOffer> {
    // Chercher l'offre existante par slug
    const existingOffer = await this.jobOfferRepository.findOne({
      where: { slug: createJobOfferDto.slug },
    });

    if (existingOffer) {
      // Mettre à jour l'offre existante
      this.logger.log(`Mise à jour de l'offre existante: ${existingOffer.id}`);
      Object.assign(existingOffer, createJobOfferDto);
      const updatedOffer = await this.jobOfferRepository.save(existingOffer);

      // Appeler le webhook pour l'offre mise à jour
      await this.callWebhook(updatedOffer);

      return updatedOffer;
    } else {
      // Créer une nouvelle offre (utilise la logique create existante avec webhook)
      this.logger.log(`Création d'une nouvelle offre: ${createJobOfferDto.slug}`);
      return await this.create(createJobOfferDto);
    }
  }

  private async callWebhook(jobOffer: JobOffer): Promise<void> {
    try {
      this.logger.log(`Envoi de l'offre au webhook: ${jobOffer.id}`);
      await axios.post(this.webhookUrl, {
        id: jobOffer.id,
        name: jobOffer.name,
        slug: jobOffer.slug,
        url: jobOffer.url,
        createdAt: jobOffer.createdAt,
      });
      this.logger.log('Webhook appelé avec succès');
    } catch (error) {
      this.logger.error(`Erreur lors de l'appel du webhook: ${error.message}`);
      // Ne pas bloquer la création si le webhook échoue
    }
  }
}
