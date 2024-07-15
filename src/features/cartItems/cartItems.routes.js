import express from "express";
import cartItemsController from "./cartItems.controller.js";

const cartRouter = express.Router()

const CartItemsController = new cartItemsController()

cartRouter.delete("/:id", (req, res, next) => {
    CartItemsController.delete(req, res, next)
})
cartRouter.get("/", (req, res, next) => {
    CartItemsController.get(req, res, next)
})
cartRouter.post("/", (req, res, next) => {
    CartItemsController.add(req, res, next)
})

export default cartRouter;