import { Router } from "express";
const router=Router();
import { verifyUserToken } from "../../../middleware/authtoken.middlware.js";
import userController from "../../../controller/user/user.controller.js";
router.get('/address/lists',verifyUserToken,userController.getAllAddresses);
router.post('/address/create',verifyUserToken,userController.createAddress);
router.put("/address/update",verifyUserToken,userController.updateAddress);
router.post("/address/set-default",verifyUserToken,userController.setDefaultAddress);

export default router;