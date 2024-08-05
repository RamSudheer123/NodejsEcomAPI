import mongoose from "mongoose";

export const productSchema = new mongoose.Schema({
    name: String,
    desc: String,
    price: Number,
    imageUrl: URL,
    category: String,
    inStock: Number
})