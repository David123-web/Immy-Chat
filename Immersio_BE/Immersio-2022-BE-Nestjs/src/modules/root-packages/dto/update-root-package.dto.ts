import { PartialType } from '@nestjs/swagger';
import { CreateRootPackageDto } from './create-root-package.dto';

export class UpdateRootPackageDto extends PartialType(CreateRootPackageDto) {}
