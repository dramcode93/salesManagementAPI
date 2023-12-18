import { model, Schema } from 'mongoose';
const productSchema = new Schema(
    {
        name: {
            type: String,
            trim: true,
            minlength: [2, "min length must be 2 char"],
            maxlength: [50, "max length must be 50 char"],
            required: [true, "Product Name is Required"],
        },
        quantity: {
            type: Number,
            default: 0,
            trim: true,
            required: [true, "Product Quantity is Requried"],
        },
        price: {
            type: Number,
            trim: true,
            required: [true, "Price is Required"],
        },
        sold: {
            type: Number,
            default: 0,
        },
        category: {
            type: Schema.ObjectId,
            ref: "categoryModel",
            required: [true, "Category Must Be Required"],
        },
    },
    { timestamps: true }
);
export default model("productModel", productSchema);