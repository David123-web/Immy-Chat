import {Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    Query,
    Req,} from '@nestjs/common';
import {ApiBearerAuth,
    ApiHeader,
    ApiResponse,
    ApiTags,} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { DialogCharactersService } from './dialog-characters.service';
import { CreateDialogCharacterDto } from './dto/create-dialog-character.dto';
import FindDialogCharactersDto from './dto/find-dialog-characters.dto';
import { UpdateDialogCharacterDto } from './dto/update-dialog-character.dto';
import { SubdomainHeader } from 'src/helpers/common';

@ApiTags('dialog-characters')
@Controller('dialog-characters')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiHeader(SubdomainHeader)
export class DialogCharactersController {
    constructor(
        private readonly dialogCharactersService: DialogCharactersService
    ) {}

    @ApiResponse({
        status: 200,
        description: 'Create dialog character',
    })
    @Post()
    create(@Req() req: any, @Body() createDialogCharacterDto: CreateDialogCharacterDto) {
        return this.dialogCharactersService.create(req.subdomainId, createDialogCharacterDto);
    }

    @ApiResponse({
        status: 200,
        description: 'Get all dialog characters',
    })
    @Get()
    findAll(@Req() req: any, @Query() dto: FindDialogCharactersDto) {
        return this.dialogCharactersService.findAll(req.subdomainId, dto);
    }

    @ApiResponse({
        status: 200,
        description: 'Get details dialog character by id',
    })
    @Get(':id')
    findOne(@Req() req: any, @Param('id') id: string) {
        return this.dialogCharactersService.findOne(req.subdomainId, +id);
    }

    @ApiResponse({
        status: 200,
        description: 'Update dialog character by id',
    })
    @Patch(':id')
    update(
        @Req() req: any, 
        @Param('id') id: string,
        @Body() updateDialogCharacterDto: UpdateDialogCharacterDto
    ) {
        return this.dialogCharactersService.update(
            req.subdomainId,
            req.user.id,
            +id,
            updateDialogCharacterDto
        );
    }

    @ApiResponse({
        status: 200,
        description: 'Delete dialog character by id',
    })
    @Delete(':id')
    remove(@Req() req: any, @Param('id') id: string) {
        return this.dialogCharactersService.remove(req.subdomainId, req.user.id, +id);
    }
}
