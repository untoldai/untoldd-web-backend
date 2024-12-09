import { Router } from "express";
import { verifyAdminToken } from "../../../middleware/authtoken.middlware.js";
import BlogController from "../../../controller/blog/blog.controller.js";
const router=Router();


router.post("/create",verifyAdminToken,BlogController.createNewBlog);
router.get('/lists',BlogController.getAllBlogListsFor);
export default  router;