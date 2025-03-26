import mongoose from 'mongoose'
import { MONGO_URI, MONGO_OPTIONS } from '../constants/index'

class Mongo {
  instance: typeof mongoose = mongoose
  mongoUri: string
  mongoOptions: mongoose.ConnectOptions
  isConnected: boolean

  constructor() {
    this.mongoUri = MONGO_URI
    this.mongoOptions = MONGO_OPTIONS
    this.isConnected = false
  }

  async connect() {
  if (this.isConnected) return

  console.log('🔍 MongoDB URI:', this.mongoUri)
  console.log('🔍 MongoDB Options:', this.mongoOptions)

  try {
    console.log('⏳ Connecting to MongoDB...')
    const db = await this.instance.connect(this.mongoUri, this.mongoOptions)
    const connection = db.connection

    this.isConnected = connection.readyState === 1
    if (this.isConnected) console.log('✅ MongoDB connected')

    connection.on('connected', () => console.log('✅ MongoDB reconnected'))
    connection.on('disconnected', () => console.log('❌ MongoDB disconnected'))
    connection.on('error', (error) => console.log('❌ MongoDB connection error:', error))
  } catch (error: any) {
    console.log('❌ MongoDB connection error:', error.message)
  }
}

}

export default new Mongo()
