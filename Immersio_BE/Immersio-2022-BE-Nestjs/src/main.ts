import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import {DocumentBuilder,
    SwaggerCustomOptions,
    SwaggerModule,} from '@nestjs/swagger';
import { PrismaService } from './modules/prisma/prisma.service';
import { ValidationPipe } from '@nestjs/common';
import { LoggingInterceptor } from './helpers/logging.interceptor';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.enableCors();
    app.use(helmet());
    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
            transformOptions: {
                enableImplicitConversion: true 
            },
        })
    );
    app.enableShutdownHooks();

    const config = new DocumentBuilder()
        .setTitle('Immersio API Documentation - v1.0')
        .setDescription('The Immersio API Documentation - v1.0')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const customOptions: SwaggerCustomOptions = {
        swaggerOptions: {
            persistAuthorization: true,
        },
    };
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document, customOptions);

    const prismaService = app.get(PrismaService);
    app.useGlobalInterceptors(new LoggingInterceptor(prismaService));

    await app.listen(process.env.PORT || 3000);
}
bootstrap();
