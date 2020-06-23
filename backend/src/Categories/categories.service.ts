import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from 'mongoose';
import { Category, CategorySchema } from './categories.model';

@Injectable()
export class CategoryService {
    categories: Category[] = [];

    constructor(@InjectModel('Category') private categoryModel: Model<Category>) {}
    
    async getCategories(): Promise<Category[]> {
        return await this.categoryModel.find({})
    }

    async insertCategory(name: string, path: string, parentId=null): Promise<string> {
        const newCategory = new this.categoryModel({name, path, parent_id: parentId})
        const result = await newCategory.save();
        return result._id
    }
}