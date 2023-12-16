import { Schema, model } from "mongoose";
const billSchema = new Schema({
    customerName: {
        type: String,
        trim: true,
        minlength: [2, "min length must be 2 char"],
        maxlength: [50, "max length must be 50 char"],
        required: [true, "customerName is Required"],
    },
    phone: {
        type: Number,
        required: [true, "phone Number is required"],
    },
    products: [{
        type: Schema.ObjectId,
        ref: "productModel",
        required: [true, "Products required"],
    }],
},
    { timestamps: true });

export default model("billModel", billSchema);
