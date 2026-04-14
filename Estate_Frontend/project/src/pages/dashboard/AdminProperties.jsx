import React, { useEffect, useState } from "react";
import axios from "axios";
import { Trash2, Building, MapPin, Tag } from "lucide-react";
import toast from "react-hot-toast";

const AdminProperties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProperties = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/properties");
      setProperties(res.data);
    } catch (err) {
      toast.error("Failed to load properties.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProperties(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this property?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/properties/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setProperties((prev) => prev.filter((p) => p._id !== id));
      toast.success("Property deleted.");
    } catch (err) {
      toast.error("Failed to delete property.");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <Building className="w-6 h-6" /> All Properties
      </h2>
      {loading ? (
        <div className="text-center text-gray-400 mt-20 animate-pulse">Loading properties...</div>
      ) : properties.length === 0 ? (
        <p className="text-gray-500">No properties found.</p>
      ) : (
        <div className="grid gap-4">
          {properties.map((prop) => {
            const img = prop.images?.[0]
              ? prop.images[0].startsWith("http") ? prop.images[0] : `http://localhost:5000${prop.images[0]}`
              : "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=400";
            return (
              <div key={prop._id} className="bg-white rounded-xl shadow p-4 flex items-center gap-4 hover:shadow-md transition">
                <img src={img} alt={prop.title} className="w-20 h-16 object-cover rounded-lg shrink-0" />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 truncate">{prop.title}</h3>
                  <div className="flex items-center gap-3 text-sm text-gray-500 mt-1 flex-wrap">
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{prop.city}</span>
                    <span className="flex items-center gap-1"><Tag className="w-3 h-3 capitalize" />{prop.type}</span>
                    <span className="font-medium text-blue-600">Rs. {prop.price?.toLocaleString()}</span>
                  </div>
                  {prop.user && (
                    <p className="text-xs text-gray-400 mt-1">By: {prop.user.name} ({prop.user.email})</p>
                  )}
                </div>
                <button onClick={() => handleDelete(prop._id)}
                  className="text-red-500 hover:text-red-700 transition shrink-0" title="Delete property">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AdminProperties;
