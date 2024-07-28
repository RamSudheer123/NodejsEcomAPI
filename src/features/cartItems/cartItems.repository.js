import { ObjectId, ReturnDocument } from "mongodb";
import { getDB } from "../../config/mongodb.js";
import { applicationError } from "../../error-handler/applicationError.js";


export default class CartItemsRepository {

    constructor() {
        this.collection = "cartItems";
    }
    //The below method will update the id while doing the updation of document as well but we want to update the id only while inserting the document
    // async add(productID, userID, quantity) {
    //     try{
    //         const db = getDB();
    //         const collection = db.collection(this.collection);
    //         // const id = await this.getNextCounter(db);
    //         const existingItem = await collection.
    //         //This will insert cart item, but it will create duplicates and it wont update the cart if it already there
    //         // await collection.insertOne({productID: new ObjectId(productID), userID: new ObjectId(userID), quantity})
    //         //Find the document
    //         //Either insert or update
    //         await collection.updateOne({productID: new ObjectId(productID), userID: new ObjectId(userID)}, {$setOnInsert: {_id: id}, $inc: {quantity: quantity}}, {upsert: true}) //check on the mongodb documentation about upsert //$setOnInsert: {_id: id} will make sure that the is will create only on insert operation and upsert is a combination of update and insert (update + insert = upsert). If the value of this option is set to true and the document or documents found that match the specified query, then the update operation will update the matched document or documents. Or if the value of this option is set to true and no document or documents matches the specified document, then this option inserts a new document in the collection
    //     }catch(err) {
    //         console.log(err); // Need to log the error here
    //         return new applicationError("Something went wrong with database", 500)
    //     }
    // }

    async add(productID, userID, quantity) {
        try {
          const db = getDB();
          const collection = db.collection(this.collection);
    
          const existingItem = await collection.findOne({productID: new ObjectId(productID), userID: new ObjectId(userID)});
    
          if (existingItem) {
            await collection.updateOne({_id: existingItem._id, productID: new ObjectId(productID), userID: new ObjectId(userID)}, {$inc: {quantity: quantity}}, {upsert: true});
          } else {
            const id = await this.getNextCounter(db);
            await collection.insertOne({_id: id, productID: new ObjectId(productID), userID: new ObjectId(userID), quantity});
          }
        } catch (err) {
          console.log(err);
          return new applicationError("Something went wrong with database", 500);
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

    async getNextCounter(db) {
        const resultDocument = await db.collection("counters").findOneAndUpdate({_id: "cartItemId"}, {$inc: {value: 1}}, {returnDocument: "after"}); //ReturnDocument: after will make sure that the function is returning value after increment
        // console.log("resultDocument", resultDocument)//To know why we gave resultDocument.value.value
        // console.log(resultDocument.value.value) //In recording trainer returned this value and it is returning undefined value
        // console.log(resultDocument.value) // we are getting id in this
        return resultDocument.value;
    }
}