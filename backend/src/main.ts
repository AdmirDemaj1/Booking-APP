// In your NestJS main.ts file or where you bootstrap your application
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DataSource } from 'typeorm';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  
  // Get the DataSource from the application
  const dataSource = app.get(DataSource);

  console.log("hahahahah3")
  
  // Log connection information
  Logger.log(`Connected to database: ${dataSource.options.database}`, 'Database');
  
  await app.listen(3000);
  console.log('Application is running on: http://localhost:3000');
}
bootstrap();