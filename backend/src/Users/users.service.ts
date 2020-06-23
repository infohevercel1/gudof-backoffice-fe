import { Injectable, NotFoundException } from "@nestjs/common";
import { User } from "./users.model";

@Injectable()
export class UserService {
    users: User[] = [];

    getUsers(): User[] {
        return [...this.users]
    }

    getSingleUser(id: number): User {
        const user = this.users.find(user => user.id == id)
        if(!user) {
            throw new NotFoundException()
        }
        return {...user}
    }

    insertUser(name: string, username: string, password: string): number {
        const userId = Number(new Date())
        const newUser = new User(userId, name, username, password)
        this.users.push(newUser)
        return userId
    }
}