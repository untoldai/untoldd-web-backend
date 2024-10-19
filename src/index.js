import app from "./app.js";
import { connectDB } from "./connection/connection.js";
import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

connectDB().then(() => {
    app.on('error', (error) => {
        console.log("error", error)
    })
    app.listen((process.env.PORT), () => {
        console.log(`server is running on ${process.env.PORT}`)
    })
}).catch((err) => {
    console.log("Failed while connection db", err);
})

