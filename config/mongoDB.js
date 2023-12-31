import expressAsyncHandler from "express-async-handler";
import mongoose from "mongoose";

// export const DBConnection = () => {
//     mongoose.connect(process.env.mongoDB)
//         .then(console.log("Database Connected"))
// };

export const DBConnection = expressAsyncHandler(async () => {
    try {
        await mongoose.connect(process.env.mongoDB);
        console.log('Database Connected');
    } catch (err) {
        console.error('Error connecting to the database: ', err.message);
    }
})