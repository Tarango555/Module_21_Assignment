import express from "express";
const router = express.Router();

import * as StudentsController from "../app/controllers/StudentsController.js";
import * as RefreshTokenController from "../app/controllers/RefreshTokenController.js";
import {verifyAccessToken} from "../app/middlewares/AuthMiddleware.js";
//import { UploadProfilePicture } from "../app/middlewares/MulterConfig.js";
import { UploadFile } from "../app/middlewares/MulterConfig.js";  // Import multer config

router.post("/Registration", StudentsController.Registration);
router.post("/Login", StudentsController.Login);
router.post("/Logout", StudentsController.Logout);
router.get("/ReadProfile", verifyAccessToken, StudentsController.ReadProfile);
router.post("/UpdateProfile", verifyAccessToken, StudentsController.UpdateProfile);

//Refresh Token Route
router.post("/RefreshToken", RefreshTokenController.RefreshToken);


// Profile Picture Update Route
router.post(
    "/UpdateProfilePicture", 
    verifyAccessToken,  // Check if the user is authenticated
    (req, res, next) => {
        req.fileType = 'profile_picture';  // Set custom fileType
        next();
    },
    UploadFile('profile_picture'),  // Middleware to handle file upload
    StudentsController.UpdateProfilePicture  // Controller function
);


// Route for uploading birth certificates
router.post(
    '/UploadBirthCertificate', 
    verifyAccessToken, 
    (req, res, next) => {
        req.fileType = 'birth_certificate';  // Set custom fileType
        next();
    },
    UploadFile('birth_certificate'), 
    StudentsController.UploadBirthCertificate
);


// Profile Picture Delete Route
router.post(
    "/DeleteProfilePicture", 
    verifyAccessToken,  // Check if the user is authenticated
    StudentsController.DeleteProfilePicture  // Controller function
);

// Get/Read profile picture
router.get('/GetProfilePicture', verifyAccessToken, StudentsController.GetProfilePicture);

export default router;