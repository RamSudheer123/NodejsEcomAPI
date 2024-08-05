import mongoose from "mongoose";

export const userSchema = new mongoose.Schema({
    name: {type: String, max: [25, "Name can't be greater than 25 characters"]},
    email: {type: String, unique: true, required: true, match: [/.+\@.+\../, "Please enter a valid email"]}, // Unique will make sure that email providing by user is unique in database(db)
    password: {type: String, 
        validate: { // This is a custom validator which will be created by user
            validator: function(value) {
                return /^(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,12}$/.test(value)
            },
            message: "Password should be between 8-12 characters and have a special character"
        }
    },
    type: {type: String, enum: ['Customer', 'Seller']}
})