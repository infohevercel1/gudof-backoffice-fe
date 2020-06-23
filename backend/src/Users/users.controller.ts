import { Controller, Get, Param, Post, Body } from "@nestjs/common";
import { UserService } from './users.service';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get()
    findAll() {
        return this.userService.getUsers()
    }

    @Get(':id')
    findSingleUser(@Param('id') userId: number) {
        return this.userService.getSingleUser(userId)
    }

    @Post()
    addUser(
        @Body('name') name: string,
        @Body('username') username: string,
        @Body('password') password: string,
    ): object {
        const generatedId = this.userService.insertUser(name, username, password)
        return {id: generatedId}
    }
}