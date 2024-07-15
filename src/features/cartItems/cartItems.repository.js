import { ObjectId } from "mongodb";
import { getDB } from "../../config/mongodb.js";
import { applicationError } from "../../error-handler/applicationError.js";


export default class CartItemsRepository {

    constructor() {
        this.collection = "cartItems";
    }

    async add(productID, userID, quantity) {
        try{
            const db = getDB();
            const collection = db.collection(this.collection);
            //This will insert cart item, but it will create duplicates and it wont update the cart if it already there
            // await collection.insertOne({productID: new ObjectId(productID), userID: new ObjectId(userID), quantity})

            //Find the document
            //Either insert or update
            await collection.updateOne({productID: new ObjectId(productID), userID: new ObjectId(userID)}, {$inc: {quantity: quantity}}, {upsert: true}) //check on the mongodb documentation about upsert
        }catch(err) {
            console.log(err); // Need to log the error here
            return new applicationError("Something went wrong with database", 500)
        }
    }

    async get(userID) {
        try{
            const db = getDB();
            const collection = db.collection(this.collection);
            return await collection.find({userID: new ObjectId(userID)}).toArray(); //find function will return cursor, that's why we are using toArray() to change data into array 
        }catch(err) {
            console.log(err); // Need to log the error here
            return new applicationError("Something went wrong with database", 500)
        }
    }

    async delete(cartItemID, userID) {
        try{
            const db = getDB();
            const collection = db.collection(this.collection);
            const result = await collection.deleteOne({_id: new ObjectId(cartItemID), userID: new ObjectId(userID)})
            return result.deletedCount>0
        }catch(err) {
            console.log(err); // Need to log the error here
            return new applicationError("Something went wrong with database", 500)
        }
    }
}