import express from 'express';
import { protect,adminProtect } from '../middleware/authMiddleware.js';

import { 
    getProducts,
    getProduct, 
    createProduct, 
    updateProduct,
     deleteProduct, 
     createProductReview, 
     getTopProducts, 
     deleteProductReview, 
     canUserReview,
     uploadProductImages,
     deleteProductImage
} from '../controllers/productController.js';


const router = express.Router();


router.route('/').get(getProducts).post(protect,adminProtect,createProduct);
router.route('/canReview').get(protect,canUserReview);
router.get('/top',getTopProducts);
router.route('/:id').get(getProduct).put(protect,adminProtect,updateProduct).delete(protect,adminProtect,deleteProduct);
router.route('/:id/upload_images').put(protect,adminProtect,uploadProductImages);
router.route('/:id/delete_image').put(protect,adminProtect,deleteProductImage);
router.route('/:id/reviews').post(protect,createProductReview)
router.route('/:id/reviews').delete(protect,adminProtect,deleteProductReview)

export default router;
