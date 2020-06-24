import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ProductService } from './products.service';

@Controller('product')
export class ProductController {
    constructor (private readonly productService: ProductService) {}

    @Get()
    findAll() {
        return this.productService.getProducts()
    }

    @Get(':id')
    findSingleProduct(@Param('id') productId: string) {
        return this.productService.getSingleProduct(productId)
    }

    @Get('template/:id')
    findProductByTemplate(@Param('id') templateId: string) {
        return this.productService.getProductByTemplate(templateId)
    }

    @Post()
    async addProduct(
        @Body('data') data: string,
        @Body('template_id') template_id: string,
    ): Promise<object> {
        const generatedId = await this.productService.insertProduct(data, template_id)
        return { id: generatedId }
    }
}
