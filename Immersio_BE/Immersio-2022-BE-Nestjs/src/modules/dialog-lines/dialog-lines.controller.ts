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
    ApiTags, ApiBasicAuth} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { DialogLinesService } from './dialog-lines.service';
import { CreateDialogLineDto } from './dto/create-dialog-line.dto';
import FindDialogLinesDto from './dto/find-dialog-lines.dto';
import { UpdateDialogLineDto } from './dto/update-dialog-line.dto';
import { CreateDialogLineAIDataDto } from './dto/create-dialog-line-ai.dto';
import { UpdateDialogLineAIDataDto } from './dto/update-dialog-line-ai-data.dto';
import { SubdomainHeader } from 'src/helpers/common';
import { BasicAuthGuard } from '../auth/basic-auth.guard';
import { FindDialogsDto } from '../dialogs/dto/find-dialogs.dto';

@ApiTags('dialog-lines')
@Controller('dialog-lines')
@ApiHeader(SubdomainHeader)
export class DialogLinesController {
    constructor(private readonly dialogLinesService: DialogLinesService) {}

    @ApiResponse({
        status: 200,
        description: 'Create dialog line',
    })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Post()
    create(@Body() createDialogLineDto: CreateDialogLineDto) {
        return this.dialogLinesService.create(createDialogLineDto);
    }

    @ApiResponse({
        status: 200,
        description: 'Get all dialog lines',
    })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Get()
    findAll(@Query() dto: FindDialogLinesDto) {
        return this.dialogLinesService.findAll(dto);
    }

    @ApiResponse({
        status: 200,
        description: 'Get all dialog by dialogid',
    })
    @ApiBasicAuth()
    @UseGuards(BasicAuthGuard)
    @Get('immy')
    findAllforImmy(@Query() dto: FindDialogsDto) {
        return this.dialogLinesService.findAlldialoglinesByLessonId(dto);
    }


    @ApiResponse({
        status: 200,
        description: 'Get details dialog line by id',
    })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.dialogLinesService.findOne(+id);
    }

    @ApiResponse({
        status: 200,
        description: 'Update dialog line by id',
    })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body() updateDialogLineDto: UpdateDialogLineDto
    ) {
        return this.dialogLinesService.update(+id, updateDialogLineDto);
    }

    @ApiResponse({
        status: 200,
        description: 'Delete dialog line by id',
    })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.dialogLinesService.remove(+id);
    }

    @ApiResponse({
        status: 200,
        description: 'Create dialog line AI data',
    })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Post(':id/ai-data')
    createAIData(
        @Req() req,
        @Param('id') dialogLineId: number,
        @Body() createDialogLineAIDataDto: CreateDialogLineAIDataDto
    ) {
        return this.dialogLinesService.createAIData(
            req.subdomainId,
            dialogLineId,
            createDialogLineAIDataDto
        );
    }

    @ApiResponse({
        status: 200,
        description: 'Update dialog line AI data',
    })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Patch(':id/ai-data')
    updateAIData(
        @Req() req,
        @Param('id') dialogLineId: number,
        @Body() updateDialogLineAIDataDto: UpdateDialogLineAIDataDto
    ) {
        return this.dialogLinesService.updateAIData(
            req.subdomainId,
            dialogLineId,
            updateDialogLineAIDataDto
        );
    }

    @ApiResponse({
        status: 200,
        description: 'Get all dialog lines AI data',
    })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Get(':id/ai-data')
    getAIData(@Req() req, @Param('id') dialogLineId: number) {
        return this.dialogLinesService.findAllAIData(
            req.subdomainId,
            dialogLineId
        );
    }
}
