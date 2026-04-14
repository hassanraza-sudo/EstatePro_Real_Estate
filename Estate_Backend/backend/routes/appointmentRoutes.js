const express = require("express");
const router = express.Router();
const {
  createAppointment,
  getAllAppointments,
  getAppointmentById,
  updateAppointment,
  deleteAppointment,
} = require("../controllers/appointmentController");
const authenticateUser = require("../middleware/authMiddleware");

// POST /api/appointments — create (authenticated)
router.post("/", authenticateUser, createAppointment);

// GET /api/appointments — get all (authenticated)
router.get("/", authenticateUser, getAllAppointments);

// GET /api/appointments/:id — get single
router.get("/:id", authenticateUser, getAppointmentById);

// PUT /api/appointments/:id — update
router.put("/:id", authenticateUser, updateAppointment);

// DELETE /api/appointments/:id — delete
router.delete("/:id", authenticateUser, deleteAppointment);

module.exports = router;
