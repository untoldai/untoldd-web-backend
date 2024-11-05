import dotenv from "dotenv";
dotenv.config({ path: "./.env" });
import mongoose from "mongoose";
export const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URL}`, { useNewUrlParser: true, family: 4 })
        console.log(`Server is successsfully connected to db ${connectionInstance.connection.host}`)
    } catch (error) {
        console.log("Server failed while connection to db ", error);
        process.exit(1);
    }
}