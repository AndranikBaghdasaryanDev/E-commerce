import express from 'express';
import { 
  getCategories, 
  getCategoryById, 
  createCategory, 
  updateCategory, 
  deleteCategory 
} from '../controllers/categoryController.js';
import { authMiddleware, checkRole } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getCategories);
router.get('/:id', getCategoryById);

// Admin only routes
router.post('/', authMiddleware, checkRole(['admin']), createCategory);
router.put('/:id', authMiddleware, checkRole(['admin']), updateCategory);
router.delete('/:id', authMiddleware, checkRole(['admin']), deleteCategory);

export default router;
