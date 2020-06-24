import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductService } from './products.service';
import { ProductController } from './products.controller';
import { productSchema } from './products.model';

@Module({
  imports: [MongooseModule.forFeature([{name: 'products', schema: productSchema}])],
  controllers: [ProductController],
  providers: [ProductService]
})
export class ProductModule {}
