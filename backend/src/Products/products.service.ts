import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from "@nestjs/mongoose";
import { Model } from 'mongoose';
import { Product } from './products.model';

@Injectable()
export class ProductService {
    constructor(@InjectModel('products') private productModel: Model<Product>) {}

    async getProducts(): Promise<Product[]> {
        return await this.productModel.find({})
    }

    async getSingleProduct(id: string): Promise<Product> {
        const singleProduct = await this.productModel.findById(id)
        if (!singleProduct) {
            throw new NotFoundException()
        }
        return singleProduct
    }

    async getProductByTemplate(id: string): Promise<Product[]> {
        const products = await this.productModel.find({template_id: id})
        if(products.length === 0) {
            throw new NotFoundException()
        }
        return products
    }

    async insertProduct(data: string, template_id: string): Promise<string> {
        const newProduct = new this.productModel({ data, template_id })
        const result = await newProduct.save();
        return result._id
    }
}
