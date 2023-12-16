import { Schema, model } from "mongoose";
const billSchema = new Schema({
    customerName:{
        type:String,
        required:[true,"customerName is Required"],
    },
    phone:{
        type:Number,
        required:[true,"phone Number is required"],
    },
    products:[{ 
        name:String,
        quantity:Number,
        price:Number,
    }],
},{timestamps:true});

export default model("billModel", billSchema);
