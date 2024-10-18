import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser"
// importing router 
import AuthRoute from "./routes/v1/auth/auth.routes.js";
import ProductRoute from "./routes/v1/product/product.routes.js"

import { errorResponse } from "./utils/response.utils.js";
const app = express();




app.use(
    cors({
        origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN : '*', // Fallback to '*' if not set
        credentials: true,
    })
);

//this is middleware that is use to request json payload with limit
app.use(express.json({ limit: "16kb" }));

//this is a middle ware that is use to accept json from url
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
//this is use to accept public file
app.use(express.static("public"));
//for perform operation in cookie
app.use(cookieParser());
// middleware which handle default error
// routes
app.get('/',function(req,res){
    return send('<h1>Project is running </h1>')
})

app.use('/v1/api/auth',AuthRoute);
app.use('/v1/api/product',ProductRoute);
app.use((req, res, next) => {
    errorResponse(res, 404, 'Not Found');
});

export default app;