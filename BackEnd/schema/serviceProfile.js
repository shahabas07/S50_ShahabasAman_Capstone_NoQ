const mongoose = require('mongoose');

//Schema for Service Provider Profile 
const profileSchema = new mongoose.Schema({
  username: String,
  name:String,
  category: String,
  avatar: { type: Buffer },
  location:String,
  zip: Number,
  website: String,
  bio: String,
  email: String,
  picture:{ type: Buffer },
  timezone:String,
  review: Number
}); 

const serviceProfile = mongoose.model('Profile', profileSchema);

module.exports = serviceProfile;
