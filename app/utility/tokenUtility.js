import {
    ACCESS_TOKEN_SECRET_KEY,
    ACCESS_TOKEN_EXPIRE_TIME,
    REFRESH_TOKEN_SECRET_KEY,
    REFRESH_TOKEN_EXPIRE_TIME,
    HTTP_ONLY,
    IS_PRODUCTION,
    MAX_AGE,
    SAME_SITE
} from "../config/config.js";
import jwt from "jsonwebtoken";

//Create Access Token (Token Encode)
export const CreateAccessToken = (email, id)=>{
    let PAYLOAD = {student_email: email, student_id: id};
    let KEY = ACCESS_TOKEN_SECRET_KEY;
    let EXPIRE = {expiresIn: ACCESS_TOKEN_EXPIRE_TIME};
    return jwt.sign(PAYLOAD, KEY, EXPIRE);
};

//Create Refresh Token (Token Encode)
export const CreateRefreshToken = (email, id)=>{
    const PAYLOAD = {student_email: email, student_id: id};
    let KEY = REFRESH_TOKEN_SECRET_KEY;
    let EXPIRE = {expiresIn: REFRESH_TOKEN_EXPIRE_TIME};
    return jwt.sign(PAYLOAD, KEY, EXPIRE);
};

//Store refresh token in a secure HTTP-only cookie
export const StoreRefreshTokenInCookie = (res, tokenName, tokenValue) =>{
    return res.cookie(tokenName, tokenValue, {
        httpOnly: HTTP_ONLY,
        secure: IS_PRODUCTION,
        maxAge: MAX_AGE,
        sameSite: SAME_SITE
    });
};

// Token Decode
export const TokenDecode = (token) => {
    try {
        // Verify the token signature and ensure it's valid
        const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET_KEY);
        return decoded;  // Return decoded payload if valid
    } catch (error) {
        // Handle specific JWT errors
        if (error.name === 'TokenExpiredError') {
            return { error: "Token expired" };
        } else if (error.name === 'JsonWebTokenError') {
            return { error: "Invalid token" };
        } else {
            return { error: "Token verification failed" };
        }
    }
};
