// import multer from "multer";

// // Configure Multer storage
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, 'uploads/');  // Destination folder
//     },
//     filename: function (req, file, cb) {
//         const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//         cb(null, file.fieldname + '-' + uniqueSuffix + '-' + file.originalname);
//     }
// });

// // File filter to allow only images
// const fileFilter = (req, file, cb) => {
//     if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
//         cb(null, true);
//     } else {
//         cb(new Error('Only .png, .jpg and .jpeg format allowed!'), false);
//     }
// };

// // Multer middleware instance
// export const UploadProfilePicture = multer({
//     storage: storage,
//     limits: { fileSize: 1024 * 1024 * 2 },  // Limit file size to 2MB
//     fileFilter: fileFilter
// });

import multer from "multer";
import path from 'path';
import fs from 'fs';

// Generic file storage configuration for multiple file types
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const fileType = req.fileType;  // Custom field to identify file type
        let folder = '';

        if (fileType === 'profile_picture') {
            folder = 'uploads/profile_pictures/';
        } else if (fileType === 'birth_certificate') {
            folder = 'uploads/birth_certificates/';
        } else {
            folder = 'uploads/others/';
        }

        // Ensure the folder exists
        fs.mkdirSync(folder, { recursive: true });
        cb(null, folder);  // Set destination based on file type
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + '-' + file.originalname);
    }
});

// Generic file filter for images (extend this for other file types as needed)
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];  // Accept PDF for birth certificates
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Only .png, .jpg, .jpeg, and .pdf formats are allowed!'), false);
    }
};

// Multer middleware factory for different file types
export const UploadFile = (fileType) => {
    return multer({
        storage: storage,
        limits: { fileSize: 1024 * 1024 * 5 },  // Limit file size to 5MB
        fileFilter: fileFilter
    }).single(fileType);
};
