import { Schema, model } from "mongoose";
const categorySchema = new Schema(
    {
        name: {
            type: String,
            trim: true,
            required: [true, "Category Name is Required"],
            unique: [true, "Category must be Unique"],
            minlength: [2, "min length must be 2 char"],
            maxlength: [50, "max length must be 50 char"],
        },
        slug: {
            type: String,
            lowercase: true
        },
    },
    { timestamps: true }
);
export default model("categoryModel", categorySchema);