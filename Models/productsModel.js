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
        slug: {
            type: String,
            lowercase: true
        },
        quantity: {
            type: Number,
            default: 0,
            trim: true,
            required: [true, "Product Quantity is Required"],
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
        adminUser: {
            type: Schema.Types.ObjectId,
            ref: "userModel"
        },
    },
    { timestamps: true }
);

productSchema.pre(/^find/, function (next) {
    this.populate({ path: 'category', select: 'name' });
    // this.populate({ path: 'adminUser', select: '_id name' });
    next();
})

export default model("productModel", productSchema);