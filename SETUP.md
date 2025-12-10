# QuickMart Setup Guide

## Quick Start

### 1. Install Dependencies
```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
cd ..
```

### 2. Setup MongoDB
Make sure MongoDB is running on your system:
- **Local MongoDB**: `mongod` (default: mongodb://localhost:27017)
- **MongoDB Atlas**: Update `server/.env` with your connection string

### 3. Configure Environment
Update `server/.env`:
```env
MONGODB_URI=mongodb://localhost:27017/quickmart
JWT_SECRET=your_secure_jwt_secret_key_here
PORT=5000
```

### 4. Initialize Database
```bash
cd server

# Seed products
node scripts/seedProducts.js

# Create admin user
node scripts/createAdmin.js

# Test database connection
node test-server.js
```

### 5. Start the Application
```bash
# Terminal 1: Start backend server
cd server
npm run dev

# Terminal 2: Start frontend (in new terminal)
npm start
```

## Troubleshooting

### Items not adding to cart?
1. Check browser console for errors
2. Verify products are loaded from API
3. Check if user is logged in

### Orders not placing?
1. Check server logs for errors
2. Verify JWT token is valid
3. Check product stock availability

### Database issues?
```bash
cd server
node test-server.js
```

## Admin Access
- Email: admin@quickmart.com  
- Password: admin123

## API Endpoints
- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- API Base: http://localhost:5000/api

## Common Issues

### Port conflicts
- Change PORT in `server/.env`
- Update REACT_APP_API_URL in `.env`

### MongoDB connection
- Ensure MongoDB is running
- Check connection string in `server/.env`

### CORS errors
- Verify API_URL in frontend `.env`
- Check server CORS configuration