import express from 'express';
import { protect,adminProtect } from '../middleware/authMiddleware.js';
import {loginUser,
    registerUser,
    logoutUser,
    getUserProfile,
    updateUserProfile,
    getAllUserByAdmin,
    getUserByAdmin,
    updateUserByAdmin,
    deleteUserByAdmin,
    getGoogleClientId,
    googleLogin} from '../controllers/userController.js';
import asyncHandler from '../middleware/asyncHandler.js';

const router = express.Router();



// const getServer1 = asyncHandler(async (req,res) =>{
//     console.log('okokok')
//     const prodArray = products;
//     res.status(200).json({products:prodArray});
// })

// router.route('/test').get(getServer1);

router.route('/clientId').get(getGoogleClientId);
router.route('/').get(protect,adminProtect,getAllUserByAdmin);
router.post('/register',registerUser);
router.post('/logout',logoutUser);
router.post('/login',loginUser);
router.post('/googleLogin',googleLogin);
router.route('/profile').get(protect,getUserProfile).put(protect,updateUserProfile);
// router.route('/:id').get(protect,adminProtect,getUserByAdmin).delete(protect,adminProtect,deleteUserByAdmin);
router.route('/:id').get(protect,adminProtect,getUserByAdmin).put(protect,adminProtect,updateUserByAdmin).delete(protect,adminProtect,deleteUserByAdmin);

export default router;