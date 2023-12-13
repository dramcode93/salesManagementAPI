import mongoose from "mongoose";

export const DBConnection = () => {
    mongoose.connect(process.env.mongoDB)
        .then(console.log("Database Connected"))
};