import express from "express";
import cartItemsController from "./cartItems.controller.js";

const cartRouter = express.Router()

const CartItemsController = new cartItemsController()

cartRouter.delete("/:id", CartItemsController.delete)
cartRouter.get("/", CartItemsController.get)
cartRouter.post("/", CartItemsController.add)

export default cartRouter;