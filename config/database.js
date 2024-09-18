const mongoose = require('mongoose');
require('dotenv').config(); // Load nga .env

const connectToDatabase = async () => {
  const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://besjola:Taleas1234@cluster0.yjfvemy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
  try {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB Atlas connected');
  } catch (err) {
    console.error('MongoDB Atlas connection error:', err);
    process.exit(1);
  }
};

module.exports = connectToDatabase;
