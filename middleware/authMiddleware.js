import jwt from 'jsonwebtoken';
import asyncHandler from './asyncHandler.js';
import User from '../models/userModel.js';


export const protect = asyncHandler(async(req,res,next) =>{

    let token;
    token = req.cookies.jwt;
    if(token) {
        try{
            const decoded = jwt.verify(token,process.env.JWT_SECRET);
            req.user = await User.findById(decoded.userId).select("-password"); 
            next();
        }catch(err){
            console.log(err);
            res.status(401);
            throw new Error("Not authorized");
        }
    }else{
        res.status(401);
        throw new Error("Not authorized, no token");
    }
})


export const adminProtect = (req,res,next) =>{

    if (req.user && req.user.isAdmin) {
        next();
      } else {
        res.status(401);
        throw new Error('Not authorized as an admin');
      }
};

