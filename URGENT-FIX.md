# URGENT FIX - API Connection Issue

## Problem Identified
Your deployed frontend at `https://quickmart-gamma.vercel.app` is still calling the old API URL:
❌ `https://your-backend-deployment.vercel.app/api/auth/login`

Instead of the correct Render backend:
✅ `https://quickmart-backend-tvuf.onrender.com/api/auth/login`

## Immediate Fix Steps

### Step 1: Update Vercel Environment Variables
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Find your `quickmart` project
3. Go to **Settings** → **Environment Variables**
4. Add or update this variable:
   - **Name**: `REACT_APP_API_URL`
   - **Value**: `https://quickmart-backend-tvuf.onrender.com/api`
   - **Environment**: Production

### Step 2: Redeploy Frontend
After updating the environment variable:
1. Go to **Deployments** tab in Vercel
2. Click the **3 dots** on your latest deployment
3. Click **"Redeploy"**
4. Wait for deployment to complete

### Step 3: Update Backend CORS (Already Done)
I've updated the backend to accept requests from your new frontend URL:
- ✅ `https://quickmart-gamma.vercel.app`

### Step 4: Test the Fix
After redeployment, test these URLs in browser:

**Backend Health Check:**
```
https://quickmart-backend-tvuf.onrender.com/api/health
```

**Frontend Login:**
```
https://quickmart-gamma.vercel.app
```

## Alternative Quick Fix (If Vercel Environment Variables Don't Work)

### Option A: Force Environment Variable in Code
Update `src/services/api.js`:
```javascript
const API_BASE_URL = 'https://quickmart-backend-tvuf.onrender.com/api';
```

### Option B: Git Push Method
```bash
git add .
git commit -m "Fix API URL for production deployment"
git push
```

## Verification Commands

### Test Backend Directly:
```bash
curl https://quickmart-backend-tvuf.onrender.com/api/health
```

### Test CORS:
```bash
curl -H "Origin: https://quickmart-gamma.vercel.app" \
     -H "Access-Control-Request-Method: POST" \
     -H "Access-Control-Request-Headers: X-Requested-With" \
     -X OPTIONS \
     https://quickmart-backend-tvuf.onrender.com/api/auth/login
```

## Current URLs Summary
- **Frontend**: `https://quickmart-gamma.vercel.app`
- **Backend**: `https://quickmart-backend-tvuf.onrender.com`
- **API Base**: `https://quickmart-backend-tvuf.onrender.com/api`

## Expected Result After Fix
✅ Login should work without CORS errors
✅ API calls should go to Render backend
✅ All features should function properly

## If Still Not Working
1. Check browser Network tab for actual API calls
2. Verify environment variable is set in Vercel
3. Ensure redeployment completed successfully
4. Clear browser cache and try again