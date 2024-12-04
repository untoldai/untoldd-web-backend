import { Router } from "express";
import { verifyInfluncerToken } from "../../../middleware/authtoken.middlware.js";
import InfluncerController from "../../../controller/influncer/influncer.controller.js";
const route= Router();

route.post('/profile/update',verifyInfluncerToken,InfluncerController.updateProfile);

export default route;