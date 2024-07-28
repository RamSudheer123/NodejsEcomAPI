import { applicationError } from "../../error-handler/applicationError.js";
import ProductModel from "./product.model.js";
import ProductRepository from "./product.repository.js";

export default class ProductController {

    constructor() {
        this.productRepository = new ProductRepository()
    }
    
    async getAllProducts(req, res) {
        try {
            const products = await this.productRepository.getAll()
            res.status(200).send(products)
        }catch(err) {
            console.log(err); // Need to log the error here
            return new applicationError("Something went wrong with database", 500)
        }
    }
    
    async addProduct(req, res) {
        try {
            const { name, desc, price, category, sizes } = req.body;
            const newProduct = new ProductModel(name, desc, parseFloat(price), req.file.filename, category, sizes.split(","))
            const createdProduct =  await this.productRepository.add(newProduct)
            res.status(201).send(createdProduct)
        }catch(err) {
            console.log(err); // Need to log the error here
            return new applicationError("Something went wrong with database", 500)
        }
        
    }

    async rateProduct(req, res) {
        try {
            const userID = req.userID;
            // const productID = req.query.productID; //If we use query data will come from url. example = http://localhost:3000/api/products/rating?userID=2&productID=10&rating=4.5
            // const rating = req.query.rating;
            const productID = req.body.productID;
            const rating = req.body.rating;
            // const error = ProductModel.rateProduct(userID, productID, rating) 
            // try {
            await this.productRepository.rate(userID, productID, rating)
            // }catch(err) {
            //     return res.status(400).send(err.message) //.message is because of error class is returning multiple parameters, check error class for more info
            // }
            return res.status(200).send('Rating has been added')
        }catch(err) {
            console.log(err); // Need to log the error here
            return new applicationError("Something went wrong with database", 500)
        }     
    }

    async getOneProduct(req, res) {
        try {
            const id = req.params.id;
            const product = await this.productRepository.get(id)
            if(!product) {
                return res.status(404).send("Product not found")
            }
            res.status(200).send(product)
        }
        catch(err) {
            console.log(err); // Need to log the error here
            return new applicationError("Something went wrong with database", 500)
        }
    }
    //The purpose of req.body is to create or modify data, so we have used req.query to get the filters
    async filterProducts(req, res) {
        try {
                const minPrice = req.query.minPrice;
                const maxPrice = req.query.maxPrice;
                const category = req.query.category;
                const result = await this.productRepository.filter(minPrice, maxPrice, category)
                if(result.length == 0) {
                    return res.status(404).send("Products not available with your filter")
                }
                res.status(200).send(result)
        }
        catch(err) {
            console.log(err); // Need to log the error here
            return new applicationError("Something went wrong with database", 500)
        }
    }
    
    async averagePrice(req, res) {
        try{
            const result = await this.productRepository.averageProductPricePerCategory();
            res.status(200).send(result)
        }
        catch(err) {
            console.log(err); // Need to log the error here
            return new applicationError("Something went wrong with database", 500)
        }
    }
}
