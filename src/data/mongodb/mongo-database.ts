import mongoose from "mongoose"

interface Options {
  mongoURL: string
  dbName: string
}

export class MongoDatabase {
  static async connect(options: Options) {
    // Connect to MongoDB

    const { mongoURL, dbName } = options

    try {

      await mongoose.connect(mongoURL, {
        dbName: dbName,
      })

      console.log('Connected to MongoDB')

    } catch (error) {
      console.error('Error connecting to MongoDB: ', error)
      throw error


    }
  }
}