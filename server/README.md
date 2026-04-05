# E-commerce Backend API

A professional e-commerce backend API built with Node.js, Express, and MongoDB.

## Features

- **Authentication**: JWT-based authentication with role-based access control
- **User Management**: Admin and user roles with secure password hashing
- **Product Management**: CRUD operations for products with pagination
- **Category Management**: Organize products by categories
- **Shopping Cart**: Add, update, and remove items from cart
- **Order Management**: Create and track orders with status updates
- **Database Seeding**: Initial data setup with sample products and users

## Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing

## Project Structure

```
server/
├── config/
│   └── config.js           # Configuration variables
├── controllers/
│   ├── authController.js   # Authentication logic
│   ├── productController.js # Product CRUD operations
│   ├── categoryController.js # Category CRUD operations
│   ├── cartController.js   # Shopping cart logic
│   └── orderController.js  # Order management
├── middlewares/
│   └── authMiddleware.js   # Authentication & role checking
├── models/
│   ├── User.js            # User schema
│   ├── Product.js         # Product schema
│   ├── Category.js        # Category schema
│   ├── Cart.js            # Shopping cart schema
│   └── Order.js           # Order schema
├── routes/
│   ├── auth.js            # Authentication routes
│   ├── products.js        # Product routes
│   ├── categories.js      # Category routes
│   ├── cart.js            # Cart routes
│   └── orders.js          # Order routes
├── scripts/
│   └── seed.js            # Database seeding script
├── app.js                 # Main application file
├── package.json           # Dependencies and scripts
└── .env.example           # Environment variables template
```

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file from the template:
   ```bash
   cp .env.example .env
   ```

4. Update the `.env` file with your configuration:
   ```env
   PORT=3000
   MONGO_URI=mongodb://localhost:27017/ecommerce
   JWT_SECRET=your_jwt_secret_key_here_make_it_long_and_random
   FRONTEND_URL=http://localhost:5173
   ```

## Database Setup

1. Make sure MongoDB is installed and running on your system
2. Run the seed script to create initial data:
   ```bash
   npm run seed
   ```

This will create:
- Two users (admin and regular user)
- Six categories
- Eight sample products

## Default Users

After running the seed script, you can login with:

**Admin User:**
- Email: `admin@codixa.am`
- Password: `admin123`
- Role: `admin`

**Regular User:**
- Email: `user@codixa.am`
- Password: `user12345`
- Role: `user`

## Running the Application

Start the development server:
```bash
npm run server
```

The API will be available at `http://localhost:3000`

API documentation (Swagger UI) will be available at `http://localhost:3000/api-docs`

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Products
- `GET /api/products` - Get all products (with pagination)
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create product (admin only)
- `PUT /api/products/:id` - Update product (admin only)
- `DELETE /api/products/:id` - Delete product (admin only)

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get category by ID
- `POST /api/categories` - Create category (admin only)
- `PUT /api/categories/:id` - Update category (admin only)
- `DELETE /api/categories/:id` - Delete category (admin only)

### Shopping Cart
- `GET /api/cart` - Get user's cart
- `POST /api/cart` - Add item to cart
- `PUT /api/cart` - Update cart item quantity
- `DELETE /api/cart/:productId` - Remove item from cart
- `DELETE /api/cart` - Clear cart

### Orders
- `GET /api/orders` - Get user's orders
- `GET /api/orders/:id` - Get order by ID
- `POST /api/orders` - Create order
- `GET /api/orders/admin/all` - Get all orders (admin only)
- `PUT /api/orders/:id/status` - Update order status (admin only)

## Authentication

To access protected routes, include the JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## Pagination

Products and orders support pagination using query parameters:

```
GET /api/products?page=1&limit=8
GET /api/orders?page=1&limit=10
```

Response format:
```json
{
  "data": [...],
  "total": 100,
  "page": 1,
  "totalPages": 13,
  "hasNext": true,
  "hasPrev": false
}
```

## Error Handling

The API returns appropriate HTTP status codes and error messages:

- `400` - Bad Request (validation errors)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found (resource doesn't exist)
- `500` - Internal Server Error

## Development

The project uses ES6 modules. Make sure your Node.js version supports ES6 modules (v14.0.0+).

## License

This project is licensed under the MIT License.
