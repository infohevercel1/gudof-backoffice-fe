import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TemplatesService } from './templates.service';
import { TemplatesController } from './templates.controller';
import { productTemplateSchema } from './templates.model';

@Module({
  imports: [MongooseModule.forFeature([{name: 'productTemplates', schema: productTemplateSchema}])],
  controllers: [TemplatesController],
  providers: [TemplatesService]
})
export class TemplatesModule {}
