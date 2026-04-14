import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { BarChart2, Users, Building2, CalendarCheck, TrendingUp, PlusCircle, Trash2, ChevronRight } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

const StatCard = ({ label, value, icon, color, to }) => (
  <Link to={to} className={`bg-white rounded-2xl shadow p-5 flex items-center gap-4 hover:shadow-md transition group`}>
    <div className={`p-3 rounded-xl ${color}`}>{icon}</div>
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
    </div>
    <ChevronRight className="ml-auto text-gray-300 group-hover:text-blue-500 transition" />
  </Link>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState({ users: 0, properties: 0, appointments: 0, featured: 0 });
  const [recentUsers, setRecentUsers] = useState([]);
  const [recentProps, setRecentProps] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    const load = async () => {
      try {
        const [usersRes, propsRes, appsRes] = await Promise.all([
          axios.get("http://localhost:5000/api/users", { headers }),
          axios.get("http://localhost:5000/api/properties"),
          axios.get("http://localhost:5000/api/appointments", { headers }).catch(() => ({ data: [] })),
        ]);
        const users = usersRes.data;
        const props = propsRes.data;
        const apps = appsRes.data;
        setStats({ users: users.length, properties: props.length, appointments: apps.length, featured: props.filter(p => p.isFeatured).length });
        setRecentUsers(users.slice(0, 5));
        setRecentProps(props.slice(0, 5));

        const typeCounts = {};
        props.forEach(p => { typeCounts[p.type] = (typeCounts[p.type] || 0) + 1; });
        setChartData(Object.entries(typeCounts).map(([name, count]) => ({ name, count })));
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    load();
  }, []);

  const handleDeleteProperty = async (id) => {
    if (!window.confirm("Delete this property?")) return;
    await axios.delete(`http://localhost:5000/api/properties/${id}`, { headers });
    setRecentProps(prev => prev.filter(p => p._id !== id));
    setStats(s => ({ ...s, properties: s.properties - 1 }));
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    await axios.delete(`http://localhost:5000/api/users/${id}`, { headers });
    setRecentUsers(prev => prev.filter(u => u._id !== id));
    setStats(s => ({ ...s, users: s.users - 1 }));
  };

  if (loading) return <div className="flex items-center justify-center h-64 text-gray-400 animate-pulse">Loading dashboard...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
        <Link to="/dashboard/add-property" className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm font-medium">
          <PlusCircle className="w-4 h-4" /> Add Property
        </Link>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Users" value={stats.users} icon={<Users className="w-6 h-6 text-blue-600" />} color="bg-blue-50" to="/dashboard/users" />
        <StatCard label="Properties" value={stats.properties} icon={<Building2 className="w-6 h-6 text-green-600" />} color="bg-green-50" to="/dashboard/properties" />
        <StatCard label="Appointments" value={stats.appointments} icon={<CalendarCheck className="w-6 h-6 text-purple-600" />} color="bg-purple-50" to="/dashboard/appointments" />
        <StatCard label="Featured" value={stats.featured} icon={<TrendingUp className="w-6 h-6 text-yellow-600" />} color="bg-yellow-50" to="/dashboard/properties" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart */}
        <div className="bg-white rounded-2xl shadow p-5">
          <h3 className="font-semibold text-gray-700 mb-4">Properties by Type</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Users */}
        <div className="bg-white rounded-2xl shadow p-5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-gray-700">Recent Users</h3>
            <Link to="/dashboard/users" className="text-xs text-blue-600 hover:underline">View all</Link>
          </div>
          <div className="space-y-3">
            {recentUsers.map(u => (
              <div key={u._id} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-sm font-bold">{u.name.charAt(0)}</div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">{u.name}</p>
                    <p className="text-xs text-gray-400 capitalize">{u.role}</p>
                  </div>
                </div>
                <button onClick={() => handleDeleteUser(u._id)} className="text-red-400 hover:text-red-600 transition">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Properties */}
      <div className="bg-white rounded-2xl shadow p-5">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-gray-700">Recent Properties</h3>
          <Link to="/dashboard/properties" className="text-xs text-blue-600 hover:underline">View all</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-gray-400 text-xs uppercase border-b">
                <th className="pb-2 text-left">Property</th>
                <th className="pb-2 text-left">City</th>
                <th className="pb-2 text-left">Type</th>
                <th className="pb-2 text-left">Price</th>
                <th className="pb-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {recentProps.map(p => (
                <tr key={p._id} className="hover:bg-gray-50 transition">
                  <td className="py-2 font-medium text-gray-800 max-w-xs truncate">{p.title}</td>
                  <td className="py-2 text-gray-500">{p.city}</td>
                  <td className="py-2"><span className="capitalize bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-xs">{p.type}</span></td>
                  <td className="py-2 text-blue-600 font-medium">Rs.{p.price?.toLocaleString()}</td>
                  <td className="py-2">
                    <div className="flex gap-2">
                      <Link to={`/properties/${p._id}`} className="text-blue-500 hover:underline text-xs">View</Link>
                      <button onClick={() => handleDeleteProperty(p._id)} className="text-red-400 hover:text-red-600 text-xs">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
