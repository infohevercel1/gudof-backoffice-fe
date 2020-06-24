import * as mongoose from 'mongoose';

export const productSchema = new mongoose.Schema({
    data: {
        type: String,
        required: true
    },
    template_id: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'productTemplates',
        required: true
    },
    meta: {
        created_by: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'User'
        },
        created_at: Date
    }
})

export interface Product extends mongoose.Document {
    id: string
    data: string
    template_id: string
    meta: {
        created_by: string
        created_at: string
    }
}