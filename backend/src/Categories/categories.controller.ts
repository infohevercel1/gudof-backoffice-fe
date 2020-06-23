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
    addCategory(
        @Body('name') name: string,
        @Body('path') path: string
    ): object {
        const generatedId =  this.categoryService.insertCategory(name, path)
        return {id: generatedId}
    }
}