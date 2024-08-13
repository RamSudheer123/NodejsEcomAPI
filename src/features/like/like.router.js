import express from "express"
import LikeContoller from "./like.controller.js"

const likeRouter = express.Router()

const likeController = new LikeContoller()

likeRouter.post("/", (req, res, next) => {
    likeController.likeItem(req, res, next)
})

likeRouter.get("/", (req, res, next) => {
    likeController.getLikes(req, res, next)
})

export default likeRouter;