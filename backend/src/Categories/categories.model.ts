
import * as mongoose from 'mongoose';
import { Schema } from '@nestjs/mongoose';

export const CategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    path: {
        type: String,
        required: true
    },
    parent_id: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Category'
    },
    meta: {
        created_by: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'User'
        },
        created_at: Date
    }
})

export interface Category extends mongoose.Document {
    id: string
    name: string
    path: string
    parent_id: string
    meta: {
        created_by: string,
        created_at: string
    }
}