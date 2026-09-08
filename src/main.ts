import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConsoleLogger } from '@nestjs/common';
import { LoggingInterceptor } from './common/logging/logging.interceptor';
async function bootstrap() {
  const app = await NestFactory.create(AppModule,{
    logger :new ConsoleLogger({
      colors:true,
      json:true,
    })
  });
  app.useGlobalInterceptors(
    new LoggingInterceptor(),
  );

  // this is my server
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();


// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';
// import { ValidationPipe } from '@nestjs/common';

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);

//   app.useGlobalPipes(
//     new ValidationPipe({
//       whitelist: true,
//       forbidNonWhitelisted: true,
//       transform: true,
//     }),
//   );

//   app.enableCors({
//     origin: 'http://localhost:5173',
//     credentials: true,
//   });

//   await app.listen(3000);
// }

// bootstrap();
