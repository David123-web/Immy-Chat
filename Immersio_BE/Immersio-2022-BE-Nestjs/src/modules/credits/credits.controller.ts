// import { Controller, Get, Req, UseGuards } from '@nestjs/common';
// import {ApiBearerAuth,
//     ApiHeader,
//     ApiResponse,
//     ApiTags,} from '@nestjs/swagger';
// import { JwtAuthGuard } from '../auth/jwt-auth.guard';
// import { CreditsService } from './credits.service';

// @Controller('credits')
// @ApiTags('credits')
// @ApiBearerAuth()
// @ApiHeader({
//     name: 'subdomainid',
//     description: 'Subdomain ID',
// })
// @UseGuards(JwtAuthGuard)
// export class CreditsController {
//     constructor(private readonly creditsService: CreditsService) {}

//     @ApiResponse({
//         status: 200,
//         description: 'Get credits',
//     })
//     @Get()
//     getCredit(@Req() req: any) {
//         return this.creditsService.get(req.user.id);
//     }
// }
