import express from "express";
import dotenv from 'dotenv';
import cors from 'cors';
import compression from "compression";
import hpp from "hpp";
import ExpressMongoSanitize from "express-mongo-sanitize";
import helmet from "helmet";

import categoriesRouter from './routes/categoriesRoute.js';
import productsRouter from './routes/productsRoute.js';
import customersRouter from './routes/customersRoute.js';
import billsRouter from './routes/billsRoute.js';
import authRouter from './routes/authRoute.js';
import usersRouter from './routes/usersRoute.js';
import { DBConnection } from "./config/mongoDB.js";
import { APIerrors } from "./utils/errors.js";
import { globalError } from "./middlewares/globalErrors.js";

const app = express();
app.use(express.json({ limit: '2kb' }));
app.use(ExpressMongoSanitize())
app.use(helmet())
app.use(hpp({ whitelist: ['price', 'quantity', 'name', 'customerName'] }))
app.use(cors());
app.use(compression());
dotenv.config();

let server;
DBConnection().then(() => { server = app.listen(process.env.port, () => { console.log(`app is listen on port ${process.env.port}`); }); })

// Routes
app.use('/api/auth', authRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/products', productsRouter);
app.use('/api/customers', customersRouter);
app.use('/api/bills', billsRouter);
app.use('/api/users', usersRouter);

// Errors middleware
app.all('*', (req, res, next) => { next(new APIerrors(`The route ${req.originalUrl} is not found`, 400)) });
app.use(globalError);

// Handle unhandled rejection
process.on('unhandledRejection', (err) => {
    console.error(`unhandledRejection ${err.name} | ${err.message}`);
    server.close(() => {
        // Shutdown application on error
        console.error('shutting the application down');
        process.exit(1);
    })
})