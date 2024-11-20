import crypto from "crypto";
import { asyncHanlder } from "../../utils/asyncHandler.js";
import { errorResponse, successResponse } from "../../utils/response.utils.js";
import ProductAssign from "../../models/assignproduct.model.js";

function generateEncryptedToken(length = 32) {

    const randomBytes = crypto.randomBytes(length);


    const token = randomBytes.toString('hex');


    const hash = crypto.createHash('sha256'); // You could use 'sha512' or another hashing algorithm
    hash.update(token);
    const encryptedToken = hash.digest('hex');

    return encryptedToken; // This is the final encrypted token
}

const prdouctAssignController = {};
prdouctAssignController.assignSingleProduct = asyncHanlder(async (req, res) => {
    try {
        const { influncerId, productId } = req.query;
        const newInfluncerAssignProduct = await ProductAssign.create({
            user_id: influncerId,
            product_id: productId,
            purchase_date: new Date().toISOString(),
            assignment_token: generateEncryptedToken(26),
            assign_by: req.admin._id
        });
        if (newInfluncerAssignProduct) {
            return successResponse(res, 201, newInfluncerAssignProduct, "New product assign successfully")
        }
        return errorResponse(res, 500, "Failed to assign product");
    } catch (error) {
        return errorResponse(res, 500, message.SERVER_ERROR, error);
    }
})


prdouctAssignController.getInfluncerProducts = asyncHanlder(async (req, res) => {
    try {
        const products = await ProductAssign.aggregate([
            {
                $match: { user_id: req.influncer._id }
            },
            {
                $lookup: {
                    from: "products",
                    localField: "product_id",
                    foreignField: "_id",
                    as: "ProductDetails"
                }
            }
        ]);
        return successResponse(res, 200, products, "Fetch successfully");

    } catch (error) {
        return errorResponse(res, 500, message.SERVER_ERROR, error);
    }
});
export default prdouctAssignController;