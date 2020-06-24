import { Module } from "@nestjs/common";
import { UserController } from './users.controller';
import { UserService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { userSchema } from './users.model';

@Module({
    imports: [MongooseModule.forFeature([{name: 'Users', schema: userSchema}])],
    controllers: [UserController],
    providers: [UserService]
})
export class UserModule {}