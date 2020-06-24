import { Injectable, NotFoundException } from "@nestjs/common";
import { User } from "./users.model";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from 'mongoose';

@Injectable()
export class UserService {
    constructor(@InjectModel('Users') private userModel: Model<User>) {}

    async getUsers(): Promise<User[]> {
        return await this.userModel.find({})
    }

    async getSingleUser(id: string): Promise<User> {
        const singleUser = await this.userModel.findById(id)
        if (!singleUser) {
            throw new NotFoundException()
        }
        return singleUser
    }

    async insertUser(name: string, username: string, password: string): Promise<string> {
        const newUser = new this.userModel({name, username, password})
        console.log(newUser)
        const result = await newUser.save()
        console.log(result)
        return result._id
    }
}