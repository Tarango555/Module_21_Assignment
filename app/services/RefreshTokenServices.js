import jwt from 'jsonwebtoken';
import { REFRESH_TOKEN_SECRET_KEY } from "../config/config.js";
import { CreateAccessToken } from "../utility/tokenUtility.js";


export const RefreshTokenService = async(req, res) => {

    // Get refresh token from HTTP-only cookie
    const RefreshToken = req.cookies.RefreshToken;
    if (!RefreshToken) {
        return { status: 401, message: "Refresh token missing" };
    }

    try {
        // Verify the refresh token
        const decoded = jwt.verify(RefreshToken, REFRESH_TOKEN_SECRET_KEY);

        // Generate a new access token
        const newAccessToken = CreateAccessToken(decoded.student_email, decoded.student_id);

        // Send the new access token in the response body
        return { status: 200, accessToken: newAccessToken };
    } catch (err) {
        return { status: 403, message: "Invalid or expired refresh token" };
    }
};