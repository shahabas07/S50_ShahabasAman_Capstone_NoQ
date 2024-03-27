const mongoose = require('mongoose');

//Schema for Service Provider Profile 
const profileSchema = new mongoose.Schema({
  username: String,
  name:String,
  password: String,
  avatar: { type: Buffer },
  location:String,
  zip: Number,
  website: String,
  bio: String,
  email: String,
  picture:{ type: Buffer },
  timezone:String,
  sections: [
    {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'section'
  },
],
});

const serviceProfile = mongoose.model('Profile', profileSchema);

module.exports = serviceProfile;