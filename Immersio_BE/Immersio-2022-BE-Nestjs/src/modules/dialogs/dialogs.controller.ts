import {Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    Query,} from '@nestjs/common';
import {ApiBearerAuth,
    ApiHeader,
    ApiResponse,
    ApiTags,  ApiBasicAuth} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { DialogsService } from './dialogs.service';
import { CreateDialogDto } from './dto/create-dialog.dto';
import { UpdateDialogDto } from './dto/update-dialog.dto';
import { FindDialogsDto } from './dto/find-dialogs.dto';
import { SubdomainHeader } from 'src/helpers/common';
import { BasicAuthGuard } from '../auth/basic-auth.guard';


@ApiTags('dialogs')
@Controller('dialogs')
@ApiHeader(SubdomainHeader)
export class DialogsController {
    constructor(private readonly dialogsService: DialogsService) {}

    @ApiResponse({
        status : 200,
        description: 'Get all dialogs by lesson id for Immy',
    })
    @ApiBasicAuth()
    @UseGuards(BasicAuthGuard)
    @Get('immy')
    findAllDialogs(@Query() dto: FindDialogsDto) {
        return this.dialogsService.findAllByLessondto(dto);
    }

    @ApiResponse({
        status: 200,
        description: 'Create dialog',
    })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Post()
    create(@Body() createDialogDto: CreateDialogDto) {
        return this.dialogsService.create(createDialogDto);
    }
    
    @ApiResponse({
        status: 200,
        description: 'Get details dialog by id',
    })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.dialogsService.findOneById(+id);
    }
    

    @ApiResponse({
        status: 200,
        description: 'Update dialog by id',
    })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Patch(':id')
    update(@Param('id') id: string, @Body() updateDialogDto: UpdateDialogDto) {
        return this.dialogsService.update(+id, updateDialogDto);
    }

    @ApiResponse({
        status: 200,
        description: 'Delete dialog by id',
    })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.dialogsService.remove(+id);
    }





    

}
