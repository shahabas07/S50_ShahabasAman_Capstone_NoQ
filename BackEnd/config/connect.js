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



// MongoUri="mongodb+srv://shahabas:819qUMxJLb5xeqS3@nodecluster.vnvihle.mongodb.net/NoQ"