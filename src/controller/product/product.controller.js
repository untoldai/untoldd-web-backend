import mongoose from "mongoose";
import { message } from "../../constant/message.js";
import Product from "../../models/product.model.js";
import { asyncHanlder } from "../../utils/asyncHandler.js";
import { errorResponse, successResponse } from "../../utils/response.utils.js";

import { uploadOnCloudinary } from "../../utils/cloudinary.js";

let productController = {};



productController.addNewByAdminProduct = async (req, res) => {
    // const { error } = productValidationSchema.validate(req.body);

    // if (error) {
    //     return errorResponse(res, 400, "Validation failed", res.status(400).json({ message: error.details[0].message }));
    // }

    try {
        const imageUrls = [];

        // Upload each image to Cloudinary and collect URLs
        for (const file of req.files) {
            const uploadResponse = await uploadOnCloudinary(file.path);
            if (uploadResponse) {
                const newUrl = {
                    url: uploadResponse.secure_url
                }
                imageUrls.push(newUrl);
            } else {
                return errorResponse(res, 500, "Failed to upload image to Cloudinary");
            }
        }

        // Create new product with image URLs
        const newProduct = await Product.create({
            ...req.body,
            created_by: req.admin._id,
            is_admin: true,
            images: imageUrls // Save the array of image URLs in your product model
        });

        if (newProduct) {
            return successResponse(res, 201, { newProduct }, "New product added successfully");
        }
        return errorResponse(res, 500, "Something went wrong while adding the product");
    } catch (error) {
        console.log(error)
        return errorResponse(res, 500, message.SERVER_ERROR, error);
    }
};

productController.deleteProductByAdmin = asyncHanlder(async (req, res) => {
    try {
        const { product_id } = req.body;
        if (!product_id || product_id === "") {
            return errorResponse(res, 422, message.INVALID + ", Product id is missing")
        }
        let productId = new mongoose.Types.ObjectId(product_id);

        const isDeleted = await Product.findOneAndDelete({
            _id: productId,
            created_by: req.admin._id, is_admin: true
        });


        return successResponse(res, 200, {}, message.PRODUCT_DELETED)

        //return errorResponse(res, 500, message.DELETING_ERROR, isDeleted)
    } catch (error) {
        console.log(error)
        return errorResponse(res, 500, message.SERVER_ERROR, error?.message);
    }
});

productController.getProductList = asyncHanlder(async (req, res) => {
    try {
        // Get page and limit from the request query, or set default values
        const page = parseInt(req.query.page) || 1; // Default to page 1
        const limit = parseInt(req.query.limit) || 20; // Default to 20 items per page
        const category = req.query.category || ""; // Get category from query

        // Calculate how many records to skip for pagination
        const skip = (page - 1) * limit;

        // Create a filter object based on the category
        const filter = {
            isActive: true // Only fetch active products
        };

        // If category is provided, add it to the filter
        if (category) {
            filter.type = category;
        }

        // Fetch products with pagination
        const products = await Product.find(filter)
            .skip(skip)
            .limit(limit);

        // Count total active products for pagination
        const total_data = await Product.countDocuments(filter);

        // Calculate total pages
        const total_pages = Math.ceil(total_data / limit);

        // Build pagination metadata
        const pagination = {
            per_page: limit,
            current_page: page,
            first_page: 1,
            last_page: total_pages,
            total_data: total_data,
            next_page_url: page < total_pages ? `${req.protocol}://${req.get('host')}${req.baseUrl}?page=${page + 1}&limit=${limit}${category ? `&category=${category}` : ''}` : null
        };

        // Send the paginated response with products and pagination metadata
        return successResponse(res, 200, { products, pagination }, message.FETCH_SUCCESS);
    } catch (error) {
        return errorResponse(res, 500, message.SERVER_ERROR, error);
    }
});
productController.getAdminProductList = asyncHanlder(async (req, res) => {
    try {
        // Get page and limit from the request query, or set default values
        const page = parseInt(req.query.page) || 1; // Default to page 1
        const limit = parseInt(req.query.limit) || 20; // Default to 20 items per page
        const category = req.query.category || ""; // Get category from query

        // Calculate how many records to skip for pagination
        const skip = (page - 1) * limit;

        // Create a filter object based on the category
        const filter = {
           
        };

        // If category is provided, add it to the filter
        if (category) {
            filter.type = category;
        }

        // Fetch products with pagination
        const products = await Product.find(filter)
            .skip(skip)
            .limit(limit);

        // Count total active products for pagination
        const total_data = await Product.countDocuments(filter);

        // Calculate total pages
        const total_pages = Math.ceil(total_data / limit);

        // Build pagination metadata
        const pagination = {
            per_page: limit,
            current_page: page,
            first_page: 1,
            last_page: total_pages,
            total_data: total_data,
            next_page_url: page < total_pages ? `${req.protocol}://${req.get('host')}${req.baseUrl}?page=${page + 1}&limit=${limit}${category ? `&category=${category}` : ''}` : null
        };

        // Send the paginated response with products and pagination metadata
        return successResponse(res, 200, { products, pagination }, message.FETCH_SUCCESS);
    } catch (error) {
        return errorResponse(res, 500, message.SERVER_ERROR, error);
    }
});
// get product description 

