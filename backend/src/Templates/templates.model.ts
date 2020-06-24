import * as mongoose from 'mongoose';

export const productTemplateSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    category_id: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Category',
        required: true
    },
    formSchema: {
        type: String
    },
    uiSchema: {
        type: String
    },
    meta: {
        created_by: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'User'
        },
        created_at: Date
    }
})

export interface productTemplate extends mongoose.Document {
    id: string
    name: string
    category_id: string
    formSchema: string
    uiSchema: string
    meta: {
        created_by: string,
        created_at: string
    }
}