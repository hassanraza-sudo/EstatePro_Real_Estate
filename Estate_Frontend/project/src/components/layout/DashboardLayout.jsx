import React, { useState } from "react";
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import {
  Menu, Home, Building, User, BarChart2,
  MessageCircle, PlusCircle, Settings, LogOut,
  ChevronRight, CalendarCheck, Users
} from "lucide-react";
import { BiLogOutCircle } from "react-icons/bi";
import { MdOutlineRealEstateAgent } from "react-icons/md";
import { useAuth } from "../../contexts/AuthContext.jsx";

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { userRole, logout, currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const commonLinks = [
    { name: "Dashboard", icon: <Home size={20} />, path: "/dashboard" },
    { name: "Messages", icon: <MessageCircle size={20} />, path: "/dashboard/messages" },
    { name: "Profile", icon: <User size={20} />, path: "/dashboard/profile" },
    { name: "Settings", icon: <Settings size={20} />, path: "/dashboard/settings" },
  ];

  const roleLinks = {
    admin: [
      ...commonLinks,
      { name: "Users", icon: <Users size={20} />, path: "/dashboard/users" },
      { name: "All Properties", icon: <Building size={20} />, path: "/dashboard/properties" },
      { name: "Analytics", icon: <BarChart2 size={20} />, path: "/dashboard/analytics" },
      { name: "Add Property", icon: <PlusCircle size={20} />, path: "/dashboard/add-property" },
    ],
    agent: [
      ...commonLinks,
      { name: "My Listings", icon: <Building size={20} />, path: "/dashboard/my-listings" },
      { name: "Appointments", icon: <CalendarCheck size={20} />, path: "/dashboard/appointments" },
      { name: "Add Property", icon: <PlusCircle size={20} />, path: "/dashboard/add-property" },
    ],
    landlord: [
      ...commonLinks,
      { name: "My Properties", icon: <Building size={20} />, path: "/dashboard/my-properties" },
      { name: "Add Property", icon: <PlusCircle size={20} />, path: "/dashboard/add-property" },
    ],
    buyer: [
      ...commonLinks,
      { name: "Appointments", icon: <CalendarCheck size={20} />, path: "/dashboard/appointments" },
    ],
    tenant: [
      ...commonLinks,
      { name: "Appointments", icon: <CalendarCheck size={20} />, path: "/dashboard/appointments" },
    ],
  };

  const sidebarLinks = roleLinks[userRole] || commonLinks;

  const SidebarContent = () => (
    <>
      <div className="flex items-center px-4 py-5 border-b border-slate-500">
        <MdOutlineRealEstateAgent className="h-7 w-7 text-gray-100" />
        <span className="ml-2 text-xl font-serif font-semibold text-gray-100">EstatePro</span>
      </div>
      <div className="flex items-center space-x-3 px-4 py-4 border-b border-slate-500">
        <div className="h-11 w-11 bg-zinc-300 rounded-full text-gray-700 flex items-center justify-center font-bold text-lg shrink-0">
          {currentUser?.name?.charAt(0) || "U"}
        </div>
        <div className="overflow-hidden">
          <div className="text-sm font-semibold text-gray-100 truncate">{currentUser?.name || "User"}</div>
          <div className="text-xs text-gray-300 capitalize">{userRole || "User"}</div>
        </div>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {sidebarLinks.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            onClick={() => setSidebarOpen(false)}
            className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition ${
              location.pathname === link.path
                ? "bg-gray-700 text-white"
                : "text-gray-300 hover:bg-gray-700 hover:text-white"
            }`}
          >
            {link.icon}
            <span className="ml-3">{link.name}</span>
            {location.pathname === link.path && (
              <ChevronRight className="ml-auto h-4 w-4 text-sky-300" />
            )}
          </Link>
        ))}
      </nav>
      <div className="px-4 py-4 border-t border-slate-500">
        <button onClick={handleLogout} className="flex items-center text-sm text-gray-300 hover:text-white transition">
          <BiLogOutCircle className="h-5 w-5 mr-2" /> Logout
        </button>
      </div>
    </>
  );

  return (
    <div className="h-screen flex overflow-hidden bg-gray-50">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 z-40" onClick={() => setSidebarOpen(false)}>
          <div className="absolute inset-0 bg-black bg-opacity-50" />
          <div className="relative flex flex-col w-64 h-full bg-slate-700 shadow-xl">
            <SidebarContent />
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col bg-slate-700 shadow-sm">
        <SidebarContent />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile top bar */}
        <div className="md:hidden flex items-center justify-between p-4 bg-white border-b shadow-sm">
          <button onClick={() => setSidebarOpen(true)}>
            <Menu className="h-6 w-6 text-gray-700" />
          </button>
          <div className="flex items-center gap-2">
            <MdOutlineRealEstateAgent className="h-6 w-6 text-blue-600" />
            <span className="text-lg font-semibold text-gray-800">EstatePro</span>
          </div>
        </div>

        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
