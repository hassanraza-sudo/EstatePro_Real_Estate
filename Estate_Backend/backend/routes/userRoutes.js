const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const { getAllUsers, getUserById, updateUser, deleteUser } = require("../controllers/userController");
const authenticateUser = require("../middleware/authMiddleware");
const User = require("../models/User");

// GET all users (admin only in real app)
router.get("/", getAllUsers);

// GET single user
router.get("/:id", getUserById);

// UPDATE user
router.put("/:id", authenticateUser, updateUser);

// DELETE user
router.delete("/:id", authenticateUser, deleteUser);

// POST change-password (authenticated)
router.post("/change-password", authenticateUser, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Both current and new password are required." });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: "New password must be at least 6 characters." });
    }

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found." });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: "Current password is incorrect." });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.status(200).json({ message: "Password updated successfully." });
  } catch (error) {
    console.error("Change password error:", error);
    res.status(500).json({ message: "Server error." });
  }
});

module.exports = router;
