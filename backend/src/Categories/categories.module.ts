import { Module } from "@nestjs/common";
import { CategoryController } from './categories.controller';
import { CategoryService } from './categories.service';
import { MongooseModule } from '@nestjs/mongoose';
import { CategorySchema } from './categories.model';

@Module({
    imports: [MongooseModule.forFeature([{name: 'Category', schema: CategorySchema}])],
    controllers: [CategoryController],
    providers: [CategoryService]
})
export class CategoryModule {}