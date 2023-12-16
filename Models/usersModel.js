import { Schema, model } from "mongoose";
const userSchema = new Schema(
{
    name: {
    type: String,
    required: [true, "UserName is required"],
    },
    email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
    },
    phone:{
        type:String,
        required:[true,"User Phone is Required"],
    },
    password: {
    type: String,
    required: [true, "password is required"],
    minilength: [6, "too short password"],
    },
    passwordChangedAt: Date,
},
{ timestamps: true }
);

export default model ("userModel", userSchema);