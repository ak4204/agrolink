# AgroLink - Deployment Guide

## Firebase Setup

1. Create a Firebase project at https://console.firebase.google.com
2. Enable Authentication (Email/Password and Google)
3. Create a Firestore database
4. Copy your Firebase config

## Local Development

1. Clone the repository
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env.local`
4. Add your Firebase credentials to `.env.local`
5. Run: `npm run dev`

## Deploy to Vercel

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard:
   - VITE_FIREBASE_API_KEY
   - VITE_FIREBASE_AUTH_DOMAIN
   - VITE_FIREBASE_PROJECT_ID
   - VITE_FIREBASE_STORAGE_BUCKET
   - VITE_FIREBASE_MESSAGING_SENDER_ID
   - VITE_FIREBASE_APP_ID
   - VITE_FIREBASE_MEASUREMENT_ID
4. Deploy!

## Admin Access

Admin emails are hardcoded:
- vilasjadhav8849@gmail.com
- akankshbatra4@gmail.com

These users get automatic admin access.
