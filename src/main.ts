import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Users Management')
    .setDescription('Nestjs API to manager Users & Documents')
    .setVersion('1.0')
    .addTag('JK API')
    .addBearerAuth({ type: 'http' })
    .addServer('http://localhost:7001')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(7002);
}
bootstrap();
