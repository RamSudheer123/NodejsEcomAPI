import { getDB } from "../../config/mongodb.js";
import { applicationError } from "../../error-handler/applicationError.js";


export default class UserRepository {

    constructor() {
        this.collection = "users";
    }

    async signUpUser(newUser) {
        try {
            // 1. Get the database
            const db = getDB();
            
            // 2. Get the colletion
            const collection = db.collection(this.collection); //we need to provide colletion name here and if colletion is not present in database, it will create it automatically
            
            // 3. Insert the document
            await collection.insertOne(newUser)
            // return newUser
        }
        catch(err) {
            console.log(err); // Need to log the error here
            return new applicationError("Something went wrong with database", 500)
        }
    }

    // This method is for SignIn without hashed password
    // async signInUser(email, password) {
    //     try{
    //         // 1. Get the database
    //         const db = getDB();

    //         // 2. Get the collection
    //         const collection = db.collection("users");
            
    //         // 3. Find the document.
    //         return await collection.findOne({email, password});
    //     } catch(err){
    //         console.log(err);
    //         throw new applicationError("Something went wrong with database", 500);
    //     }
    // }

    async findUserByEmail(email) {
        try{
            // 1. Get the database
            const db = getDB();

            // 2. Get the collection
            const collection = db.collection(this.collection);
            
            // 3. Find the document.
            return await collection.findOne({email});
        } catch(err){
            console.log(err);
            throw new applicationError("Something went wrong with database", 500);
        }
    }
}