import { Injectable } from "@nestjs/common";
import { Category } from './categories.model';

@Injectable()
export class CategoryService {
    categories: Category[] = [];
    
    getCategories(): Category[] {
        return [...this.categories]
    }

    insertCategory(name: string, path: string): number {
        const categoryId = Number(new Date())
        const newCategory = new Category(categoryId, name, path, {created_by: '', created_at: ''})
        this.categories.push(newCategory);
        return categoryId
    }
}