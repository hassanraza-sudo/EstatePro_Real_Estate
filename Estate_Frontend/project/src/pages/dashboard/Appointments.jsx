import React, { useEffect, useState } from "react";
import axios from "axios";
import { CalendarCheck, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../../contexts/AuthContext";

const statusIcon = {
  pending: <AlertCircle className="w-4 h-4 text-yellow-500" />,
  confirmed: <CheckCircle className="w-4 h-4 text-green-500" />,
  cancelled: <XCircle className="w-4 h-4 text-red-500" />,
};

const statusColor = {
  pending: "bg-yellow-100 text-yellow-700",
  confirmed: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

const Appointments = () => {
  const { currentUser, userRole } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/appointments", {
          headers: { Authorization: `Bearer ${currentUser?.token}` },
        });
        setAppointments(res.data);
      } catch (err) {
        toast.error("Failed to load appointments.");
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.put(
        `http://localhost:5000/api/appointments/${id}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${currentUser?.token}` } }
      );
      setAppointments((prev) =>
        prev.map((a) => (a._id === id ? { ...a, status: newStatus } : a))
      );
      toast.success(`Appointment ${newStatus}.`);
    } catch (err) {
      toast.error("Failed to update appointment.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Cancel this appointment?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/appointments/${id}`, {
        headers: { Authorization: `Bearer ${currentUser?.token}` },
      });
      setAppointments((prev) => prev.filter((a) => a._id !== id));
      toast.success("Appointment cancelled.");
    } catch (err) {
      toast.error("Failed to cancel appointment.");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <CalendarCheck className="w-6 h-6" /> Appointments
      </h2>

      {loading ? (
        <div className="text-center text-gray-400 mt-20 animate-pulse">Loading appointments...</div>
      ) : appointments.length === 0 ? (
        <div className="text-center mt-20 text-gray-500">
          <CalendarCheck className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>No appointments found.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {appointments.map((appt) => (
            <div key={appt._id} className="bg-white rounded-xl shadow p-5 hover:shadow-md transition">
              <div className="flex items-start justify-between flex-wrap gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-gray-700">
                    <CalendarCheck className="w-4 h-4 text-blue-500" />
                    <span className="font-medium">{new Date(appt.date).toLocaleDateString()}</span>
                    {appt.time && (
                      <>
                        <Clock className="w-4 h-4 text-blue-400" />
                        <span>{appt.time}</span>
                      </>
                    )}
                  </div>
                  {appt.user && (
                    <p className="text-sm text-gray-500">
                      By: <span className="font-medium">{appt.user.name}</span> ({appt.user.email})
                    </p>
                  )}
                  {appt.description && (
                    <p className="text-sm text-gray-600 italic">"{appt.description}"</p>
                  )}
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${statusColor[appt.status]}`}>
                    {statusIcon[appt.status]} {appt.status}
                  </span>
                  {(userRole === "admin" || userRole === "agent" || userRole === "landlord") && appt.status === "pending" && (
                    <>
                      <button onClick={() => handleStatusChange(appt._id, "confirmed")}
                        className="px-3 py-1 bg-green-600 text-white text-xs rounded-lg hover:bg-green-700 transition">
                        Confirm
                      </button>
                      <button onClick={() => handleStatusChange(appt._id, "cancelled")}
                        className="px-3 py-1 bg-red-500 text-white text-xs rounded-lg hover:bg-red-600 transition">
                        Cancel
                      </button>
                    </>
                  )}
                  <button onClick={() => handleDelete(appt._id)}
                    className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-lg hover:bg-gray-200 transition">
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Appointments;
