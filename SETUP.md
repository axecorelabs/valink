# 🚀 Valentine Link Generator - Setup Guide

## Quick Start Checklist

### 1. ✅ Dependencies Installed
All required packages are installed:
- framer-motion (animations)
- nanoid (unique IDs)
- mongoose (MongoDB)
- canvas-confetti (celebration effects)
- @paystack/inline-js (payment)

### 2. 📝 Environment Variables

You need to configure `.env.local` with:

```env
# MongoDB Connection
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/valentine?retryWrites=true&w=majority

# Paystack Keys (Get from https://dashboard.paystack.com/#/settings/developers)
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_xxxxxxxxxxxxx
PAYSTACK_SECRET_KEY=sk_test_xxxxxxxxxxxxx

# Payment Amount (in kobo, 50000 = ₦500)
NEXT_PUBLIC_PAYMENT_AMOUNT=50000

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. 🗄️ MongoDB Setup Options

#### Option A: MongoDB Atlas (Recommended for Production)
1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account
3. Create a new cluster
4. Click "Connect" → "Connect your application"
5. Copy connection string and add to `.env.local`

#### Option B: Local MongoDB (Development)
```bash
# macOS
brew install mongodb-community
brew services start mongodb-community

# Connection string
MONGODB_URI=mongodb://localhost:27017/valentine
```

### 4. 💳 Paystack Setup

1. Sign up at https://paystack.com
2. Go to Settings → API Keys & Webhooks
3. Copy Test Keys for development
4. Add to `.env.local`
5. For production: Use Live Keys and configure webhook URL:
   `https://yourdomain.com/api/payment/verify`

### 5. 🏃 Run the Application

```bash
# Development mode
npm run dev

# Production build
npm run build
npm start
```

### 6. 🧪 Test the Flow

1. Go to http://localhost:3000
2. Click "Create My Valentine Page"
3. Fill in form and select template
4. Preview and test payment (use Paystack test cards)
5. Verify success page and shareable link

## Paystack Test Cards

```
Card Number: 4084 0840 8408 4081
CVV: 408
Expiry: Any future date
PIN: 0000
OTP: 123456
```

## Project Structure

```
src/
├── app/
│   ├── api/              # API routes
│   ├── create/           # Creation form
│   ├── preview/          # Preview page
│   ├── success/          # Success page
│   ├── v/[id]/          # Valentine viewer
│   └── page.js          # Landing page
├── components/
│   └── templates/       # 3 Valentine templates
├── lib/
│   └── mongodb.js       # DB connection
└── models/
    └── ValentinePage.js # Mongoose schema
```

## Troubleshooting

### MongoDB Connection Issues
- Verify connection string format
- Check IP whitelist in MongoDB Atlas
- Ensure database user has correct permissions

### Paystack Payment Fails
- Confirm API keys are correct
- Use test cards in test mode
- Check console for errors

### Page Not Found Errors
- Ensure MongoDB is connected
- Check page payment status
- Verify page hasn't expired

## Deployment to Vercel

1. Push code to GitHub
2. Import project in Vercel
3. Add all environment variables
4. Deploy!
5. Update `NEXT_PUBLIC_APP_URL` to production URL
6. Configure Paystack webhook

## Support

- Check `.env.local` is properly configured
- Ensure MongoDB connection is active
- Verify Paystack test mode is enabled

---

Need help? Open an issue on GitHub!
