const express = require("express");
const router = express.Router();
const serviceProfile = require("../schema/serviceProfile");
const Joi = require("joi");
require('dotenv').config()
router.use(express.json());

const putProfileJoiSchema = Joi.object({
    username: Joi.string().alphanum().min(3).max(30),
    email: Joi.string().email(),
    password: Joi.string(),
    timezone: Joi.string(),
    name: Joi.string(),
    avatar: Joi.any(), 
    location: Joi.string(),
    zip: Joi.number().integer(), 
    website: Joi.string().uri(), 
    bio: Joi.string(),
    picture: Joi.any(),
}).min(1);

function validateputProfile(req, res, next) {
    const { error } = putProfileJoiSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    next();
}

router.get("/", async (req, res) => {
    try {
        const data = await serviceProfile.find();
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "500-Internal server error" });
    }
});

router.get("/:id", async (req, res) => {
    const id = req.params.id;
    try {
        const data = await serviceProfile.findById(id);
        if (!data) {
            return res.status(404).json({ error: "service not found" });
        }
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});

router.put("/:id", validateputProfile, async (req, res) => {
    try {
        const updatedservice = await serviceProfile.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedservice) {
            return res.status(404).json({ message: "service not found" });
        }
        res.json(updatedservice);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const deletedservice = await serviceProfile.findByIdAndDelete(req.params.id);
        if (!deletedservice) {
            return res.status(404).json({ message: "service not found" });
        }
        res.json({ message: "service deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = router;