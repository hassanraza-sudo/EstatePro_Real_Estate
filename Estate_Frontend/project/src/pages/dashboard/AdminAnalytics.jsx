import React, { useEffect, useState } from "react";
import axios from "axios";
import { BarChart2, Building, Users, CalendarCheck, TrendingUp } from "lucide-react";

const StatCard = ({ icon, label, value, color }) => (
  <div className="bg-white rounded-2xl shadow p-6 flex items-center gap-4">
    <div className={`p-3 rounded-full ${color}`}>{icon}</div>
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
    </div>
  </div>
);

const AdminAnalytics = () => {
  const [stats, setStats] = useState({ users: 0, properties: 0, appointments: 0, featured: 0 });
  const [loading, setLoading] = useState(true);
  const [typeCounts, setTypeCounts] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, propsRes, appsRes] = await Promise.all([
          axios.get("http://localhost:5000/api/users", {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          }),
          axios.get("http://localhost:5000/api/properties"),
          axios.get("http://localhost:5000/api/appointments", {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          }).catch(() => ({ data: [] })),
        ]);

        const props = propsRes.data;
        const counts = {};
        props.forEach((p) => { counts[p.type] = (counts[p.type] || 0) + 1; });

        setStats({
          users: usersRes.data.length,
          properties: props.length,
          appointments: appsRes.data.length,
          featured: props.filter((p) => p.isFeatured).length,
        });
        setTypeCounts(counts);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading)
    return <div className="p-6 text-center text-gray-400 animate-pulse mt-20">Loading analytics...</div>;

  const maxCount = Math.max(...Object.values(typeCounts), 1);

  return (
    <div className="p-6 space-y-8">
      <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
        <BarChart2 className="w-6 h-6" /> Analytics Overview
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<Users className="w-6 h-6 text-blue-600" />} label="Total Users" value={stats.users} color="bg-blue-50" />
        <StatCard icon={<Building className="w-6 h-6 text-green-600" />} label="Properties" value={stats.properties} color="bg-green-50" />
        <StatCard icon={<CalendarCheck className="w-6 h-6 text-purple-600" />} label="Appointments" value={stats.appointments} color="bg-purple-50" />
        <StatCard icon={<TrendingUp className="w-6 h-6 text-yellow-600" />} label="Featured" value={stats.featured} color="bg-yellow-50" />
      </div>

      <div className="bg-white rounded-2xl shadow p-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-6">Properties by Type</h3>
        <div className="space-y-4">
          {Object.entries(typeCounts).map(([type, count]) => (
            <div key={type}>
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span className="capitalize font-medium">{type}</span>
                <span>{count}</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-3">
                <div
                  className="bg-blue-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${(count / maxCount) * 100}%` }}
                />
              </div>
            </div>
          ))}
          {Object.keys(typeCounts).length === 0 && (
            <p className="text-gray-400 text-sm">No property data available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
