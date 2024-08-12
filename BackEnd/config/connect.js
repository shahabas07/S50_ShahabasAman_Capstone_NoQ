const mongoose = require('mongoose');
require("dotenv").config();
const url = process.env.MongoUri;

const connectDB = () => {
    mongoose.connect(url)
        .then(() => {
            console.log("MongoDB connected successfully");
        })
        .catch(err => {
            console.error('MongoDB connection error:', err);
        });
};

module.exports = connectDB;
