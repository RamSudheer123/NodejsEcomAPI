import mongoose from "mongoose";


export const categorySchema = mongoose.Schema({
    name: {type: String},
    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'products'
    }]
})