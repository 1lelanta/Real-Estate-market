import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import userRoute from './routes/user.route.js'
import authRoute from './routes/signup.route.js'
import cookieParser from 'cookie-parser';
import listingRouter from './routes/listing.route.js'

dotenv.config()
const app = express()

app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true, 
}))

app.use(express.json())
app.use(cookieParser())

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('mongoDB is connected'))
  .catch(err => console.log(err))

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`server is running on http://localhost:${PORT}`))

app.use('/api/user', userRoute)
app.use('/api/auth', authRoute)
app.use('/api/listing',listingRouter);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500
  const message = err.message || 'internal server error'
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  })
})
