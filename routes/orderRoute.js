import express from 'express';
import { protect,adminProtect } from '../middleware/authMiddleware.js';
import {createOrder,
        getUserOrders,
        getOrderById,
        updateOrderToPaid,
        updateOrderToDelivered,
        getOrders} from '../controllers/orderController.js';

const router = express.Router();


router.route('/').get(protect,adminProtect,getOrders).post(protect,createOrder);
router.route('/userOrders').get(protect,getUserOrders);
router.route('/:id').get(protect,getOrderById)
router.route('/:id/pay').put(protect,updateOrderToPaid)
router.route('/:id/deliver').put(protect,adminProtect,updateOrderToDelivered);

export default router;