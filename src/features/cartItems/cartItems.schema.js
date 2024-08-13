import mongoose from "mongoose";

export const cartSchema = new mongoose.Schema({
    productID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'products' //This is keyword which tells us about collection
    }, // This is an id of product which refers to product collection
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users' //This is keyword which tells us about users collection
    },
    quantity: Number
})