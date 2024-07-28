import { ObjectId } from "mongodb";
import { getClient, getDB } from "../../config/mongodb.js"
import OrderModel from "./order.model.js";
import { applicationError } from "../../error-handler/applicationError.js";

export default class OrderRepository {
    constructor() {
        this.collection = "orders"
    }

    async placeOrder(userId) {
        // These should be outside of try block to access in catch block
        const client = getClient(); //This client will help us in setup the session
        const session = client.startSession()
        try{
            const db = getDB()

            session.startTransaction()
            //1. Get the cart items and calculate total amount
            const items = await this.getTotalAmount(userId, session)
            const finalTotalAmount = items.reduce((acc, item) => acc + item.totalAmount, 0)
            console.log(finalTotalAmount)
            //2. Create the order record
            const newOrder = new OrderModel(new ObjectId(userId), finalTotalAmount, new Date())
            await db.collection(this.collection).insertOne(newOrder, {session})
            //3. Reduce the stock
            for(let item of items){
                db.collection("products").updateOne({
                    _id: "$productID",
                    $inc: {stock: -item.quantity} //before this we need to add stock to every product by doing updateMany({}, {stock: 20})
                },
                {session})
            }
            //4. Clear the cart items
            await db.collection("cartItems").deleteMany({userID: new ObjectId(userId)}, {session})
            session.commitTransaction();
            session.endSession();
        }
        catch(err) {
            await session.abortTransaction() // This will make sure that tranaction is aorted and reverted other operation in case of any error in transaction
            session.endSession()
            console.log(err); // Need to log the error here
            return new applicationError("Something went wrong with database", 500)
        }        
    }

    async getTotalAmount(userId, session) {
        const db = getDB();
        const items = await db.collection("cartItems").aggregate([
            // Get cart items for the user
            {
                $match: {userID: new ObjectId(userId)}
            },
            // Get the products from products colletion
            {
                $lookup: {
                    from: "products",
                    localField: "productID",
                    foreignField: "_id",
                    as: "productInfo"
                }
            },
            // unwind the productInfo
            {
                $unwind: "productInfo"
            },
            // Calculate total amount for each cartitems
            {
                $addFields: {
                    "totalAmount": {
                        $multiply: ["$productInfo.price", "$quantity"]
                    }
                }
            }
        ], {session}).toArray()
        return items;
    }
 }