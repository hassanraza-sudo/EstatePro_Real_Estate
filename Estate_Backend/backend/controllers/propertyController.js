const Property = require("../models/Property");

exports.createProperty = async (req, res) => {
  try {
    const property = await Property.create({
      ...req.body,
      user: req.user._id,
    });
    res.status(201).json(property);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getAllProperties = async (req, res) => {
  try {
    const properties = await Property.find().populate("user", "name email");
    res.json(properties);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getMyProperties = async (req, res) => {
  try {
    const myProps = await Property.find({ user: req.user._id });
    res.status(200).json(myProps);
  } catch (err) {
    res.status(500).json({ message: "Error fetching your properties" });
  }
};

exports.deleteProperty = async (req, res) => {
  try {
    const property = await Property.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!property) {
      return res.status(404).json({ message: "Property not found or not authorized" });
    }
    res.status(200).json({ message: "Property deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting property" });
  }
};
