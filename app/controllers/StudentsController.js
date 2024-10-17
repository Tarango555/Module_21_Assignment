import {
    RegistrationService,
    LoginService,
    LogoutService,
    ReadProfileService,
    UpdateProfileService,
    UpdateProfilePictureService,
    GetProfilePictureService,
    DeleteProfilePictureService,
    UploadBirthCertificateService
} from '../services/StudentServices.js';


export const Registration = async (req, res) => {
    try {
        let result = await RegistrationService(req);
        return res.json(result);
    } catch (err) {
        return res.status(500).json({ status: "fail", message: err.toString() });
    }
};


export const Login = async (req, res) => {
    try {
        let result = await LoginService(req, res);
        return res.json(result);
    } catch (err) {
        return res.status(500).json({ status: "fail", message: err.toString() });
    }
};


export const Logout = async (req, res) => {
    try {
        let result = await LogoutService(res);
        return res.json(result);
    } catch (err) {
        return res.status(500).json({ status: "fail", message: err.toString() });
    }
};


export const ReadProfile = async (req, res) => {
    try {
        let result = await ReadProfileService(req, res);
        return res.json(result);
    } catch (err) {
        return res.status(500).json({ status: "fail", message: err.toString() });
    }
};


export const UpdateProfile = async (req, res) => {
    try {
        let result = await UpdateProfileService(req);
        return res.status(result.status).json(result);
    } catch (err) {
        return res.status(500).json({ status: "fail", message: err.toString() });
    }
};


export const UpdateProfilePicture = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ status: "fail", message: "No file uploaded" });
        }

        const result = await UpdateProfilePictureService(req.user, req.file);
        return res.status(result.status).json(result);
    } catch (err) {
        return res.status(500).json({ status: "fail", message: err.toString() });
    }
};

export const UploadBirthCertificate = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ status: "fail", message: "No file uploaded" });
        }

        const result = await UploadBirthCertificateService(req.user, req.file);
        return res.status(result.status).json(result);
    } catch (err) {
        return res.status(500).json({ status: "fail", message: err.toString() });
    }
};


export const GetProfilePicture = async (req, res) => {
    try {
        const result = await GetProfilePictureService(req);
        return res.status(result.status).json(result);
    } catch (err) {
        return res.status(500).json({ status: "fail", message: err.toString() });
    }
};


export const DeleteProfilePicture = async (req, res) => {
    try {
        const result = await DeleteProfilePictureService(req.user);
        return res.status(result.status).json(result);
    } catch (err) {
        return res.status(500).json({ status: "fail", message: err.toString() });
    }
};