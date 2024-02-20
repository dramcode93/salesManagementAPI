import { Schema, model } from "mongoose";
const billSchema = new Schema({
    customerName: {
        type: String,
        trim: true,
        minlength: [2, "min length must be 2 char"],
        maxlength: [50, "max length must be 50 char"],
        required: [true, "customerName is Required"],
    },
    slug: {
        type: String,
        lowercase: true
    },
    customerAddress: {
        type: String,
        trim: true,
        maxlength: [200, "max length must be 150 char"],
    },
    phone: { type: String },
    products: [{
        product: {
            type: Schema.ObjectId,
            ref: "productModel",
            required: [true, "Products are required"]
        },
        productQuantity: { type: Number },
        totalPrice: { type: Number }
    }],
    totalAmount: { type: Number },
    paidAmount: {
        type: Number,
        required: true
    },
    remainingAmount: {
        type: Number,
        default: 0
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "userModel"
    },
    adminUser: {
        type: Schema.Types.ObjectId,
        ref: "userModel"
    },

},
    { timestamps: true });

billSchema.pre(/^find/, function (next) {
    this.populate({ path: 'products.product', select: 'name price' });
    this.populate({ path: 'user', select: '_id name' });
    next();
})

export default model("billModel", billSchema);
