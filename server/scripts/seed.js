import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Category from '../models/Category.js';
import Product from '../models/Product.js';

dotenv.config();

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Category.deleteMany({});
    await Product.deleteMany({});
    console.log('Cleared existing data');

    // Create users
    const adminUser = new User({
      email: 'admin@codixa.am',
      password: 'admin123',
      role: 'admin'
    });

    const regularUser = new User({
      email: 'user@codixa.am',
      password: 'user12345',
      role: 'user'
    });

    await adminUser.save();
    await regularUser.save();
    console.log('Created users');

    // Create categories
    const categories = [
      { name: 'Laptops', slug: 'laptops' },
      { name: 'Smartphones', slug: 'smartphones' },
      { name: 'Tablets', slug: 'tablets' },
      { name: 'Accessories', slug: 'accessories' },
      { name: 'Gaming', slug: 'gaming' },
      { name: 'Audio', slug: 'audio' }
    ];

    const createdCategories = await Category.insertMany(categories);
    console.log('Created categories');

    // Create products
    const products = [
      {
        name: 'MacBook Pro 14"',
        description: 'Apple MacBook Pro with M3 Pro chip, 18GB RAM, 512GB SSD',
        price: 1999.99,
        stockCount: 15,
        images: [
          'https://example.com/macbook-pro-1.jpg',
          'https://example.com/macbook-pro-2.jpg'
        ],
        category: createdCategories[0]._id // Laptops
      },
      {
        name: 'iPhone 15 Pro',
        description: 'Apple iPhone 15 Pro with A17 Pro chip, 256GB storage',
        price: 1199.99,
        stockCount: 25,
        images: [
          'https://example.com/iphone-15-pro-1.jpg',
          'https://example.com/iphone-15-pro-2.jpg'
        ],
        category: createdCategories[1]._id // Smartphones
      },
      {
        name: 'iPad Air',
        description: 'Apple iPad Air with M1 chip, 64GB WiFi',
        price: 599.99,
        stockCount: 20,
        images: [
          'https://example.com/ipad-air-1.jpg'
        ],
        category: createdCategories[2]._id // Tablets
      },
      {
        name: 'AirPods Pro',
        description: 'Apple AirPods Pro with active noise cancellation',
        price: 249.99,
        stockCount: 50,
        images: [
          'https://example.com/airpods-pro-1.jpg'
        ],
        category: createdCategories[5]._id // Audio
      },
      {
        name: 'PlayStation 5',
        description: 'Sony PlayStation 5 console with DualSense controller',
        price: 499.99,
        stockCount: 10,
        images: [
          'https://example.com/ps5-1.jpg'
        ],
        category: createdCategories[4]._id // Gaming
      },
      {
        name: 'Dell XPS 13',
        description: 'Dell XPS 13 laptop with Intel Core i7, 16GB RAM, 512GB SSD',
        price: 1299.99,
        stockCount: 12,
        images: [
          'https://example.com/dell-xps-13-1.jpg'
        ],
        category: createdCategories[0]._id // Laptops
      },
      {
        name: 'Samsung Galaxy S24',
        description: 'Samsung Galaxy S24 with Snapdragon 8 Gen 3, 256GB storage',
        price: 999.99,
        stockCount: 30,
        images: [
          'https://example.com/galaxy-s24-1.jpg'
        ],
        category: createdCategories[1]._id // Smartphones
      },
      {
        name: 'Magic Keyboard',
        description: 'Apple Magic Keyboard with numeric keypad',
        price: 149.99,
        stockCount: 40,
        images: [
          'https://example.com/magic-keyboard-1.jpg'
        ],
        category: createdCategories[3]._id // Accessories
      }
    ];

    await Product.insertMany(products);
    console.log('Created products');

    console.log('\n✅ Seed data created successfully!');
    console.log('\n👤 Login credentials:');
    console.log('Admin: admin@codixa.am / admin123');
    console.log('User: user@codixa.am / user12345');

  } catch (error) {
    console.error('❌ Error seeding data:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

// Run the seed function
seedData();
