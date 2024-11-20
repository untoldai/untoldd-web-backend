import Router from "express";
import { verifyAdminToken, verifyInfluncerToken } from "../../../middleware/authtoken.middlware.js";
import productController from "../../../controller/product/product.controller.js";
import { upload } from "../../../middleware/multer.middleware.js"
import prdouctAssignController from "../../../controller/productassign/productassign.controller.js";
const router = Router();

router.post('/admin/add-product', verifyAdminToken, upload.array('images', 3), productController.addNewByAdminProduct );
router.delete('/admin/delete-product', verifyAdminToken, productController.deleteProductByAdmin);
router.get('/admin/all-product', productController.getAdminProductList);
router.put('/admin/toggle-active', verifyAdminToken, productController.toggleActiveProduct);
router.put('/admin/toggle-features', verifyAdminToken, productController.toggleFeatureProduct);

// assign route for influncer 
router.post('/admin/assign-product',verifyAdminToken,prdouctAssignController.assignSingleProduct);

// product for website 
router.get('/details',productController.getproductdetails)
router.get('/all-product', productController.getProductList);


// influncer list 
router.get('/influncer/products',verifyInfluncerToken,prdouctAssignController.getInfluncerProducts)
export default router;