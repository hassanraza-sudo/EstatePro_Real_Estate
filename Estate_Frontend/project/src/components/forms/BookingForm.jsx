import React, { useState } from "react";
import { CalendarDays, Clock, FileText, CheckCircle } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import toast from "react-hot-toast";
import axios from "axios";

const BookingForm = ({ propertyId }) => {
  const { currentUser } = useAuth();
  const [formData, setFormData] = useState({ date: "", time: "", description: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.date || !formData.time) {
      toast.error("Please select a date and time.");
      return;
    }
    setSubmitting(true);
    try {
      await axios.post(
        "http://localhost:5000/api/appointments",
        {
          userId: currentUser._id,
          propertyId,
          date: formData.date,
          time: formData.time,
          description: formData.description,
        },
        { headers: { Authorization: `Bearer ${currentUser.token}` } }
      );
      toast.success("Appointment booked successfully!");
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Booking failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-white rounded-2xl shadow-md p-6 text-center space-y-3">
        <CheckCircle className="w-12 h-12 text-green-500 mx-auto" />
        <h3 className="text-xl font-semibold text-gray-800">Appointment Booked!</h3>
        <p className="text-gray-500 text-sm">We'll confirm your viewing shortly.</p>
        <button onClick={() => { setSubmitted(false); setFormData({ date: "", time: "", description: "" }); }}
          className="text-blue-600 hover:underline text-sm">Book another</button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Book a Viewing</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
            <CalendarDays className="w-4 h-4" /> Date
          </label>
          <input type="date" name="date" value={formData.date} onChange={handleChange} required
            min={new Date().toISOString().split("T")[0]}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
            <Clock className="w-4 h-4" /> Time
          </label>
          <input type="time" name="time" value={formData.time} onChange={handleChange} required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
            <FileText className="w-4 h-4" /> Message (optional)
          </label>
          <textarea name="description" value={formData.description} onChange={handleChange} rows={3}
            placeholder="Any specific questions or requests..."
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none" />
        </div>
        <button type="submit" disabled={submitting}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold py-2 rounded-lg transition">
          {submitting ? "Booking..." : "Book Viewing"}
        </button>
      </form>
    </div>
  );
};

export default BookingForm;
