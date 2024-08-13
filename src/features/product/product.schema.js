import mongoose from "mongoose";

export const productSchema = new mongoose.Schema({
    name: String,
    desc: String,
    price: Number,
    // imageUrl: URL,
    category: String,
    inStock: Number,
    reviews: [ // This is how we will do 1-M relationship
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'reviews'
        }
    ],
    categories: [ // This is how we will do M-M relationship
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'category'
        }
    ]
})