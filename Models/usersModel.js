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
    password: {
    type: String,
    required: [true, "password is required"],
    minlength: [6, "too short password"],
    maxlength:[14,"too long password"],
    },
    passwordChangedAt: Date,
},
{ timestamps: true }
);

export default model ("userModel", userSchema);