export const generateRandomId = (firstname) => {
    const randomChars = Math.random().toString(36).substring(2, 7); // Generates 5 random characters
    const randomNumber = Math.floor(10000000 + Math.random() * 90000000); // Generates an 8-digit random number
    const id = `${firstname}${randomNumber}${randomChars}`;
    
    return id.substring(0, 12);
};

