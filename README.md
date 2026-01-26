# Real Estate Market

A simple real estate web application to browse, create, and manage property listings.  

## Live Demo

Check out the live project here: [Real Estate Market](https://real-estate-market-3f4n.vercel.app/)

## Features

- User authentication (Sign Up / Sign In)
- Browse and search listings
- Create, update, and delete property listings
- Upload property images
- Filter listings by type, amenities, and offers
- Sort listings by price or date

## Tech Stack

- **Frontend:** React, Vite, Tailwind CSS
- **Backend:** Node.js, Express
- **Database:** MongoDB Atlas
- **Authentication:** JWT, OAuth
- **Storage:** Supabase for images

## Setup

1. Clone the repository:

```bash
git clone https://github.com/1lelanta/Real-Estate-market.git
Install dependencies
cd backend
npm install
cd ../frontend
npm install

Add environment variables:
Backend (.env)
MONGO_URI=<your_mongo_uri>
PORT=3000
JWT_SECRET=<your_jwt_secret>

Run the backend:

cd backend
npm run dev

Run the frontend:

cd frontend
npm run dev
License

MIT

