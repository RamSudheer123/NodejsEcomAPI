import { applicationError } from "../../error-handler/applicationError.js"
import UserModel from "./user.model.js"
import jwt from "jsonwebtoken"
import UserRepository from "./user.repository.js"
import bcrypt from "bcrypt";

export default class UserController {
    constructor() {
        this.userRepository = new UserRepository()
    }

    async signUp(req, res) {
        try{
            const { name, email, password, type } = req.body
            //To hash the password
            const hashedpassword = await bcrypt.hash(password, 10); //Here second parameter is salt which is used to generate the randon string and add that to hashedpassword to avoid generation of same hashed password in case of same passwords given by user, ideal number of digits in salt is 10 to 12
            const user = new UserModel(name, email, hashedpassword, type)
            await this.userRepository.signUpUser(user)
            res.status(200).send(user)
        }
        catch(err) {
            return new applicationError("Something went wrong with database", 500)
        }
    }
    async signIn(req, res) {
        try {
            // Find user by email
            const user = await this.userRepository.findUserByEmail(req.body.email)
            if(!user) {
                return res.status(400).send("Invalid credentials")
            }
            else {
                // Compare password with hashed password
                const result = await bcrypt.compare(req.body.password, user.password)
                if(result) {
                    // 1. Create token
                    const token = jwt.sign({userID: user._id, email: user.email} , process.env.JWT_SECRET , {expiresIn: '1h'})

                    // 2. sen token
                    return res.status(200).send(token)
                }
                else {
                    return res.status(400).send("Invalid credentials")
                }
            }

            // The below code is for without hashed password
            // const { email, password } = req.body
            // const result = await this.userRepository.signInUser( email, password )
            // if(!result) {
            //     return res.status(400).send("Invalid credentials")
            // }
            // else{
            //     // 1. Create token
            //     const token = jwt.sign({userID: result.id, email: result.email} , 'ry]CuLW_QN=Q|8w242X[HJZfV=vJ~8' , {expiresIn: '1h'})

            //     // 2. sen token
            //     return res.status(200).send(token)
            // }
            // res.status(200).send(result)//This code is written before jwt authentication
        }catch(err) {
            console.log(err)
            return new applicationError("Something went wrong with database", 500)
        }
    }
}