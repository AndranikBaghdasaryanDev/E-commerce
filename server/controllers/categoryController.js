import Category from '../models/Category.js';

export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.json(categories);
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ message: 'Server error while fetching categories.' });
  }
};

export const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    
    if (!category) {
      return res.status(404).json({ message: 'Category not found.' });
    }

    res.json(category);
  } catch (error) {
    console.error('Get category error:', error);
    res.status(500).json({ message: 'Server error while fetching category.' });
  }
};

export const createCategory = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Category name is required.' });
    }

    // Check if category already exists
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res.status(400).json({ message: 'Category with this name already exists.' });
    }

    const category = new Category({ name });
    await category.save();

    res.status(201).json({
      message: 'Category created successfully.',
      category
    });
  } catch (error) {
    console.error('Create category error:', error);
    
    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Category with this name already exists.' });
    }
    
    res.status(500).json({ message: 'Server error while creating category.' });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Category name is required.' });
    }

    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found.' });
    }

    // Check if name is being changed and if new name already exists
    if (name !== category.name) {
      const existingCategory = await Category.findOne({ name });
      if (existingCategory) {
        return res.status(400).json({ message: 'Category with this name already exists.' });
      }
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      { name },
      { new: true, runValidators: true }
    );

    res.json({
      message: 'Category updated successfully.',
      category: updatedCategory
    });
  } catch (error) {
    console.error('Update category error:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Category with this name already exists.' });
    }
    
    res.status(500).json({ message: 'Server error while updating category.' });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found.' });
    }

    // Check if category is being used by any products
    const Product = (await import('../models/Product.js')).default;
    const productsCount = await Product.countDocuments({ category: req.params.id });
    
    if (productsCount > 0) {
      return res.status(400).json({ 
        message: 'Cannot delete category. It is being used by products.' 
      });
    }

    await Category.findByIdAndDelete(req.params.id);

    res.json({
      message: 'Category deleted successfully.'
    });
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({ message: 'Server error while deleting category.' });
  }
};
