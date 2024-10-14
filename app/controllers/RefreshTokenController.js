import {RefreshTokenService} from '../services/RefreshTokenServices.js';

export const RefreshToken = async(req, res)=>{
    let result= await RefreshTokenService(req, res);
    return res.status(result.status).json(result);
}