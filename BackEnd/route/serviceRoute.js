const express = require("express");
const router = express.Router();
const serviceModal = require("../schema/serviceModal");
const serviceProfile = require("../schema/serviceProfile");
const Joi = require("joi");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require('dotenv').config()
router.use(express.json());

SECRET_KEY="secretkey"
const generateToken = (service) => {
    return jwt.sign({ username: service.username }, SECRET_KEY, { expiresIn: "2h" })
}

const serviceJoiSchema = Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    timezone : Joi.string(),
    name : Joi.string()
});

const putserviceJoiSchema = Joi.object({
    username: Joi.string().alphanum().min(3).max(30),
    email: Joi.string().email(),
    password: Joi.string(),
    timezone : Joi.string(),
    name : Joi.string()
}).min(1);

function validateservice(req, res, next) {
    const { error } = serviceJoiSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    next();
}

function validatePutservice(req, res, next) {
    const { error } = putserviceJoiSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    next();
}

router.get("/", async (req, res) => {
    try {
        const data = await serviceModal.find();
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "500-Internal server error" });
    }
});

router.get("/:id", async (req, res) => {
    const id = req.params.id;
    try {
        const data = await serviceModal.findById(id);
        if (!data) {
            return res.status(404).json({ error: "service not found" });
        }
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});

router.post("/", validateservice, async (req, res) => {
    try {
        const { username, email, password , name, timezone } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const profile = (await serviceProfile.create({ username: username, email }));
        const newservice = await serviceModal.create({
            username: username,
            email: email,
            password: hashedPassword,
            profile: profile._id,
            timezone: timezone,
            name: name
        });
        const token = generateToken(newservice);

        res.status(201).json({ serviceData: newservice, token: token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.put("/:id", validatePutservice, async (req, res) => {
    try {
        const updatedservice = await serviceModal.findByIdAndUpdate(req.params.id, req.body, { new: true });
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
        const deletedservice = await serviceModal.findByIdAndDelete(req.params.id);
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