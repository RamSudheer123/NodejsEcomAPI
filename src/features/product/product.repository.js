import { ObjectId } from "mongodb";
import { getDB } from "../../config/mongodb.js";
import { applicationError } from "../../error-handler/applicationError.js";
import mongoose from "mongoose";
import { productSchema } from "./product.schema.js";
import { reviewSchema } from "./review.schema.js";
import { categorySchema } from "./category.schema.js";

const ProductModel = mongoose.model('products', productSchema)
const ReviewModel = mongoose.model('reviews', reviewSchema)
const CategoryModel = mongoose.model('category', categorySchema)

class ProductRepository {

    constructor() {
        this.collection = "products"
    }

    async add(productData) {
        try {
            //This is the code with mongoose (Many-to-Many relationship)
            // 1. Add the product
            productData.categories = productData.category.split(",").map(e => e.trim()) //map function is used to apply trim on every every element in category and trim is used to remove white spaces brfore and after the every element
            // console.log(productData)
            const newProduct = new ProductModel(productData)
            const savedProduct = await newProduct.save()
            // 2. Update categories
            await CategoryModel.updateMany(
                {_id: {$in: productData.categories}},
                {
                    $push: {products: new ObjectId(savedProduct._id)}
                }
            )

            //This is code with out mongoose
            // // 1. Get the database
            // const db = getDB();
            
            // // 2. Get the colletion
            // const collection = db.collection(this.collection); //we need to provide colletion name here and if that colletion is not present in database, it will create it automatically
            
            // // 3. Insert the document
            // await collection.insertOne(newProduct)
            // return newProduct
        }
        catch(err) {
            console.log(err); // Need to log the error here
            return new applicationError("Something went wrong with database", 500)
        }
    }

    async getAll() {
        try {
            const db = getDB()
            const collection = db.collection(this.collection)
            return await collection.find().toArray()
        }
        catch(err) {
            console.log(err); // Need to log the error here
            return new applicationError("Something went wrong with database", 500)
        }
    }

    async get(id) {
        try {
            const db = getDB()
            const collection = db.collection(this.collection)
            return await collection.findOne({_id: new ObjectId(id)})
        }
        catch(err) {
            console.log(err); // Need to log the error here
            return new applicationError("Something went wrong with database", 500)
        }
    }

    async filter(minPrice, maxPrice, category) {
        try {
            // 1. Get the database
            const db = getDB();
            
            // 2. Get the colletion
            const collection = db.collection(this.collection); //we need to provide colletion name here and if colletion is not present in database, it will create it automatically
            
            let filterExpression = {};
            if(minPrice) { // If minPrice is available then adding this expression to filterExpression
                filterExpression.price = {$gte: parseFloat(minPrice)}
            }
            if(maxPrice) {// If maxPrice is available then adding this expression to filterExpression
                filterExpression.price = {...filterExpression.price, $lte: parseFloat(maxPrice)} //here the first parameter will make sure that the price would not override the previous value i.e minPrice because both are having same variable price
            }
            if(category) {// If category is available then adding this expression to filterExpression
                filterExpression.category = category
            }
            return await collection.find(filterExpression).toArray();
        }
        catch(err) {
            console.log(err); // Need to log the error here
            return new applicationError("Something went wrong with database", 500)
        }
    }

    //This is the filter method with categories array and we need to make changes in controller to use this
    // async filter(minPrice, categories) {
    //     try {
    //         // 1. Get the database
    //         const db = getDB();
            
    //         // 2. Get the colletion
    //         const collection = db.collection(this.collection); //we need to provide colletion name here and if colletion is not present in database, it will create it automatically
            
