import express from 'express';
import { createOrder, getUserOrders, getOrder, getOrders, updateOrderStatus } from '../controllers/orderController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, createOrder);
router.get('/mine', protect, getUserOrders);
router.get('/:id', protect, getOrder);
router.get('/', protect, admin, getOrders);
router.put('/:id/status', protect, admin, updateOrderStatus);

export default router;
