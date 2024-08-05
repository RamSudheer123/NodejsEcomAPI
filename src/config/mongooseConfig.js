import mongoose from "mongoose";

const url = process.env.DB_URL

export const connectUsingMongoose = async() => {
    try{
        await mongoose.connect(url, {
            // useNewUrlParser: true, // These 2 lines are the options which mongoose added and they help to connect with mongodb with the latest mongoose 
            // useUnifiedTopology: true  // The options 'useNewUrlParser' and 'useUnifiedTopology' are no longer needed in the latest versions of the MongoDB Node.js driver (version 4.0.0 and above)
        })
        console.log("Mongodb connected using Mongoose")
    }catch(err) {
        console.log("Error while connectiong to db")
        console.log(err)//Needs to log the error
    }
}