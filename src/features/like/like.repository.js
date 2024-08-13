import mongoose, { model } from "mongoose";
import { likeSchema } from "./like.schema.js";
import { ObjectId } from "mongodb";
import { applicationError } from "../../error-handler/applicationError.js";


const likeModel = mongoose.model('like', likeSchema)

export default class LikeRepository {

    async likeProduct(userId, productId) {
        try {
            const newLike = new likeModel({
                user: new ObjectId(userId),
                likeable: new ObjectId(productId),
                types: 'products'
            })
            await newLike.save()
        }catch(err) {
            console.log(err); // Need to log the error here
            return new applicationError("Something went wrong with database", 500)
        }
    }

    async likeCategory(userId, categoryId) {
        try {
            const newLike = new likeModel({
                user: new ObjectId(userId),
                likeable: new ObjectId(categoryId),
                types: 'categories'
            })
            await newLike.save()
        }catch(err) {
            console.log(err); // Need to log the error here
            return new applicationError("Something went wrong with database", 500)
        }
    }

    async getLikes(type, id) {
        return await likeModel.find({
            likeable: new ObjectId(id),
            types: type
        }).populate('user').populate({path: 'likeable', model: type}) // Populate function will throw us total object found in that collection
    }
}