import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from "@nestjs/mongoose";
import { Model } from 'mongoose';
import { productTemplate } from './templates.model';

@Injectable()
export class TemplatesService {
    constructor(@InjectModel('productTemplates') private productTemplateModel: Model<productTemplate>) {}

    async getProductTemplates(): Promise<productTemplate[]> {
        return await this.productTemplateModel.find({})
    }

    async getSingleProductTemplate(id: string): Promise<productTemplate> {
        const singleProductTemplate = await this.productTemplateModel.findById(id)
        if (!singleProductTemplate) {
            throw new NotFoundException()
        }
        return singleProductTemplate
    }

    async getTemplateByCategory(id: string): Promise<productTemplate[]> {
        const templates = await this.productTemplateModel.find({ category_id: id })
        if (templates.length === 0) {
            throw new NotFoundException()
        }
        return templates
    }

    async insertProductTemplate(name: string, category_id: string, formSchema: string, uiSchema: string): Promise<string> {
        const newProductTemplate = new this.productTemplateModel({ name, category_id, formSchema, uiSchema })
        const result = await newProductTemplate.save();
        return result._id
    }
}
