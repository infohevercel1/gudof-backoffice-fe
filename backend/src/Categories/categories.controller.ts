import { Controller, Get, Post, Body, Param } from "@nestjs/common";
import { CategoryService } from './categories.service';
import { Category } from './categories.model';

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

    @Get('parent/:id')
    async GetChildCategories(
        @Param('id') parent_id: string
    ): Promise <Array<Category>> {
        const listOfCategories = await this.categoryService.getChildCategory(parent_id)
        return listOfCategories
    }
}