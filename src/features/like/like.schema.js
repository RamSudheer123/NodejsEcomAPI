import mongoose from "mongoose";

export const likeSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    likeable: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: "types" // we will use this refPath, when we need to connect with multiple collections
    },
    types: { // we are specifying colletions here as part of refPath
        type: String,
        enum: ['products', 'categories']
    } 
}).pre('save', (next) => { // here the 1st parameter is the operation on which you wnated to apply pre middleware and second parameter is a function , it must have next.
    console.log("New like comming in")
    next()
}).post('save', (doc) => { //here the 1st parameter is the operation on which you wnated to apply pre middleware and we can get the document using doc
    console.log("Like is saved")
    console.log(doc)
}).pre('find', (next) => { 
    console.log("Retreiving likes")
    next()
}).post('save', (doc) => { 
    console.log("Find is completed")
    console.log(doc)
})