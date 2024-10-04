import { ApiProperty } from '@nestjs/swagger';
import { RootSettingKey } from '@prisma/client';

export class SetRootSettingsDto {
    @ApiProperty({
        enum: RootSettingKey
    })
        key: RootSettingKey;

    @ApiProperty()
        value: string;
}
