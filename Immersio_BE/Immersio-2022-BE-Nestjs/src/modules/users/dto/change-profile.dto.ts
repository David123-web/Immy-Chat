import { ApiPropertyOptional } from '@nestjs/swagger';
import { Gender } from '@prisma/client';
import { UpdateUserSocialDto } from '../../role-management/dto/update-user-social.dto';
import { BaseProfileDto } from './base-profile.dto';

export default class ChangeProfileDto extends BaseProfileDto{

    @ApiPropertyOptional({
        type: String 
    })
        address?: string;

    @ApiPropertyOptional({
        type: String 
    })
        avatarUrl?: string;

    @ApiPropertyOptional({
        type: Date 
    })
        dob?: Date;

    @ApiPropertyOptional({
        enum: Gender, default: Gender.OTHER 
    }) 
        gender?: Gender;

    @ApiPropertyOptional({
        type: String 
    })
        phoneNumber?: string;

    @ApiPropertyOptional({
        type: UpdateUserSocialDto 
    })
        socialLinks?: UpdateUserSocialDto;
}
