import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

export const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate({
      path: 'items.product',
      select: 'name price images stockCount'
    });

    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
      await cart.save();
    }

    res.json(cart);
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ message: 'Server error while fetching cart.' });
  }
};

export const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId) {
      return res.status(400).json({ message: 'Product ID is required.' });
    }

    if (!quantity || quantity < 1) {
      return res.status(400).json({ message: 'Quantity must be at least 1.' });
    }

    // Check if product exists and has enough stock
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    if (product.stockCount < quantity) {
      return res.status(400).json({ message: 'Insufficient stock.' });
    }

    // Find or create cart
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
    }

    // Check if product already in cart
    const existingItemIndex = cart.items.findIndex(
      item => item.product.toString() === productId
    );

    if (existingItemIndex !== -1) {
      // Update quantity if product already in cart
      const newQuantity = cart.items[existingItemIndex].quantity + quantity;
      
      if (product.stockCount < newQuantity) {
        return res.status(400).json({ message: 'Insufficient stock for requested quantity.' });
      }
      
      cart.items[existingItemIndex].quantity = newQuantity;
    } else {
      // Add new item to cart
      cart.items.push({
        product: productId,
        quantity
      });
    }

    await cart.save();
    await cart.populate({
      path: 'items.product',
      select: 'name price images stockCount'
    });

    res.json({
      message: 'Product added to cart successfully.',
      cart
    });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ message: 'Server error while adding to cart.' });
  }
};

export const updateCartItem = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId) {
      return res.status(400).json({ message: 'Product ID is required.' });
    }

    if (!quantity || quantity < 1) {
      return res.status(400).json({ message: 'Quantity must be at least 1.' });
    }

    // Check if product exists and has enough stock
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    if (product.stockCount < quantity) {
      return res.status(400).json({ message: 'Insufficient stock.' });
    }

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found.' });
    }

    // Find and update the item
    const itemIndex = cart.items.findIndex(
      item => item.product.toString() === productId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Product not found in cart.' });
    }

    cart.items[itemIndex].quantity = quantity;
    await cart.save();
    await cart.populate({
      path: 'items.product',
      select: 'name price images stockCount'
    });

    res.json({
      message: 'Cart item updated successfully.',
      cart
    });
  } catch (error) {
    console.error('Update cart item error:', error);
    res.status(500).json({ message: 'Server error while updating cart item.' });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!productId) {
      return res.status(400).json({ message: 'Product ID is required.' });
    }

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found.' });
    }

    // Remove the item
    cart.items = cart.items.filter(
      item => item.product.toString() !== productId
    );

    await cart.save();
    await cart.populate({
      path: 'items.product',
      select: 'name price images stockCount'
    });

    res.json({
      message: 'Product removed from cart successfully.',
      cart
    });
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({ message: 'Server error while removing from cart.' });
  }
};

export const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found.' });
    }

    cart.items = [];
    await cart.save();

    res.json({
      message: 'Cart cleared successfully.',
      cart
    });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({ message: 'Server error while clearing cart.' });
  }
};
