import Router from "express";
import { verifyAdminToken } from "../../../middleware/authtoken.middlware.js";
import productController from "../../../controller/product/product.controller.js";
import { upload } from "../../../middleware/multer.middleware.js"
const router = Router();

router.post('/admin/add-product', verifyAdminToken, upload.array('images', 3), productController.addNewByAdminProduct );
router.delete('/admin/delete-product', verifyAdminToken, productController.deleteProductByAdmin);
router.get('/all-product', productController.getProductList);
router.put('/admin/toggle-active', verifyAdminToken, productController.toggleActiveProduct);
router.put('/admin/toggle-features', verifyAdminToken, productController.toggleFeatureProduct);
export default router;