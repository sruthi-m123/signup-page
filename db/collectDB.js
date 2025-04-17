const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/userauth',{})
    console.log(" MongoDB connected successfully");
  } catch (error) {
    console.error("Failed to connect to MongoDB", error.message);
    process.exit(1); //  exit the app if DB fails
  }
};

module.exports = connectDB;
