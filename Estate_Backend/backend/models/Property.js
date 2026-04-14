const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema({
  title: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  type: {
    type: String,
    enum: [
      "house",
      "apartment",
      "condo",
      "townhouse",
      "land",
      "commercial",
      "luxury",
    ],
    required: true,
  },
  price: { type: Number, required: true },
  description: { type: String },
  images: { type: [String], default: [] },
  bedrooms: { type: Number, default: 0 },
  bathrooms: { type: Number, default: 0 },
  area: { type: Number, default: 0 }, // in sq ft
  isFeatured: { type: Boolean, default: false },
  newListing: { type: Boolean, default: false },

  createdAt: {
    type: Date,
    default: Date.now,
  },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

module.exports = mongoose.model("Property", propertySchema);
