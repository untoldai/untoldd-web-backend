import { Blog } from "../../models/blog.model.js";
import { errorResponse, successResponse } from "../../utils/response.utils.js";

const BlogController = {};
BlogController.createNewBlog = async (req, res) => {
    try {
        const newBlog = await Blog.create({
            userId: req.admin._id,
            heading: req.body.heading,
            category: req.body.category,
            blogText: req.body.blogText,
            author: req.body.author
        });
        if (newBlog) {
            return successResponse(res, 201, newBlog, "New Blog created successfully.");
        }
        return errorResponse(res, 500, "Something went wrong while creating blog ");
    } catch (error) {
        return errorResponse(res, 500, "Internal server error", error)
    }
}
BlogController.getAllBlogListsFor = async (req, res) => {
    try {
        // Retrieve the category from query parameters
        const category = req.query.category;

        // If category exists, filter by category; otherwise, get all blogs
        const query = category ? { category: category } : {};

        // Fetch the blogs based on the query object
        const blogs = await Blog.find(query);

        // Return the response with the blogs
        return successResponse(res, 200, blogs, "Blog lists fetched successfully.");
    } catch (error) {
        // In case of error, return an error response
        return errorResponse(res, 500, "Internal server error", error);
    }
}

export default BlogController;