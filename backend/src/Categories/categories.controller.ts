import { Controller, Get, Post, Body } from "@nestjs/common";
import { CategoryService } from './categories.service';

@Controller('categories')
export class CategoryController {
    constructor(private readonly categoryService: CategoryService) {}

    @Get()
    findAll() {
        return this.categoryService.getCategories()
    }

    @Post()
    async addCategory(
        @Body('name') name: string,
        @Body('path') path: string,
        @Body('parent_id') parentId: number
    ): Promise<object> {
        const generatedId =  await this.categoryService.insertCategory(name, path, parentId)
        return {id: generatedId}
    }
}