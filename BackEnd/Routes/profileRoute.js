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