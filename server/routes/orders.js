import express from 'express';
import { 
  getOrders, 
  getOrderById, 
  createOrder, 
  updateOrderStatus,
  getAllOrders 
} from '../controllers/orderController.js';
import { authMiddleware, checkRole } from '../middlewares/authMiddleware.js';

const router = express.Router();

// User routes (require authentication)
router.get('/', authMiddleware, getOrders);
router.get('/:id', authMiddleware, getOrderById);
router.post('/', authMiddleware, createOrder);

// Admin only routes
router.get('/admin/all', authMiddleware, checkRole(['admin']), getAllOrders);
router.put('/:id/status', authMiddleware, checkRole(['admin']), updateOrderStatus);

export default router;
