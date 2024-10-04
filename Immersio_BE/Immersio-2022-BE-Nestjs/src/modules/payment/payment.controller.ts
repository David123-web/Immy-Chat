import { Body, Controller, Post, Get, Res, BadRequestException } from '@nestjs/common';
import { Param, Query, Req, UseGuards } from '@nestjs/common/decorators';
import { ApiBearerAuth, ApiHeader, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import PaypalCancelSubscriptionDto from './dto/paypal-cancel-subscription.dto';
import PaypalOneTimePaymentDto from './dto/paypal-one-time-payment.dto';
import PaypalSubscribeDto from './dto/paypal-subscribe.dto';
import StripeCancelSubscriptionDto from './dto/stripe-cancel-subscription.dto';
import StripeOneTimePaymentDto from './dto/stripe-one-time-payment.dto';
import StripeSubscribeDto from './dto/stripe-subscribe.dto';
import { PaypalPaymentService } from './paypal.service';
import { StripePaymentService } from './stripe.service';
import { VnpayPaymentService } from './vnpay.service';
import { UserAccountService } from 'src/business-services/user-account-services/user-account.service'; 
import { SubdomainHeader } from 'src/helpers/common';
import { PaymentService } from './payment.service';
import { RolesGuard } from '../auth/roles.guard';
import { PaymentMethod, Role } from '@prisma/client';
import { Roles } from '../auth/roles.decorator';
import { PurchaseWithCreditDTO } from 'src/business-services/user-account-services/dto/purchase-with-credit.dto';

@ApiTags('payment')
@Controller('payment')
@ApiHeader(SubdomainHeader)
export class PaymentController {
    constructor(
    private readonly stripePaymentService: StripePaymentService,
    private readonly vnpayPaymentService: VnpayPaymentService,
    private readonly paypalPaymentService: PaypalPaymentService,
    private readonly paymentService: PaymentService,
    private readonly userAccountService: UserAccountService
    ) {}

  @ApiResponse({
      status: 200,
      description: 'Returns enum of course types: PAID, WITH_SUBSCRIPTION, FREE ',
  })
  @Get('product-types')
    async getPaymentTypes() {
        return await this.paymentService.getProductTypes();
    }

  @Get('check-and-issue-invoice')
  checkAndIssueInvoice() {
      this.paymentService.checkAndIssueInvoice();
  }

  @ApiResponse({
      status: 200,
      description: 'Get paypal subscription success',
  })
  @Get('paypal/success')
  payWithPaypalSuccess(@Query() data: any) {
      this.paypalPaymentService.success(data);
  }

  @ApiResponse({
      status: 200,
      description: 'Get all paypal subscriptions',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('subscriptions')
  getSubscriptions(@Req() req: any) {
      return this.paypalPaymentService.findAll(req.user.id);
  }

  @ApiResponse({
      status: 200,
      description: 'Create stripe subscription cancel',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('paypal/subscriptions/cancel')
  cancelWithPaypal(
    @Req() req: any,
    @Body() { id }: PaypalCancelSubscriptionDto
  ) {
      return this.paypalPaymentService.cancel(req.subdomainId, req.user.id, id);
  }

  @ApiResponse({
      status: 200,
      description: 'Create paypal subscription',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('paypal/subscriptions')
  subscribeWithPaypal(@Req() req: any, @Body() dto: PaypalSubscribeDto) {
      const { subdomainId, user } = req;
      return this.paypalPaymentService.subscribe(subdomainId, user.id, dto);
  }

  @ApiResponse({
      status: 200,
      description: 'Create paypal webhook',
  })
  @Post('paypal/webhook')
  webhook(@Body() data: any) {
      return this.paypalPaymentService.webhook(data);
  }

  @ApiResponse({
      status: 200,
      description: 'Get stripe subscription',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('stripe/subscriptions')
  subscribeWithStripe(@Req() req: any, @Body() dto: StripeSubscribeDto) {
      const { subdomainId, user } = req;
      return this.stripePaymentService.subscribe(
          subdomainId,
          user.id,
          dto.planId
      );
  }

  @ApiResponse({
      status: 200,
      description: 'Create stripe webhook',
  })
  @Post('stripe/webhook')
  stripeWebhook(@Body() data: any) {
      return this.stripePaymentService.webhook(data);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('purchase-with-credit')
  purchaseWithCredit(@Req() req: any,@Body() dto: PurchaseWithCreditDTO) {
      dto.subdomainId = req.subdomainId;    dto.subdomainId = req.subdomainId;
      if(dto.paymentMethod === PaymentMethod.IMMERSIO_CREDIT){
          return this.userAccountService.purchaseWithCredit(dto);
      } else {
          throw new BadRequestException('Only Purchase By Credit Allowed');
      }
  }

  @ApiResponse({
      status: 200,
      description: 'Create stripe subscription cancel',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('stripe/subscriptions/cancel')
  cancelWithStripe(@Req() req: any, @Body() dto: StripeCancelSubscriptionDto) {
      const { subdomainId, user } = req;
      return this.stripePaymentService.cancelSubscription(
          subdomainId,
          user.id,
          dto.id
      );
  }
}

