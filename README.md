# LOGS=SALES - Futuristic E-commerce Platform for Social Media Accounts

LOGS=SALES is a production-ready, ultra-modern marketplace designed for selling verified social media accounts and digital assets. It features a stunning futuristic UI with glassmorphism, neon effects, and smooth animations.

## Tech Stack

- **Frontend:** React (Vite), TailwindCSS, Framer Motion, Axios, Lucide React
- **Backend:** Node.js (Express), MongoDB (Mongoose), JWT, Bcrypt
- **Storage:** Cloudinary (for auto-uploading logs and proofs)
- **Deployment:** Vercel (Frontend), Render/Railway (Backend)

## Core Features

- 🛡️ **Verified Delivery System:** Automated credential unlocking via a secure digital vault.
- ⚡ **Manual Payment Flow:** Users upload payment proof screenshots for admin verification.
- 📊 **Smart Admin Panel:** Full control over listings, order status, and real-time revenue stats.
- 🚀 **Extreme Trust Signals:** Live purchase notifications, verified checkmarks, and delivery feeds.
- 📱 **Mobile Optimized:** Fully responsive experience for traders on the go.
- 🔍 **Advanced Filtering:** Instant AJAX-style filtering for platform, region, and price.

## Setup Instructions

### 1. Prerequisite
- Node.js installed
- MongoDB Atlas account
- Cloudinary account

### 2. Backend Setup
1. `cd server`
2. `npm install`
3. Create `.env` from `.env.example` and fill in your credentials.
4. `npm run dev`

### 3. Frontend Setup
1. `cd client`
2. `npm install`
3. Create `.env` and add: `VITE_API_URL=http://localhost:5000/api`
4. `npm run dev`

### 4. Default Admin
- **Email:** admin@logssales.com
- **Password:** admin123
*(Login and change immediately)*

## Security
- Password hashing with Bcrypt
- Protected API routes with JWT
- Cloud-hosted images
- Input sanitization & error handling

---
Created by LOGS=SALES Development Team.
