import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config({ path: "./.env" });
import bcrypt from "bcrypt";
import User from "../models/user.model.js";

async function seedAdmin() {
    await mongoose.connect(`${process.env.LOCAL_MONGODB_URL}`, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    //check if admin is exits or not 
    const isExists = await User.findOne({ is_admin: true });
    if (!isExists) {
        const adminCredentials = {
            name: "Admin User",
            password: "password",

            is_admin: true,
            user_id: "ADMIN001",
            contact: {
                phone: "9128937435",
                email: "admin@gmail.com"
            },
            personal_details: {
                first_name: "Gaurav",
                last_name: "Kumar",
                dob: new Date('2001-06-25')
            }

        };
        try {
            const newAdmin = await User.create(adminCredentials);
            if (newAdmin) {
                console.log('admin createed successsfylly');
                return;
            }
            console.log('Admin alreaady exists');
            return;

        } catch (error) {
            console.log(error)
        }

    }
}
seedAdmin().then(() => {
    console.log("Admin seeding completed");
    process.exit(0);
  }).catch((err) => {
    console.error("Error seeding admin:", err);
    process.exit(1);
  });