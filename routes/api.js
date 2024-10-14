import express from "express";
const router = express.Router();

import * as StudentsController from "../app/controllers/StudentsController.js";
import * as RefreshTokenController from "../app/controllers/RefreshTokenController.js";
import {verifyAccessToken} from "../app/middlewares/AuthMiddleware.js";


router.post("/Registration", StudentsController.Registration);
router.post("/Login", StudentsController.Login);
router.post("/Logout", StudentsController.Logout);
router.get("/ReadProfile", verifyAccessToken, StudentsController.ReadProfile);
router.post("/UpdateProfile", verifyAccessToken, StudentsController.UpdateProfile);

//Refresh Token Endpoint
router.post("/RefreshToken", RefreshTokenController.RefreshToken);




export default router;