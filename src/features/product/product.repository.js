import { ObjectId } from "mongodb";
import { getDB } from "../../config/mongodb.js";
import { applicationError } from "../../error-handler/applicationError.js";


class ProductRepository {

    constructor() {
        this.collection = "products"
    }

    async add(newProduct) {
        try {
            // 1. Get the database
            const db = getDB();
            
            // 2. Get the colletion
            const collection = db.collection(this.collection); //we need to provide colletion name here and if that colletion is not present in database, it will create it automatically
            
            // 3. Insert the document
            await collection.insertOne(newProduct)
            return newProduct
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
            if(minPrice) {// If category is available then adding this expression to filterExpression
                filterExpression.category = category
            }
            return await collection.find(filterExpression).toArray();
        }
        catch(err) {
            console.log(err); // Need to log the error here
            return new applicationError("Something went wrong with database", 500)
        }
    }

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
            // 1. Get the database
            const db = getDB();
            
            // 2. Get the colletion
            const collection = db.collection(this.collection); //we need to provide colletion name here and if that colletion is not present in database, it will create it automatically
            
            //1. Removes existing entry
            await collection.updateOne({_id: new ObjectId(productID)}, {$pull: {ratings: {userID: new ObjectId(userID)}}})
            //2. Add new entry
            await collection.updateOne({_id: new ObjectId(productID)}, {$push: {ratings: {userID: new ObjectId(userID), rating}}})

        }
        catch(err) {
            console.log(err); // Need to log the error here
            return new applicationError("Something went wrong with database", 500)
        }
    }
}

export default ProductRepository