import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class VnpayPaymentService {
    constructor(
    private readonly prisma: PrismaService,
    ) {}

    async webhook(event: any) {
   
    }
}
