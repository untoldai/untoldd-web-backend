import { message } from "../../constant/message.js";
import Address from "../../models/address.model.js";
import { errorResponse, successResponse } from "../../utils/response.utils.js";

const userController={};


// Create a new address
userController.createAddress = async (req, res) => {
    try {
        const newAddress = new Address({
            userId: req.user._id,
            
            streetAddress: req.body.streetAddress,
            apartmentNumber: req.body.apartmentNumber,
            city: req.body.city,
            state: req.body.state,
            postalCode: req.body.postalCode,
            country: req.body.country,
            phone: req.body.phone,
            addressType: req.body.addressType,
            isDefault: req.body.isDefault
        });

        const savedAddress = await newAddress.save();
        return successResponse(res,201,savedAddress,"New Address address added ");
        
    } catch (error) {
        return errorResponse(res, 500, message.SERVER_ERROR, error);
    }
};

// Get all addresses for a user
userController.getAllAddresses = async (req, res) => {
    try {
        const addresses = await Address.find({ userId: req.user._id });
       // console.log(addresses)
        return successResponse(res,200,addresses,message.FETCH_SUCCESS);
    } catch (error) {
        return errorResponse(res, 500, message.SERVER_ERROR, error);
    }
};

// Update an address by ID
userController.updateAddress = async (req, res) => {
    try {
        const updatedAddress = await Address.findByIdAndUpdate(req.query.id, req.body, { new: true });
        if (!updatedAddress) {
            return errorResponse(res,404,"Address not found") ;
        }
        return successResponse(res,200,"Address Updated Successfully")
    } catch (error) {
        return errorResponse(res, 500, message.SERVER_ERROR, error);
    }
};

// // Delete an address by ID
// userController.deleteAddress = async (req, res) => {
//     try {
//         const deletedAddress = await Address.findByIdAndDelete(req.query.id);
//         if (!deletedAddress) {
//             return errorResponse(res,404,"Address not found");
//             return res.status(404).json({ message: 'Address not found' });
//         }
//         return res.successResponse(res,200,"Adress s"); // No content
//     } catch (error) {
//         return errorResponse(res, 500, message.SERVER_ERROR, error);
//     }
// };

// Set default address
userController.setDefaultAddress = async (req, res) => {
    try {
        // Optionally unset all other addresses for the user
        await Address.updateMany({ userId: req.user._id }, { isDefault: false });

        const updatedAddress = await Address.findByIdAndUpdate(req.query.id, { isDefault: true }, { new: true });
        if (!updatedAddress) {
            return errorResponse(res,404,"Address not found");
        }
        return successResponse(res,200,updatedAddress,"Address is marked as default");
    } catch (error) {
        return errorResponse(res, 500, message.SERVER_ERROR, error);
    }
};
export default userController;