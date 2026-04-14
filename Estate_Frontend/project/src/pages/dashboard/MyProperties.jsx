import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Link } from "react-router-dom";
import axios from "axios";
import { Building, MapPin, Trash2, Eye, PlusCircle } from "lucide-react";
import toast from "react-hot-toast";

const MyProperties = () => {
  const { currentUser } = useAuth();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMyProperties = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/properties/my", {
        headers: { Authorization: `Bearer ${currentUser?.token}` },
      });
      setProperties(res.data);
    } catch (error) {
      toast.error("Failed to load your properties.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMyProperties(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this property?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/properties/${id}`, {
        headers: { Authorization: `Bearer ${currentUser?.token}` },
      });
      setProperties((prev) => prev.filter((p) => p._id !== id));
      toast.success("Property deleted.");
    } catch (error) {
      toast.error("Failed to delete property.");
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Building className="w-6 h-6" /> My Listed Properties
        </h2>
        <Link
          to="/dashboard/add-property"
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm font-medium"
        >
          <PlusCircle className="w-4 h-4" /> Add Property
        </Link>
      </div>

      {loading ? (
        <div className="text-center text-gray-400 mt-20 animate-pulse">Loading your properties...</div>
      ) : properties.length === 0 ? (
        <div className="text-center mt-20 space-y-3">
          <Building className="w-14 h-14 mx-auto text-gray-300" />
          <p className="text-gray-500">You haven't listed any properties yet.</p>
          <Link to="/dashboard/add-property" className="text-blue-600 hover:underline text-sm">
            + Add your first property
          </Link>
        </div>
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
                  <h3 className="text-lg font-semibold text-gray-900 truncate">{prop.title}</h3>
                  <div className="flex items-center text-gray-500 text-sm mt-1 gap-1">
                    <MapPin className="w-3 h-3" />
                    <span>{prop.city}</span>
                    <span className="mx-2">·</span>
                    <span className="font-medium text-blue-600">Rs. {prop.price?.toLocaleString()}</span>
                  </div>
                  <span className="text-xs capitalize bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full mt-1 inline-block">{prop.type}</span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Link to={`/properties/${prop._id}`} title="View property"
                    className="text-blue-500 hover:text-blue-700 transition">
                    <Eye className="w-5 h-5" />
                  </Link>
                  <button onClick={() => handleDelete(prop._id)} title="Delete property"
                    className="text-red-500 hover:text-red-700 transition">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyProperties;
