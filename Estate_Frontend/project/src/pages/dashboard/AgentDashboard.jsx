import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Home, MessageCircle, CalendarClock, PlusCircle, Eye, Trash2, CheckCircle, XCircle, Clock } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import toast from "react-hot-toast";

const AgentDashboard = () => {
  const { currentUser } = useAuth();
  const [properties, setProperties] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const headers = { Authorization: `Bearer ${currentUser?.token}` };

  useEffect(() => {
    const load = async () => {
      try {
        const [propsRes, appsRes] = await Promise.all([
          axios.get("http://localhost:5000/api/properties/my", { headers }),
          axios.get("http://localhost:5000/api/appointments", { headers }),
        ]);
        setProperties(propsRes.data);
        setAppointments(appsRes.data);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    load();
  }, []);

  const handleDeleteProp = async (id) => {
    if (!window.confirm("Delete property?")) return;
    await axios.delete(`http://localhost:5000/api/properties/${id}`, { headers });
    setProperties(prev => prev.filter(p => p._id !== id));
    toast.success("Property deleted");
  };

  const handleApptStatus = async (id, status) => {
    await axios.put(`http://localhost:5000/api/appointments/${id}`, { status }, { headers });
    setAppointments(prev => prev.map(a => a._id === id ? { ...a, status } : a));
    toast.success(`Appointment ${status}`);
  };

  const pending = appointments.filter(a => a.status === "pending");

  if (loading) return <div className="text-center text-gray-400 animate-pulse mt-20">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Agent Dashboard</h1>
        <Link to="/dashboard/add-property" className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm font-medium">
          <PlusCircle className="w-4 h-4" /> Add Listing
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "My Listings", value: properties.length, icon: <Home className="w-6 h-6 text-blue-600" />, color: "bg-blue-50" },
          { label: "Total Appointments", value: appointments.length, icon: <CalendarClock className="w-6 h-6 text-purple-600" />, color: "bg-purple-50" },
          { label: "Pending Requests", value: pending.length, icon: <Clock className="w-6 h-6 text-yellow-600" />, color: "bg-yellow-50" },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-2xl shadow p-5 flex items-center gap-4">
            <div className={`p-3 rounded-xl ${s.color}`}>{s.icon}</div>
            <div><p className="text-sm text-gray-500">{s.label}</p><p className="text-2xl font-bold text-gray-800">{s.value}</p></div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* My Listings */}
        <div className="bg-white rounded-2xl shadow p-5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-gray-700">My Listings</h3>
            <Link to="/dashboard/my-listings" className="text-xs text-blue-600 hover:underline">View all</Link>
          </div>
          {properties.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <Home className="w-10 h-10 mx-auto mb-2 text-gray-200" />
              <p className="text-sm">No listings yet</p>
              <Link to="/dashboard/add-property" className="text-blue-500 text-xs hover:underline">+ Add your first property</Link>
            </div>
          ) : (
            <div className="space-y-3">
              {properties.slice(0, 4).map(p => (
                <div key={p._id} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div>
                    <p className="text-sm font-medium text-gray-800 truncate max-w-[180px]">{p.title}</p>
                    <p className="text-xs text-gray-400">{p.city} · Rs.{p.price?.toLocaleString()}</p>
                  </div>
                  <div className="flex gap-2">
                    <Link to={`/properties/${p._id}`}><Eye className="w-4 h-4 text-blue-500 hover:text-blue-700" /></Link>
                    <button onClick={() => handleDeleteProp(p._id)}><Trash2 className="w-4 h-4 text-red-400 hover:text-red-600" /></button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pending Appointments */}
        <div className="bg-white rounded-2xl shadow p-5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-gray-700">Pending Appointments</h3>
            <Link to="/dashboard/appointments" className="text-xs text-blue-600 hover:underline">View all</Link>
          </div>
          {pending.length === 0 ? (
            <div className="text-center py-8 text-gray-400 text-sm">No pending appointments</div>
          ) : (
            <div className="space-y-3">
              {pending.slice(0, 4).map(a => (
                <div key={a._id} className="p-3 border rounded-xl bg-yellow-50">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-gray-800">{a.user?.name || "Unknown"}</p>
                      <p className="text-xs text-gray-500">{new Date(a.date).toLocaleDateString()} {a.time && `at ${a.time}`}</p>
                      {a.description && <p className="text-xs text-gray-500 italic mt-1">"{a.description}"</p>}
                    </div>
                    <div className="flex gap-1">
                      <button onClick={() => handleApptStatus(a._id, "confirmed")} title="Confirm" className="p-1 bg-green-100 text-green-600 rounded hover:bg-green-200">
                        <CheckCircle className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleApptStatus(a._id, "cancelled")} title="Cancel" className="p-1 bg-red-100 text-red-500 rounded hover:bg-red-200">
                        <XCircle className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Add Property", icon: <PlusCircle className="w-6 h-6 text-blue-600" />, to: "/dashboard/add-property", color: "bg-blue-50 hover:bg-blue-100" },
          { label: "Messages", icon: <MessageCircle className="w-6 h-6 text-green-600" />, to: "/dashboard/messages", color: "bg-green-50 hover:bg-green-100" },
          { label: "All Appointments", icon: <CalendarClock className="w-6 h-6 text-purple-600" />, to: "/dashboard/appointments", color: "bg-purple-50 hover:bg-purple-100" },
        ].map((a, i) => (
          <Link key={i} to={a.to} className={`${a.color} rounded-2xl p-5 flex items-center gap-4 transition`}>
            {a.icon}
            <span className="font-medium text-gray-700">{a.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AgentDashboard;
