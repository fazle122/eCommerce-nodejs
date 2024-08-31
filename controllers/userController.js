import asyncHandler from "../middleware/asyncHandler.js";
import User from '../models/userModel.js'
import jwt from 'jsonwebtoken';
import generateToken from "../utils/generateToken.js";
import ErrorHandler from "../utils/errorHandlers.js";



const getGoogleClientId = asyncHandler(async(req,res,next) =>{
    res.status(200).json({clientId:process.env.GOOGLE_CLIENT_ID});
})

const loginUser = asyncHandler(async(req,res,next) =>{
    const {email,password} = req.body;
    const user= await User.findOne({email});

    if(user && (await user.matchPassword(password))){
        generateToken(res,user._id);

        res.status(200).json({
            _id:user._id,
            name:user.name,
            email:user.email,
            isAdmin:user.isAdmin
        });
    }else{
        throw new ErrorHandler('Invalid email or password',401);

        // res.status(401);
        // throw new Error('Invalid email or password');
    }
})


const googleLogin = asyncHandler(async(req,res,next) =>{
    const {googleId,email,name,googleImage } = req.body;
    console.log('infofrom server',req.body); 

    try{
        const existingUser = await User.findOne({email});
        if(existingUser){
            existingUser.googleId = googleId;
            existingUser.googleImage = googleImage;
            await existingUser.save();
            generateToken(res,existingUser._id);
        
                res.status(200).json({
                    _id:existingUser._id,
                    name:existingUser.name,
                    email:existingUser.email,
                    googleId:existingUser.googleId,
                    googleImage:existingUser.googleImage,
                    isAdmin:existingUser.isAdmin 
                });

        }else{
            const user= await User.findOne({googleId});
            console.log(user);
            if(user){
                generateToken(res,user._id);
        
                res.status(200).json({
                    _id:user._id,
                    name:user.name,
                    email:user.email,
                    googleId:user.googleId,
                    googleImage:user.googleImage,
                    isAdmin:user.isAdmin 
                });
            }else{
                console.log('creating new user...')
                const newUser =  await  User.create({
                    email,name,googleId,googleImage
                });     
                console.log(newUser);
                generateToken(res,newUser._id);

                res.status(200).json({
                    _id:newUser._id,
                    name:newUser.name,
                    email:newUser.email,
                    googleId:newUser.googleId,
                    googleImage:newUser.googleImage,
                    isAdmin:newUser.isAdmin 
                });

            }
        }
        

    }catch(err){
        res.status(401);
        throw new Error(err);
    }
})

const registerUser = asyncHandler(async(req,res,next) =>{
    const {name,email,password} = req.body;

    const userExists = await User.findOne({email});
    if(userExists){
        res.status(400);
        throw new Error("user already exists");
    }
    const user= await User.create({name,email,password});
    if(user){
        generateToken(res,user._id);
         res.status(201).json({
            _id:user._id,
            name:user.name,
            email:user.email,
            isAdmin:user.isAdmin
         });

    }else{
        es.status(400);
        throw new Error('Invalid user data');
    }
    
})


const logoutUser = asyncHandler(async(req,res,next) =>{
    res.cookie('jwt','',{httpOnly:true,expires:new Date(0)});
    res.status(200).json({message:'logged out succesfully '})
    
})

const getUserProfile = asyncHandler(async(req,res,next) =>{
    const user= await User.findById(req.user._id);
    if(user){
         res.status(200).json({
            _id:user._id,
            name:user.name,
            email:user.email,
            isAdmin:user.isAdmin
         });

    }else{
        es.status(400);
        throw new Error('User not found');
    }
    
})

const updateUserProfile = asyncHandler(async(req,res,next) =>{ 
    const user= await User.findById(req.user._id);
    if(user){
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        if(req.body.password){
            user.password = req.body.password;
        }
        const updatedUser = await user.save();
        res.status(200).json({
            _id:updatedUser._id,
            name:updatedUser.name,
            email:updatedUser.email,
            isAdmin:updatedUser.isAdmin
         });

    }else{
        es.status(400);
        throw new Error('User not found');
    }
    
})

const getAllUserByAdmin = asyncHandler(async(req,res,next) =>{
    const users = await User.find({});
    if(users){
        res.status(200).json(users)
    }else{
        es.status(400);
        throw new Error('Users not found');
    }
    
})

const getUserByAdmin = asyncHandler(async(req,res,next) =>{
    console.log('admin fetching user...')

    const user = await User.findById(req.params.id).select('-password');
    if(user){
        res.status(200).json(user)
    }else{
        es.status(400);
        throw new Error('User not found');
    }
})

const updateUserByAdmin = asyncHandler(async(req,res,next) =>{
    console.log('updating user...')
    const user = await User.findById(req.params.id);

    if(user){
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.isAdmin = Boolean(req.body.isAdmin);
         const updatedUser =await user.save();
        res.status(201).json({
            _id:updatedUser._id,
            name:updatedUser.name,
            email:updatedUser.email,
            isAdmin:updatedUser.isAdmin 
        })
        
    }else{
        es.status(404);
        throw new Error('User not found');
    }
})


const deleteUserByAdmin = asyncHandler(async(req,res,next) =>{


    const user = await User.findById(req.params.id);
    if(user){
        if(user.isAdmin){
            res.status(400);
            throw new Error('Cannot delete admin')
        }else{
            await User.deleteOne({_id:user._id});
            res.status(201).json({message:'User deleted successfully'})
        }
    }else{
        es.status(400);
        throw new Error('User not found');
    }
})


export {getGoogleClientId,loginUser,googleLogin,registerUser,logoutUser,getUserProfile,updateUserProfile,getAllUserByAdmin,getUserByAdmin,updateUserByAdmin,deleteUserByAdmin}