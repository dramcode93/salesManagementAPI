import {model,Schema} from 'mongoose';
const productSchema = new schema(
{
    name: {
    type: String,
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
    ref: "categories",
    required: [true, "Category Must Be Required"],
    },
},
{ timestamps: true }
);
export default model("productModel", productSchema);