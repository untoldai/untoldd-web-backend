import crypto from "crypto";

export const generateRandomId = (firstname) => {
    const randomChars = Math.random().toString(36).substring(2, 7); // Generates 5 random characters
    const randomNumber = Math.floor(10000000 + Math.random() * 90000000); // Generates an 8-digit random number
    const id = `${firstname}${randomNumber}${randomChars}`;

    return id.substring(0, 12);
};

export const generateRandomOtp = (length = 4) => {
    let otp = "";
    const characters = "0123456789";
    for (let i = 0; i < length; i++) {
        otp += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return otp;
}

export const generateRandomString = (length = 8) => {
    let result = "";
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (let i = 0; i < length; i++) {
        const randomIndex = crypto.randomInt(0, characters.length);
        result += characters.charAt(randomIndex);
    }
    return result;
};

