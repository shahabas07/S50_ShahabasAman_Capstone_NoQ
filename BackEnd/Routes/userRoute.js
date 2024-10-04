// serviceRoutes.js
const express = require("express");
const router = express.Router();
const Service = require("../Schemas/userSchema");
const ServiceProfile = require("../Schemas/profileSchema");
const Section = require("../Schemas/availabilitySchema");
const Joi = require("joi");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");
require('dotenv').config();

router.use(express.json());
router.use(cors());

const generateToken = (service) => {
  return jwt.sign({ username: service.username }, process.env.SECRET_KEY, { expiresIn: "2h" });
}

const serviceJoiSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  timezone: Joi.string(),
  name: Joi.string()
});

const putServiceJoiSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30),
  email: Joi.string().email(),
  password: Joi.string(),
  timezone: Joi.string(),
  name: Joi.string()
}).min(1);

function validateService(req, res, next) {
  const { error } = serviceJoiSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
}

function validatePutService(req, res, next) {
  const { error } = putServiceJoiSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
}

router.get("/", async (req, res) => {
  try {
    const data = await Service.find().populate('profile');
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "500-Internal server error" });
  }
});

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const data = await Service.findById(id).populate('profile');
    if (!data) {
      return res.status(404).json({ error: "Service not found" });
    }
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/", validateService, async (req, res) => {
  try {
    const { username, email, timezone, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the profile first
    const profile = await ServiceProfile.create({ username: username, email });

    // Create a section document
    const section = await Section.create({
      daysOfWeek: {
        Monday: false,
        Tuesday: false,
        Wednesday: false,
        Thursday: false,
        Friday: false,
        Saturday: false,
        Sunday: false
      }
    });

    // Update the profile with the section ID
    profile.section = section._id;
    await profile.save();

    // Create the service with the profile ID
    const newService = await Service.create({
      username: username,
      email: email,
      password: hashedPassword,
      profile: profile._id,
      timezone: timezone,
    });

    const token = generateToken(newService);
    res.status(201).json({ serviceData: newService, token: token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post('/sign-in', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await Service.findOne({ username });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).json({ message: 'Invalid password' });

    const token = jwt.sign({ username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
    
    // Include the username in the response
    res.json({ token, username: user.username });
  } catch (error) {
    res.status(500).json({ message: 'Error signing in' });
  }
});


router.delete("/:username", async (req, res) => {
  try {
    const usernameToDelete = req.params.username;
    const deletedService = await Service.deleteOne({ username: usernameToDelete });
    if (deletedService.deletedCount === 0) {
      return res.status(404).json({ message: "Service not found" });
    }
    res.json({ message: "Service deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
