import express from 'express';
import { 
  getProducts, 
  getProductById, 
  createProduct, 
  updateProduct, 
  deleteProduct 
} from '../controllers/productController.js';
import { authMiddleware, checkRole } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getProducts);
router.get('/:id', getProductById);

// Admin only routes
router.post('/', authMiddleware, checkRole(['admin']), createProduct);
router.put('/:id', authMiddleware, checkRole(['admin']), updateProduct);
router.delete('/:id', authMiddleware, checkRole(['admin']), deleteProduct);

export default router;
