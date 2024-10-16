import multer from "multer";
import path from "path";

// Configure Multer storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');  // Destination folder
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + '-' + file.originalname);
    }
});

// File filter to allow only images
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(new Error('Only .png, .jpg and .jpeg format allowed!'), false);
    }
};

// Multer middleware instance
export const UploadProfilePicture = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 2 },  // Limit file size to 2MB
    fileFilter: fileFilter
});
