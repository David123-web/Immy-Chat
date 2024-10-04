import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { CreateStorageProratedPriceDto, CreateStudentProratedPriceDto, CreateSubdomainPlanDto } from './create-subdomain-plan.dto';

export class UpdateSubdomainPlanDto extends PartialType(CreateSubdomainPlanDto) {}
