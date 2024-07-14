import "./env.js"
import express from "express";
import bodyParser from "body-parser"; //import bodyParser, { json } from "body-parser";
import swagger from "swagger-ui-express";
import cors from 'cors';
import productRouter from "./src/features/product/product.routes.js";
import userRouter from "./src/features/user/user.routes.js";
// import basicAuthorizer from "./src/middlewares/basicauth.middleware.js";
import jwtAuth from "./src/middlewares/jwt.middleware.js";
import cartItemRouter from "./src/features/cartItems/cartItems.routes.js"
// import apidocs from './swagger.json' assert{type: 'json'}; // This is for Swagger 2.0
import apidocs from './swagger.json' assert{type: "json"}; // This is for Swagger 3.0
import loggerMiddleware from "./src/middlewares/logger.middleware.js";
import { applicationError } from "./src/error-handler/applicationError.js";
import { connectToMongoDB } from "./src/config/mongodb.js";


const server = express();

server.use(bodyParser.json())//This is to get the request body from json 

//CORS policy configuration using library cors
var coreOptions = {
    origin: "http://localhost:5500" //we can give other configuration also here
}
server.use(cors(coreOptions))
server.use(loggerMiddleware)

// //CORS policy configuration
// server.use((req, res) => {
//     res.header('Access-Control-Allow-Origin', 'http://localhost:5500') //Here we can specify multiple paths or addresses, if we want to give access to all by giving as *
//     res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
//     res.header('Access-Control-Allow-Methods', '*') //we can restict to only to specified methods like get,post etc..
//     //return OK for preflight request
//     if(req.method == "OPTIONS") {
//         return res.sendStatus(200)
//     }
//     next();
// })

//for all requests related to products, redirect them to product routes.
//localhost:/api/products
// server.use("/api-docs", swagger.serve, swagger.setup(apidocs)) //This is for Swagger 2.0 //swagger.serve is used to provide UI for swagger and swagger.setup(apidocs) will add(setup) the swagger.json on to the UI
server.use("/api-docs", swagger.serve, swagger.setup(apidocs)) //This is for Swagger 3.0
// server.use("/api/products", basicAuthorizer, productRouter) //This is for Basic authentication
server.use("/api/products", jwtAuth, productRouter) //This is for jwt authentication
server.use("/api/cartItems", jwtAuth, cartItemRouter)
server.use("/api/users", userRouter)

//handle default request
server.get("/", (req, res) => {
    res.send("Welcome to E-comm API Project")
})

//Error handler middleware
server.use((err, req, res, next) => {
    console.log(err)
    // Application error
    if(err instanceof applicationError) {
        res.status(err.code).send(err.message)
    }
    // server error
    res.status(500).send("Something went wrong, Please try later")
})

// Middleware to handle 404 requests
//This must be always last after all requests are completed
server.use((req, res) => {
    res.status(404).send("API not found. Please check out documentation for more info at localhost:3000/api-docs")
})

server.listen('3000', () => {
    console.log("Server is listening at 3000")
    connectToMongoDB();
})