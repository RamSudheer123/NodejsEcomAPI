import { getDB } from "../../config/mongodb.js";
import { applicationError } from "../../error-handler/applicationError.js";

export default class UserModel {
    constructor( name, email, password, type ) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.type = type;
        // this._id = id;  // Here "_" is to match with mongodb database
    }
}

// This is for without DB
// let users = [
//     {
//     id: "1", name: "Seller User", email: "seller@ecom.com", password: "Seller@1", type: "seller"
//     },
//     {
//     id: "2", name: "customer User", email: "customer@ecom.com", password: "Customer@1", type: "customer"
//     },
// ]