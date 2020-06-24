import * as mongoose from 'mongoose';

export const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
})

export interface User extends mongoose.Document {
    id: string
    name: string
    username: string
    password: string
}