const express = require("express");
const router = express.Router();
const multer = require('multer');
const serviceProfile = require("../Schemas/profileSchema");
const Joi = require("joi");
const cors = require("cors");
require('dotenv').config()
router.use(express.json());
router.use(cors());

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

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.put("/:id",upload.fields([{ name: 'avatar' }, { name: 'picture' }]), async (req, res) => {
    try {
      const id = req.params.id;
      const updateFields = { ...req.body };
    //  console.log(updateFields)
      const updatedService = await serviceProfile.findByIdAndUpdate(
        id,
        updateFields,
        { new: true }
      );
  
      if (!updatedService) {
        return res.status(404).json({ message: "Service not found" });
      }
  
      res.json(updatedService);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  });



const decodetoken = (req, res, next) => {
    console.log(req.cookies)
    const token = req.cookies.token || req.headers["x-access-token"] || req.body.token;
  
    if (!token) {
        return res.status(401).json({ error: "Unauthorized: Token is not provided" });
    }
  
    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.decoded = decoded.id;
  
        console.log("decoded userid", decoded)
        next();
    } catch (error) {
        return res.status(401).json({ error: "Unauthorized: Invalid token" });
    }
  };
  
  
  
  // Token decoding to retrieve userID / profileID
  router.post('/token/getId/:idType', decodetoken, async (req, res) => {
    try {
        const { idType } = req.params;
        const userId = req.decoded;
  
        if (!userId) {
            return res.status(400).json({ error: 'User ID not found in token' });
        }
  
        // Fetch user once and reuse
        const user = await userModel.findById(userId);
  
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
  
        if (idType === 'userID') {
            if (!user.name) {
                return res.status(400).json({ error: 'User name not found' });
            }
  
            return res.status(200).json({ id: userId, name: user.name });
  
        } else if (idType === 'profileID') {
            if (!user.profile) {
                return res.status(400).json({ error: 'Profile ID not found' });
            }
  
            return res.status(200).json({ id: user.profile, name: user.name });
  
        } else {
            return res.status(400).json({ error: 'Invalid ID type' });
        }
  
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
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

router.put("/username/:username", upload.fields([{ name: 'avatar' }, { name: 'picture' }]), async (req, res) => {
    try {
        const username = req.params.username;
        const updateFields = { ...req.body };
        // console.log(updateFields)

        const updatedService = await serviceProfile.findOneAndUpdate(
            { username: username }, 
            updateFields,
            { new: true }
        );

        if (!updatedService) {
            return res.status(404).json({ message: "Service not found" });
        }

        res.json(updatedService);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = router;