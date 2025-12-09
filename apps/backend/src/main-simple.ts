import { NestFactory } from '@nestjs/core';
import { Controller, Get, Module } from '@nestjs/common';

@Controller()
class AppController {
  @Get()
  getHello(): string {
    return 'Hello World from Backend!';
  }

  @Get('api/hello')
  getApiHello(): any {
    return {
      message: 'Hello from API!',
      timestamp: new Date().toISOString(),
      status: 'OK',
    };
  }
}

@Module({
  controllers: [AppController],
})
class AppModule {}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(); // Important pour le frontend
  await app.listen(3001);
  console.log('🚀 Backend Hello World running on http://localhost:3001');
  console.log('📡 API endpoint: http://localhost:3001/api/hello');
}

bootstrap();
