import Product from '../models/Product.js';
import Category from '../models/Category.js';

export const getProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 8;
    const skip = (page - 1) * limit;

    // Build filter
    const filter = {};
    if (req.query.category) {
      const category = await Category.findOne({ slug: req.query.category });
      if (category) {
        filter.category = category._id;
      }
    }

    // Get total count
    const total = await Product.countDocuments(filter);

    // Get products with pagination
    const products = await Product.find(filter)
      .populate('category', 'name slug')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalPages = Math.ceil(total / limit);

    res.json({
      data: products,
      total,
      page,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ message: 'Server error while fetching products.' });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('category', 'name slug');
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    res.json(product);
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ message: 'Server error while fetching product.' });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { name, description, price, stockCount, images, category } = req.body;

    // Validate required fields
    if (!name || !description || !price || !category) {
      return res.status(400).json({ message: 'Name, description, price, and category are required.' });
    }

    // Check if category exists
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(400).json({ message: 'Invalid category.' });
    }

    const product = new Product({
      name,
      description,
      price,
      stockCount: stockCount || 0,
      images: images || [],
      category
    });

    await product.save();
    await product.populate('category', 'name slug');

    res.status(201).json({
      message: 'Product created successfully.',
      product
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ message: 'Server error while creating product.' });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { name, description, price, stockCount, images, category } = req.body;

    // Check if product exists
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    // Validate category if provided
    if (category) {
      const categoryExists = await Category.findById(category);
      if (!categoryExists) {
        return res.status(400).json({ message: 'Invalid category.' });
      }
    }

    // Update product
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        ...(name && { name }),
        ...(description && { description }),
        ...(price !== undefined && { price }),
        ...(stockCount !== undefined && { stockCount }),
        ...(images && { images }),
        ...(category && { category })
      },
      { new: true, runValidators: true }
    ).populate('category', 'name slug');

    res.json({
      message: 'Product updated successfully.',
      product: updatedProduct
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ message: 'Server error while updating product.' });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    await Product.findByIdAndDelete(req.params.id);

    res.json({
      message: 'Product deleted successfully.'
    });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ message: 'Server error while deleting product.' });
  }
};
