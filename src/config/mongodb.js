import { MongoClient } from 'mongodb';

const url = process.env.DB_URL;

let client;
export const connectToMongoDB = () => {
    MongoClient.connect(url)
        .then(clientInstance => {
            client = clientInstance
            console.log("MongoDB is connected")
            createCounter(client.db());
            createIndexes(client.db())
        })
        .catch(err => {
            console.log(err)
        })
}

export const getClient = () => { // This is created for transactions
    return client;
}

export const getDB =() => {
    return client.db() //Here we can pass database name if we are not specifying it in url
}

const createCounter = async(db) => {
    const existingCounter = await db.collection("counters").findOne({_id: 'cartItemId'});
    if(!existingCounter) {
        await db.collection("counters").insertOne({_id: "cartItemId", value: 0}); // If we are giving _id value then mongodb won't create it otherwise mongodb will create unique id
    }
}

const createIndexes = async(db) => {
    try {
        await db.collection("products").createIndex({price: 1}) //single field index
        await db.collection("products").createIndex({name: 1, category: -1}) //compound field index , 1 will create ascending order and -1 will create descending order
        await db.collection("products").createIndex({desc: "text"}) //Text index , not accepting capital letters, used to find the particular word or words in large paragraphs
    }catch(err) {
        console.log(err)
    }
    console.log("Indexes are created")
}
