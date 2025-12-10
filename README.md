# QuickMart - Instant Grocery Delivery App

A full-featured React + Node.js grocery delivery application similar to Instamart, with MongoDB database, user authentication, shopping cart, order management, and admin panel.

## Features

### User Features
- 🔐 User Registration & Login with JWT authentication
- 🛒 Browse 70+ products across 12 categories
- 🔍 Search functionality
- 🛍️ Shopping cart with quantity management
- 📦 Order placement and tracking
- 💰 All prices in Indian Rupees (₹)

### Admin Features
- 📊 Dashboard with statistics
- 📋 Order management (update status)
- 🏪 Product inventory management (edit price, stock)
- 👥 User management
- 💵 Revenue tracking

### Product Categories
- Fruits & Vegetables
- Dairy Products
- Flours & Grains
- Pulses & Lentils
- Spices
- Cooking Essentials
- Snacks & Beverages
- Personal Care
- Bakery Items

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud)

### Backend Setup

1. Navigate to server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file with your MongoDB connection:
```env
MONGODB_URI=mongodb://localhost:27017/quickmart
JWT_SECRET=your_jwt_secret_key_here
PORT=5000
```

4. Seed the database with products:
```bash
node scripts/seedProducts.js
```

5. Create admin user:
```bash
node scripts/createAdmin.js
```

6. Start the server:
```bash
npm run dev
```

### Frontend Setup

1. Navigate to root directory and install dependencies:
```bash
npm install
```

2. Start the React app:
```bash
npm start
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Admin Access

After running the createAdmin script, you can login with:
- Email: admin@quickmart.com
- Password: admin123

## Database Schema

### User Model
- name, email, password (hashed)
- phone, address, role (user/admin)
- timestamps

### Product Model
- name, category, price, unit, emoji
- stock, isActive
- timestamps

### Order Model
- userId (ref to User)
- items array with product details
- total, status, user info
- timestamps

## API Endpoints

### Authentication
- POST `/api/auth/register` - User registration
- POST `/api/auth/login` - User login
- GET `/api/auth/me` - Get current user

### Products
- GET `/api/products` - Get all products
- PUT `/api/products/:id` - Update product (admin)
- DELETE `/api/products/:id` - Delete product (admin)

### Orders
- GET `/api/orders/my-orders` - Get user orders
- POST `/api/orders` - Create order
- GET `/api/orders` - Get all orders (admin)
- PUT `/api/orders/:id/status` - Update order status (admin)

### Users
- GET `/api/users` - Get all users (admin)
- GET `/api/users/stats` - Get user statistics (admin)

## Tech Stack

### Frontend
- React 18
- React Router v6
- Context API for state management
- Axios for API calls
- CSS3 for styling

### Backend
- Node.js + Express
- MongoDB + Mongoose
- JWT for authentication
- bcryptjs for password hashing
- CORS for cross-origin requests

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Role-based access control
- API input validation
- Protected admin routes

## Project Structure

```
├── server/
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API routes
│   ├── middleware/      # Auth middleware
│   ├── scripts/         # Database scripts
│   └── server.js        # Express server
├── src/
│   ├── components/      # React components
│   ├── context/         # Context providers
│   ├── pages/           # Page components
│   ├── services/        # API service layer
│   └── App.js           # Main app component
└── package.json
```

## Development

### Running in Development
- Backend: `cd server && npm run dev`
- Frontend: `npm start`

### Database Operations
- Seed products: `node server/scripts/seedProducts.js`
- Create admin: `node server/scripts/createAdmin.js`

## License

MIT
