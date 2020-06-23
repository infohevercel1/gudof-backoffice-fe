import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CategoryModule } from './Categories/categories.module';
import { UserModule } from './Users/users.module';

import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [CategoryModule, UserModule, MongooseModule.forRoot('mongodb://localhost:27017/nest')],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
