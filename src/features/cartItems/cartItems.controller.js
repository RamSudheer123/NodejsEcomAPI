import { applicationError } from "../../error-handler/applicationError.js";
import cartItemsModel from "./cartItems.model.js";
import CartItemsRepository from "./cartItems.repository.js";

export default class cartItemsController {

    constructor() {
        this.cartItemsRepository = new CartItemsRepository()
    }
    async add(req, res) {
        try{
            const { productID, quantity } = req.body;
            const userID = req.userID;
            await this.cartItemsRepository.add(productID, userID, quantity)
            res.status(200).send('Cart is updated')
        }catch(err) {
            console.log(err); // Need to log the error here
            return new applicationError("Something went wrong with database", 500)
        }
    }

    async get(req, res) {
        try {
            const userID = req.userID
            const items = await this.cartItemsRepository.get(userID)
            return res.status(200).send(items)
        }catch(err) {
            console.log(err); // Need to log the error here
            return new applicationError("Something went wrong with database", 500)
        }
    }

    async delete(req, res) {
        try {
            const userID = req.userID
            const cartItemID = req.params.id
            const isDeleted = await this.cartItemsRepository.delete(cartItemID, userID)
            if(!isDeleted) {
                return res.status(404).send("Item not found")
            }
            res.status(200).send('Cart Item is removed')
        }catch(err) {
            console.log(err); // Need to log the error here
            return new applicationError("Something went wrong with database", 500)
        }
    }
}