const express = require("express");
const router = express.Router();
const serviceModal = require("../schema/serviceModal");
const serviceProfile = require("../schema/serviceProfile");
const Joi = require("joi");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors"); 
require('dotenv').config()
router.use(express.json());

router.use(cors()); 

const generateToken = (service) => {
    return jwt.sign({ username: service.username }, process.env.SECRET_KEY, { expiresIn: "2h" })
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
        const { username, email,timezone, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const profile = (await serviceProfile.create({ username: username, email }));
        const newservice = await serviceModal.create({
            username: username,
            email: email,
            password: hashedPassword,
            profile: profile._id,
            timezone: timezone,
        });
        const token = generateToken(newservice);

        res.status(201).json({ serviceData: newservice, token: token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.post("/sign-in", async (req, res) => {
    try {
        const { username, password } = req.body;

        const service = await serviceModal.findOne({ username });
        if (!service) {
            return res.status(401).json({ error: "Invalid username" });
        }   
        
        
        if (!password || !service.password) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const isPasswordValid = await bcrypt.compare(password, service.password); 
        
        if (!isPasswordValid) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const token = generateToken(service);
        if (!token) { 
            return res.status(500).json({ error: "Failed to generate token" });
        }

        res.status(201).json({ username: service.username, token });
       
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});



// router.put("/:id", validatePutservice, async (req, res) => {
//     try {
//         const updatedservice = await serviceModal.findByIdAndUpdate(req.params.id, req.body, { new: true });
//         if (!updatedservice) {
//             return res.status(404).json({ message: "service not found" });
//         }
//         res.json(updatedservice);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: "Internal server error" });
//     }
// });

// router.delete("/:id", async (req, res) => {
//     try {
//         const deletedservice = await serviceModal.findByIdAndDelete(req.params.id);
//         if (!deletedservice) {
//             return res.status(404).json({ message: "service not found" });
//         }
//         res.json({ message: "service deleted successfully" });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: "Internal server error" });
//     }
// });

router.delete("/:username", async (req, res) => {
    try {
        const usernameToDelete = req.params.username;
        const deletedservice = await serviceModal.deleteOne({ username: usernameToDelete });
        if (deletedservice.deletedCount === 0) {
            return res.status(404).json({ message: "Service not found" });
        }
        res.json({ message: "Service deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});




module.exports = router;