const express = require("express");
const router = express.Router();
const Property = require("../models/Property");
const authenticateUser = require("../middleware/authMiddleware"); // ✅ Correct single import
const multer = require("multer");
const path = require("path");

// ✅ Set up multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = `${Date.now()}-${file.originalname}`;
    cb(null, name);
  },
});

const upload = multer({ storage });

// ✅ Public: Search & Filter Properties
router.get("/", async (req, res) => {
  try {
    const { location, type, price } = req.query;
    const filter = {};

    if (location) filter.city = { $regex: location, $options: "i" };
    if (type) filter.type = type;
    if (price) {
      if (price.includes("-")) {
        const [min, max] = price.split("-").map(Number);
        filter.price = { $gte: min, $lte: max };
      } else if (price.includes("+")) {
        const min = parseInt(price);
        filter.price = { $gte: min };
      }
    }

    const properties = await Property.find(filter)
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(properties);
  } catch (error) {
    console.error("Failed to fetch properties:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Upload Image
router.post("/upload-image", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }
  res.status(200).json({ imageUrl: `/uploads/${req.file.filename}` });
});

// ✅ Add New Property (Protected)
router.post("/", authenticateUser, async (req, res) => {
  try {
    const {
      title,
      address,
      city,
      type,
      price,
      description,
      images,
      bedrooms,
      bathrooms,
      area,
      isFeatured,
      newListing,
    } = req.body;

    const property = new Property({
      title,
      address,
      city,
      type,
      price,
      description,
      images,
      bedrooms,
      bathrooms,
      area,
      isFeatured,
      newListing,
      user: req.user._id, // Link to current user
    });

    const saved = await property.save();
    res.status(201).json(saved);
  } catch (error) {
    console.error("Failed to add property:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Get My Properties (Protected)
router.get("/my", authenticateUser, async (req, res) => {
  try {
    const userProperties = await Property.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.status(200).json(userProperties);
  } catch (error) {
    console.error("Failed to fetch user properties:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Get Single Property (Public)
router.get("/:id", async (req, res) => {
  try {
    const property = await Property.findById(req.params.id).populate(
      "user",
      "name email"
    );

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    res.status(200).json(property);
  } catch (error) {
    console.error("Failed to fetch property:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Delete Property (Protected)
router.delete("/:id", authenticateUser, async (req, res) => {
  try {
    const property = await Property.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    await property.deleteOne();
    res.status(200).json({ message: "Property deleted successfully" });
  } catch (err) {
    console.error("Error deleting property:", err);
    res.status(500).json({ message: "Server error" });
  }
});
module.exports = router;
