import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CategoryModule } from './Categories/categories.module';
import { UserModule } from './Users/users.module';

import { MongooseModule } from '@nestjs/mongoose';
import { TemplatesModule } from './Templates/templates.module';
import { ProductModule } from './Products/products.module';

@Module({
  imports: [CategoryModule, UserModule, MongooseModule.forRoot('mongodb+srv://newuser:check123@cluster0-mwvda.mongodb.net/infohe?retryWrites=true&w=majority'), TemplatesModule, ProductModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
