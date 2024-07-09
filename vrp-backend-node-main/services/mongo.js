import mongoose from 'mongoose';

import {config} from 'dotenv'

config();

// Update below to match your own MongoDB connection string.
const MONGO_URL = process.env.MONGO_URL;
mongoose.connection.once('open', () => {
  console.log('MongoDB connection ready!');
});

mongoose.connection.on('error', (err) => {
  console.error(err);
});

async function mongoConnect() {
  console.log('Trying to connect mongodb...')
  await mongoose.connect(MONGO_URL, { 
    // add options that are common to both dev and prod here, rest in url
    useNewUrlParser: true, 
    useUnifiedTopology: true 
  });
}

async function mongoDisconnect() {
  await mongoose.disconnect();
}

export {
  mongoConnect,
  mongoDisconnect,
}
