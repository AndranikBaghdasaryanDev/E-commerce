import express from 'express';
import { 
  getCart, 
  addToCart, 
  updateCartItem, 
  removeFromCart, 
  clearCart 
} from '../controllers/cartController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

// All cart routes require authentication
router.use(authMiddleware);

router.get('/', getCart);
router.post('/', addToCart);
router.put('/', updateCartItem);
router.delete('/:productId', removeFromCart);
router.delete('/', clearCart);

export default router;
