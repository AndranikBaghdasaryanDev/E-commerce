import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

export const getOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build filter
    const filter = { user: req.user._id };
    
    // Get total count
    const total = await Order.countDocuments(filter);

    // Get orders with pagination
    const orders = await Order.find(filter)
      .populate('items.product', 'name images')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalPages = Math.ceil(total / limit);

    res.json({
      data: orders,
      total,
      page,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ message: 'Server error while fetching orders.' });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user._id
    }).populate('items.product', 'name images');
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found.' });
    }

    res.json(order);
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ message: 'Server error while fetching order.' });
  }
};

export const createOrder = async (req, res) => {
  try {
    const { shippingAddress } = req.body;

    if (!shippingAddress) {
      return res.status(400).json({ message: 'Shipping address is required.' });
    }

    // Get user's cart
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty.' });
    }

    // Check stock availability
    for (const cartItem of cart.items) {
      if (cartItem.product.stockCount < cartItem.quantity) {
        return res.status(400).json({ 
          message: `Insufficient stock for product: ${cartItem.product.name}` 
        });
      }
    }

    // Create order items
    const orderItems = cart.items.map(cartItem => ({
      product: cartItem.product._id,
      quantity: cartItem.quantity,
      price: cartItem.product.price
    }));

    // Create order
    const order = new Order({
      user: req.user._id,
      items: orderItems,
      shippingAddress
    });

    await order.save();

    // Update product stock
    for (const cartItem of cart.items) {
      await Product.findByIdAndUpdate(
        cartItem.product._id,
        { $inc: { stockCount: -cartItem.quantity } }
      );
    }

    // Clear cart
    cart.items = [];
    await cart.save();

    // Populate order details for response
    await order.populate('items.product', 'name images');

    res.status(201).json({
      message: 'Order created successfully.',
      order
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ message: 'Server error while creating order.' });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: 'Status is required.' });
    }

    const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status.' });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found.' });
    }

    order.status = status;
    await order.save();

    res.json({
      message: 'Order status updated successfully.',
      order
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ message: 'Server error while updating order status.' });
  }
};

// Admin only endpoints
export const getAllOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build filter
    const filter = {};
    if (req.query.status) {
      filter.status = req.query.status;
    }
    
    // Get total count
    const total = await Order.countDocuments(filter);

    // Get orders with pagination
    const orders = await Order.find(filter)
      .populate('user', 'email')
      .populate('items.product', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalPages = Math.ceil(total / limit);

    res.json({
      data: orders,
      total,
      page,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1
    });
  } catch (error) {
    console.error('Get all orders error:', error);
    res.status(500).json({ message: 'Server error while fetching orders.' });
  }
};
