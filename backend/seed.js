import mongoose from 'mongoose'
import dotenv from 'dotenv'
import bcrypt from 'bcryptjs'
import User from './models/userModel.js'
import Listing from './models/listingModel.js'

dotenv.config()

const MONGO = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/real-estate'

const sampleUsers = [
  {
    username: 'amina',
    email: 'amina@example.com',
    password: 'password123',
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg'
  },
  {
    username: 'jon',
    email: 'jon@example.com',
    password: 'password123',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg'
  }
]

const sampleListings = (userIds) => [
  {
    name: 'Sunny 2BR Apartment',
    address: '123 Palm St, Springfield',
    description: 'A bright apartment with balcony and great city views.',
    regularPrice: 1200,
    discountPrice: 1100,
    offer: true,
    type: 'rent',
    bedrooms: 2,
    bathrooms: 1,
    parking: true,
    furnished: false,
    imageUrls: [
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80'
    ],
    userRef: userIds[0]
  },
  {
    name: 'Cozy Family House',
    address: '45 Maple Ave, Rivertown',
    description: 'Spacious house with garden and garage, perfect for families.',
    regularPrice: 250000,
    offer: false,
    type: 'sale',
    bedrooms: 4,
    bathrooms: 3,
    parking: true,
    furnished: true,
    imageUrls: [
      'https://images.unsplash.com/photo-1572120360610-d971b9b1d0fe?w=1200&q=80',
      'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=1200&q=80'
    ],
    userRef: userIds[1]
  },
  {
    name: 'Modern Studio Downtown',
    address: '8 Market Street, Downtown',
    description: 'Compact studio close to transit and nightlife.',
    regularPrice: 800,
    offer: false,
    type: 'rent',
    bedrooms: 1,
    bathrooms: 1,
    parking: false,
    furnished: true,
    imageUrls: [
      'https://images.unsplash.com/photo-1598928506310-4e0f55f4a4bb?w=1200&q=80'
    ],
    userRef: userIds[0]
  }
]

const run = async () => {
  try {
    await mongoose.connect(MONGO)
    console.log('Connected to mongo for seeding')

    // Clear existing data
    await User.deleteMany({})
    await Listing.deleteMany({})

    // Create users (hash passwords)
    const createdUsers = []
    for (const u of sampleUsers) {
      const hashed = await bcrypt.hash(u.password, 10)
      const user = await User.create({ username: u.username, email: u.email, password: hashed, avatar: u.avatar })
      createdUsers.push(user)
    }

    // Create listings
    const userIds = createdUsers.map(u => u._id)
    const listings = sampleListings(userIds)
    for (const l of listings) {
      await Listing.create(l)
    }

    console.log('Seed data inserted')
    process.exit(0)
  } catch (err) {
    console.error('Seed error', err)
    process.exit(1)
  }
}

run()
