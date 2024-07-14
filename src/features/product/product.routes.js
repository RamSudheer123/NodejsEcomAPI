import express from 'express';
import ProductController from './product.controller.js';
import { upload } from "../../middlewares/fileupload.middleware.js"

const productRouter = express.Router();

const productController = new ProductController()

//the url for filter is something looks likes  http://localhost:3000/api/products/filter?minPrice=10&miaxPrice=30&category=Category1
productRouter.post('/rating', (req, res) => {
    productController.rateProduct(req, res)
})
productRouter.get('/filter', (req, res) => {
    productController.filterProducts(req, res)
})

productRouter.get("/", (req, res) => {
    productController.getAllProducts(req, res)
})
productRouter.post("/", upload.single('imageUrl'), (req, res) => {
    productController.addProduct(req, res)
})
productRouter.get('/:id', (req, res) => {
    productController.getOneProduct(req, res)
})


export default productRouter;