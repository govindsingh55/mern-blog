require('dotenv').config();
import mongoose from 'mongoose';

export default async function databaseConnect() {
  // database connection
  const host = process.env.MONGO_HOST || 'localhost';
  const port = process.env.MONGO_PORT || 27017;
  const database = process.env.MONGO_DATABASE || 'blog';

  await mongoose.connect(
    `mongodb://${host}:${port}/${database}`,
    { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true },
    (err) => {
      if (!err) console.log('MongoDB connection successful.');
      else {
        console.log('Error in DB connection : ' + JSON.stringify(err, undefined, 2))
        throw new Error('Database connection failed!')
      };
    }
  );

  return
}