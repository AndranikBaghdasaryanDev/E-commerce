import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import dotenv from "dotenv"
import swaggerUi from 'swagger-ui-express'
import YAML from 'yamljs'

import { PORT } from "./config/config.js"

// Import routes
import authRoutes from './routes/auth.js'
import productRoutes from './routes/products.js'
import categoryRoutes from './routes/categories.js'
import cartRoutes from './routes/cart.js'
import orderRoutes from './routes/orders.js'

dotenv.config()
const app = express()

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Load Swagger specification
const swaggerDocument = YAML.load('./swagger/swagger.yaml')

// Swagger UI route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

// API routes
app.use('/api/auth', authRoutes)
app.use('/api/products', productRoutes)
app.use('/api/categories', categoryRoutes)
app.use('/api/cart', cartRoutes)
app.use('/api/orders', orderRoutes)

// Health check route
app.get('/', (req, res) => {
    res.json({ 
        message: 'E-commerce API is running',
        version: '1.0.0',
        documentation: '/api-docs'
    })
})

// Database connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('Connected to MongoDB')
        app.listen(PORT, () => {
            console.log(`Server started http://localhost:${PORT}/`)
            console.log(`Swagger UI available at http://localhost:${PORT}/api-docs`)
        })
    })
    .catch((error) => {
        console.error('MongoDB connection error:', error)
        process.exit(1)
    })