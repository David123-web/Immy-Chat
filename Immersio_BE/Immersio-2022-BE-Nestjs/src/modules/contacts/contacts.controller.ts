import { Body, Controller, Post, Req } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { ContactsService } from './contacts.service';
import { CreateContactMessageDto } from './dto/create-contact-message.dto';

@ApiTags('contacts')
@Controller('contacts')
export class ContactsController {
    constructor(private readonly contactsService: ContactsService) {}

    @ApiResponse({
        status: 200,
        description: 'Create contact message',
    })
    @Post()
    send(@Req() req: any, @Body() dto: CreateContactMessageDto) {
        const subdomainId = req.subdomainId;
        return this.contactsService.send(dto, subdomainId);
    }
}
