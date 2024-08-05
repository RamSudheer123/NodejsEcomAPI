// This will handle all the operations using mongoose
import mongoose from "mongoose";
import { userSchema } from "./user.schema.js";
import { applicationError } from "../../error-handler/applicationError.js";

// Creating model from schema
const UserModel = mongoose.model('users', userSchema)

export default class UserRepository {

    async signUpUser(user) {
        try {
            // Create instance of model
            const newUser = new UserModel(user)
            await newUser.save()
            return newUser
        }catch(err) {
            if(err instanceof mongoose.Error.ValidationError) {
                throw err;
            }else{
                console.log(err); // Need to log the error here
                throw new applicationError("Something went wrong with database", 500)
            }
        }
    }

    //This is for signin but now we are using finsUserByEmail as we need to check first whether the email is present or not
    // async signIn(email, password) {
    //     try {
    //        return await UserModel.findOne({email, password})
    //     }catch(err) {
    //         console.log(err); // Need to log the error here
    //         return new applicationError("Something went wrong with database", 500)
    //     }
    // }

    async findUserByEmail(email) {
        try{
            return await UserModel.findOne({email});
        } catch(err){
            console.log(err);
            throw new applicationError("Something went wrong with database", 500);
        }
    }

    async resetPassword(userID, hashedPassword) {
        try {
            let user = await UserModel.findById(userID)
            user.password = hashedPassword
            user.save()
        }catch(err){
            console.log(err);
            throw new applicationError("Something went wrong with database", 500);
        }
    }
}