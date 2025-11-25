import jwt from 'jsonwebtoken';
import User from "../models/user.model.js";

export const protectRoute = async (req , res , next)=>{
    try {
        // accept token from cookie or Authorization header (Bearer)
        const tokenFromCookie = req.cookies && req.cookies.jwt;
        const authHeader = req.headers.authorization || req.headers.Authorization;
        const tokenFromHeader = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

        const token = tokenFromCookie || tokenFromHeader;

        if(!token){
            return res.status(401).json({message:"Unauthorized - No token provided"});
        }

        let decoded;
        try {
            decoded = jwt.verify(token , process.env.JWT_SECRET);
        } catch (err) {
            if (err.name === 'TokenExpiredError') {
                return res.status(401).json({message: 'Unauthorized - Token expired'});
            }
            return res.status(401).json({message: 'Unauthorized - Invalid token'});
        }
        const user = await User.findById(decoded.userId).select("-password");

        if(!user){
            return res.status(401).json({message:"Unauthorized - User not found"});
        }

        req.user = user;

        next();
    } catch (error) {
        console.log("Error in protectRoute middleware: ",error.message);
        res.status(500).json({message:"Internal server error"});
    }
}