    //         let filterExpression = {};
    //         if(minPrice) { // If minPrice is available then adding this expression to filterExpression
    //             filterExpression.price = {$gte: parseFloat(minPrice)}
    //         }
    //         //['cat1', 'cat2'] //we have give categories array in this way
    //         categories = JSON.parse(categories.replace(/'/g, '"')) //This is to replace all ' into " in categories array
    //         if(categories) {// If category is available then adding this expression to filterExpression
    //             filterExpression = {$or: [{categoty: {$in: {categories}}, filterExpression}]}
    //         }
    //         return await collection.find(filterExpression).project({name: 1, price:1, _id: 0, ratings: {$slice: 1}}).toArray(); //$slice will return only first rating, if it is 2 then it will return first 2 ratings, if it is -1 then it will return last rating
    //     }
    //     catch(err) {
    //         console.log(err); // Need to log the error here
    //         return new applicationError("Something went wrong with database", 500)
    //     }
    // }


    // In this approach we need to find the product first and then userRating, after that we have either update the rating or add the rating. Also we have another below using $pull method which will remove the rating if it is already exists
    // async rate(userID, productID, rating) {
    //     try {
    //         // 1. Get the database
    //         const db = getDB();
            
    //         // 2. Get the colletion
    //         const collection = db.collection(this.collection); //we need to provide colletion name here and if that colletion is not present in database, it will create it automatically
    //         //Find the product
    //         const product = await collection.findOne({_id: new ObjectId(productID)})
    //         //Find the rating
    //         const userRating = product?.ratings?.find(r => r.userID == userID)
    //         // 3. Insert the document
    //         if(userRating) {
    //             await collection.updateOne({_id: new ObjectId(productID), "ratings.userID": new ObjectId(userID)}, {$set: {"ratings.$.rating": rating}}) // Here in "ratings.$.rating" , $ will give the first rating which meets the condition
    //         }
    //         else {
    //             await collection.updateOne({_id: new ObjectId(productID)}, {$push: {ratings: {userID: new ObjectId(userID), rating}}})
    //         }
    //     }
    //     catch(err) {
    //         console.log(err); // Need to log the error here
    //         return new applicationError("Something went wrong with database", 500)
    //     }
    // }

    async rate(userID, productID, rating) { //This is the simplest way to update the rating
        try {
           const productToUpdate = await ProductModel.findById(productID)
           if(!productToUpdate) {
            throw new Error("Product not found")
           }
           const userReview = await ReviewModel.findOne({product: new ObjectId(productID), user: new ObjectId(userID)})
           if(userReview) {
            userReview.rating = rating
            userReview.save()
           }
           else {
            const newReview = new ReviewModel({
                product: new ObjectId(productID),
                user: new ObjectId(userID),
                rating: rating
            })
            newReview.save()
           }
        }
        catch(err) {
            console.log(err); // Need to log the error here
            return new applicationError("Something went wrong with database", 500)
        }

        // // This is the code without mongoose
        // try {
        //     // 1. Get the database
        //     const db = getDB();
            
        //     // 2. Get the colletion
        //     const collection = db.collection(this.collection); //we need to provide colletion name here and if that colletion is not present in database, it will create it automatically
            
        //     //1. Removes existing entry
        //     await collection.updateOne({_id: new ObjectId(productID)}, {$pull: {ratings: {userID: new ObjectId(userID)}}})
        //     //2. Add new entry
        //     await collection.updateOne({_id: new ObjectId(productID)}, {$push: {ratings: {userID: new ObjectId(userID), rating}}})

        // }
        // catch(err) {
        //     console.log(err); // Need to log the error here
        //     return new applicationError("Something went wrong with database", 500)
        // }
    }

    //This is used to get averagePrice based on category
    //Aggregate pipeline-1 , aggregate is used to group documents based on attribute
    async averageProductPricePerCategory() {
        try{
            const db = getDB();
            const collection = db.collection(this.collection);
            return await collection.aggregate([
                {
                    $group: {
                        _id: "$category",
                        averagePrice: {$avg: "$price"}
                    }
                }
            ]).toArray()
        }
        catch(err) {
            console.log(err); // Need to log the error here
            return new applicationError("Something went wrong with database", 500)
        }
    }
}

export default ProductRepository