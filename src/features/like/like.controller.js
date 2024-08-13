import { applicationError } from "../../error-handler/applicationError.js";
import LikeRepository from "./like.repository.js";


export default class LikeContoller {

    constructor() {
        this.likeRepository = new LikeRepository()
    }

    async likeItem(req, res, next) {
        const { id, type } = req.body;
        const userId = req.userID;
        try {
            if(type != 'products' && type != 'categories') {
                return res.status(400).send('Invalid Type')
            }
            if(type == 'products') {
                await this.likeRepository.likeProduct(userId, id)
            }else {
                await this.likeRepository.likeCategory(userId, id)
            }
            return res.status(200).send()
        }catch(err) {
            console.log(err); // Need to log the error here
            return new applicationError("Something went wrong with database", 500)
        }
    }

    async getLikes(req, res, next) {
        try {
            const { id, type } = req.query;
            const likes = await this.likeRepository.getLikes(type, id)
            return res.status(200).send(likes)
        }catch(err) {
            console.log(err); // Need to log the error here
            return new applicationError("Something went wrong with database", 500)
        }
    }
}