productController.getproductdetails = asyncHanlder(async (req, res) => {
    try {
        const productId = req.query.productId;
        let id=new mongoose.Types.ObjectId(productId);
        const data=await Product.findById(id);
        return successResponse(res,200,data,message.FETCH_SUCCESS);
    } catch (error) {
        console.log(error)
        return errorResponse(res, 500, message.SERVER_ERROR, error);
    }
})

// productController.getProductListByCategory = asyncHanlder(async (req, res) => {
//     try {

//     } catch (error) {
//         return errorResponse(res, 500, message.SERVER_ERROR, error);
//     }
// })
productController.updateProductdetailsByAdmin = asyncHanlder(async (req, res) => {
    try {
        // Extract product details and admin ID
        const { product_id, name, type, price, description, category, stock, brand, sku, images, tags, quantity, unit, variants, warranty, isFeatured, isActive } = req.body;

        // Check if product ID is provided
        if (!product_id) {
            return errorResponse(res, 422, "Product ID is required");
        }

        // Validate if the admin is updating the product (by their own product or with required permissions)
        const product = await Product.findOne({ _id: product_id, created_by: req.admin._id });

        if (!product) {
            return errorResponse(res, 404, "Product not found or you don't have permission to update this product");
        }


        const updateData = {
            ...(name && { name }),
            ...(type && { type }),
            ...(price && { price }),
            ...(description && { description }),
            ...(category && { category }),
            ...(stock && { stock }),
            ...(brand && { brand }),
            ...(sku && { sku }),
            ...(images && { images }),
            ...(tags && { tags }),
            ...(quantity && { quantity }),
            ...(unit && { unit }),
            ...(variants && { variants }),
            ...(warranty && { warranty }),
            ...(typeof isFeatured === "boolean" && { isFeatured }),
            ...(typeof isActive === "boolean" && { isActive }),
        };

        // Update product details
        const updatedProduct = await Product.findByIdAndUpdate(product_id, updateData, { new: true });

        // If the update was successful
        return successResponse(res, 200, updatedProduct, "Product updated successfully");

    } catch (error) {
        console.error(error);
        return errorResponse(res, 500, "An error occurred while updating the product", error.message);
    }
});
productController.toggleActiveProduct = asyncHanlder(async (req, res) => {
    try {
        const { product_id, status } = req.body;

        if (product_id === "") {
            return errorResponse(res, 500, "product not found");

        }
        let productId = new mongoose.Types.ObjectId(product_id);
        const isUpdate = await Product.findByIdAndUpdate(productId, { isActive: !status }, { new: true });
        if (isUpdate) {
            return successResponse(res, 200, {}, 'Product Update Successfully');
        }
        return
    } catch (error) {
        console.log(error)
        return errorResponse(res, 500, message.SERVER_ERROR, error);
    }
})
productController.toggleFeatureProduct = asyncHanlder(async (req, res) => {
    try {
        const { product_id, status } = req.body;

        if (product_id === "") {
            return errorResponse(res, 500, "product not found");

        }
        let productId = new mongoose.Types.ObjectId(product_id);
        const isUpdate = await Product.findByIdAndUpdate(productId, { isFeatured: !status }, { new: true });
        if (isUpdate) {
            return successResponse(res, 200, {}, 'Product IsFeatures Update Successfully');
        }
        return
    } catch (error) {
        console.log(error)
        return errorResponse(res, 500, message.SERVER_ERROR, error);
    }
})
export default productController;