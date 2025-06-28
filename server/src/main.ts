import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import cors from 'cors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // ミドルウェアの設定
  app.use(helmet());
  app.use(cors());
  
  await app.listen(3001);
  console.log('Example app listening on port 3001!');
}
bootstrap();
