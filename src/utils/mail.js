import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import path from 'path';
import fs from 'fs';
import ejs from "ejs"
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();

export const sendmail = async (email, subject, temaPlatePath) => {
    try {
        const mailTransporter = nodemailer.createTransport({
            host: "smtpout.secureserver.net",
            secure: false,
            port: 587,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            },
            tls: {
                rejectUnauthorized: false
            },

        });

        //verify smtp configuration 
        mailTransporter.verify((error, success) => {
            if (error) {
                console.log('SMTP CONFIguration Error:', error);
                return error;
            }
        });


        //Email context
        const mailtext = {
            from: {
                name: "Untoldd.in",
                address: process.env.MAIL_USER
            },
            to: email,
            subject: subject,
            html: temaPlatePath
        }
        const isMailSend = await mailTransporter.sendMail(mailtext);
        return isMailSend;
    } catch (error) {
        return error;
    }
}