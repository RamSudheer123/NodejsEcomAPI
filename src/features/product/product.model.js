import { applicationError } from "../../error-handler/applicationError.js";
import UserModel from "../user/user.model.js";

export default class ProductModel {
    constructor( name, desc, price, imageUrl, category, sizes, id ) {
        this.name = name;
        this.desc = desc;
        this.price = price;
        this.imageUrl = imageUrl;
        this.category = category;
        this.sizes = sizes;
        this._id = id;
    }
    
    static getAll() {
        return products
    }

    static add(product) {
        product.id = products.length+1;
        products.push(product);
        return product;
    }

    static get(id) {
        const product = products.find(i=> id == i.id)
        return product
    }

    static filter(minPrice, maxPrice, category){
        const result = products.filter((product) => {
            return ((!minPrice || product.price >= minPrice) && (!maxPrice || product.price <=maxPrice) && (!category || product.category == category))
        })
        return result;
    }

    static rateProduct (userID, productID, rating) {
        // 1. Verify the user
        const user = UserModel.getAll().find((u) => u.id == userID)
        if(!user) {
            // return "User not found"
            throw new applicationError("User not found", 404) //User defined error
        }

        // 2. Verify the prouct
        const product = products.find((p) => p.id == productID)
        if(!product) {
            // return "Product not found"
            throw new applicationError("Product not found", 400) //User defined error
        }

        // 3. Check if there are any ratings and if not then create ratings array
        if(!product.ratings) {
            product.ratings = []
            product.ratings.push({userID: userID, rating: rating})
        }
        else {
            // 4. Check if user rating already available
            const existingRatingIndex = product.ratings.findIndex((r) => r.userID == userID)
            if(existingRatingIndex >= 0) {
                // 5. If rating is already exists then update the rating
                product.ratings[existingRatingIndex] = {userID: userID, rating: rating}
            }
            else {
                // 6. If no existing rating then add new rating
                product.ratings.push({userID: userID, rating: rating})
            }
        }
    }
}

var products = [
    new ProductModel(1, 'Product 1', 'Description for Product 1', 19.99, 'https://m.media-amazon.com/images/I/51-nXsSRfZL._SX328_BO1,204,203,200_.jpg', 'category1'),
    new ProductModel(2, 'Product 2', 'Description for Product 2', 29.99, 'https://m.media-amazon.com/images/I/51xwGSNX-EL._SX356_BO1,204,203,200_.jpg', 'category2', ['M', 'XL']),
    new ProductModel(3, 'Product 3', 'Description for Product 3', 39.99, 'https://m.media-amazon.com/images/I/31PBdo581fL._SX317_BO1,204,203,200_.jpg', 'category3', ['M', 'XL', 'S']),
];