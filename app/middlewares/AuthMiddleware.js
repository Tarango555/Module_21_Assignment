// import {TokenDecode} from "../utility/tokenUtility.js";

// export default (req, res, next) => {
//     let token = req.headers['AccessToken'];

//     let decoded = TokenDecode(token);
//     if(decoded === null){
//         res.status(401).json({status: "fail", message: "Unauthorized"});
//     }
//     else{
//         req.headers.student_email = decoded.student_email;
//         req.headers.student_id = decoded.student_id;
//         next()
//     }
// }

import { TokenDecode } from '../utility/tokenUtility.js';

export const verifyAccessToken = (req, res, next) => {

    // Get token from the Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ status: "fail", message: "Access token missing" });
    }

    // Extract the token from 'Bearer <token>'
    const token = authHeader.split(' ')[1];
    
    // Decode and verify the token using TokenDecode
    const decoded = TokenDecode(token);
    
    // Handle token decoding errors
    if (decoded.error) {
        if (decoded.error === "Token expired") {
            return res.status(401).json({ status: "fail", message: "Access token expired" });
        } else if (decoded.error === "Invalid token") {
            return res.status(403).json({ status: "fail", message: "Access token invalid" });
        } else {
            return res.status(500).json({ status: "fail", message: "Token verification failed" });
        }
    }

    // Attach decoded user information to the request object
    req.user = decoded;
    next();  // Proceed to the next middleware or controller
};
