import { Router } from "express";

import authController from "../../../controller/auth/auth.controller.js";
import { verifyAdminToken, verifyInfluncerToken, verifyUserToken } from "../../../middleware/authtoken.middlware.js";
const router = Router();

router.post('/register', authController.registerUser);
router.post('/login', authController.userLogin);
router.get('/profile', verifyUserToken, authController.getLoginUserProfile);
router.put('/profile/update', verifyUserToken, authController.updateProfileDetails);
router.put('/profile/change-password', verifyUserToken, authController.userChangePassword);

// admin auth route 
router.post('/admin/login', authController.adminLogin);
router.get('/admin/profile', verifyAdminToken, authController.getLoginAdminProfile)
router.get('/admin/profile-details', verifyAdminToken, authController.getAdminProfileDetails);
router.get('/admin/user-lists', verifyAdminToken, authController.getUserLists);
router.get('/admin/influncer-lists', verifyAdminToken, authController.getInfluncerLists);
//auth route for influncer 
router.post('/influncer/register', authController.registerInfluncer);
router.post('/influncer/login', authController.influencerLogin);
router.get('/influncer/profile', verifyInfluncerToken, authController.getInfluncerLoginProfile);
router.get('/influncer/profile/details', verifyInfluncerToken, authController.getInfluncerProfileDetails);
export default router