import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { TemplatesService } from './templates.service';

@Controller('templates')
export class TemplatesController {
    constructor (private readonly templateService: TemplatesService) {}

    @Get()
    findAll() {
        return this.templateService.getProductTemplates()
    }

    @Get(':id')
    findSingleTemplate (@Param('id') productTemplateId: string) {
        return this.templateService.getSingleProductTemplate(productTemplateId)
    }

    @Get('category/:id')
    findTemplateByCategory(@Param('id') categoryId: string) {
        return this.templateService.getTemplateByCategory(categoryId)
    }

    @Post()
    async addTemplate (
        @Body('name') name: string,
        @Body('category_id') category_id: string,
        @Body('formSchema') formSchema: string,
        @Body('uiSchema') uiSchema: string,
    ): Promise<object> {
        const generatedId = await this.templateService.insertProductTemplate(name, category_id, formSchema, uiSchema)
        return { id: generatedId }
    }
}
