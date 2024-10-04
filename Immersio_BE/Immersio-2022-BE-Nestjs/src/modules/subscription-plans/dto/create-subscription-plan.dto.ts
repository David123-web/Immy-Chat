import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { SubscriptionPlanFeature } from '@prisma/client';
import { Transform } from 'class-transformer';
export class CreateSubscriptionPlanDto {
  @ApiProperty()
      title: string;

  @ApiProperty()
      cost: number;

  @ApiProperty()
      currency: string;

  @ApiPropertyOptional({
      default: '',
  })
      paypalId: string;

  @ApiPropertyOptional({
      default: '',
  })
      stripeProductId: string;

  @ApiPropertyOptional({
      default: '',
  })
      description: string;

  @ApiPropertyOptional({
      default: false,
  })
      trial: boolean;

  @ApiPropertyOptional({
      default: true,
  })
      isActive: boolean;

  @ApiPropertyOptional({
      default: false,
  })
      isPreferred: boolean;

  @ApiProperty()
      term: number;

  @ApiPropertyOptional({
      // Set the default values here
      default: [
          SubscriptionPlanFeature.ALL_COURSES,
          SubscriptionPlanFeature.MY_RECORDINGS,
          SubscriptionPlanFeature.IMMY_CHAT_BOT,
          SubscriptionPlanFeature.TUTOR_MATCH,
      ],
  })
      features: SubscriptionPlanFeature[];
}
