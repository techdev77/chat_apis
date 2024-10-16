const jwt = require('jsonwebtoken');
const UserModel=require('../models/user.model');
const {generateAccessToken,generateRefreshToken}=require('../utils/common.utils');
require('dotenv').config();


const authMiddleware = async (req, res, next) => {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

    if (!token) {
        return res.status(401).json({success:false, message: 'Authorization token is missing.' });
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token,  process.env.AUTH_SECRET_JWT);
        req.uid=decoded.user_id;
        const user=await UserModel.findOne({ where: { id: decoded.user_id,activated:'1' } });
        if (!user) {
            res.status(404).json({success:false,message:"Authentication failed."})
        }

        next();
    } catch (error) {
        if(error.name=="TokenExpiredError"){
            let user=await UserModel.findOne({ where: { auth_token: token,activated:'1' } });
            if (!user) {
                res.status(404).json({success:false,message:"Authentication failed."})
                return;
            }
            const newToken = generateAccessToken(user.id,user.email,user.updated_at);
            const newRefreshToken = generateRefreshToken(user.id,user.email,user.updated_at);
            user.auth_token=newToken;
            user.refresh_token=newRefreshToken;
            await user.save();
            next();
        }
        else{
            return res.status(401).json({success:false, message: error});
        }
    }
    
};


module.exports = authMiddleware;
