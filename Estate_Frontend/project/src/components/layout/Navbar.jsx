import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Bell, CheckCheck, Trash2 } from "lucide-react";
import { MdOutlineRealEstateAgent } from "react-icons/md";
import { useAuth } from "../../contexts/AuthContext.jsx";
import { useSocket } from "../../contexts/SocketContext.jsx";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const { isAuthenticated, logout, currentUser } = useAuth();
  const { notifications, unreadCount, markAllRead, removeNotification } = useSocket();
  const location = useLocation();
  const navigate = useNavigate();
  const notifRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClick = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotif(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleLogout = () => { logout(); navigate("/"); };

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/properties", label: "Properties" },
    { path: "/mortgage-calculator", label: "Calculator" },
    { path: "/about", label: "About" },
    { path: "/contact", label: "Contact" },
  ];

  const textColor = isScrolled ? "text-gray-700" : "text-white";
  const hoverColor = isScrolled ? "hover:text-blue-600" : "hover:text-blue-200";

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? "bg-white shadow-md" : "bg-slate-800"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <MdOutlineRealEstateAgent className={`h-7 w-7 ${isScrolled ? "text-blue-600" : "text-white"} group-hover:scale-110 transition-transform`} />
            <span className={`text-xl font-serif font-extrabold ${isScrolled ? "text-gray-800" : "text-white"}`}>EstatePro</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map(({ path, label }) => (
              <Link key={path} to={path}
                className={`px-3 py-2 rounded-md text-sm font-medium transition ${textColor} ${hoverColor} ${location.pathname === path ? "font-semibold underline underline-offset-4" : ""}`}>
                {label}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                {/* Notification Bell */}
                <div className="relative" ref={notifRef}>
                  <button onClick={() => { setShowNotif(!showNotif); if (!showNotif) markAllRead(); }}
                    className={`relative p-2 rounded-full transition ${isScrolled ? "hover:bg-gray-100 text-gray-700" : "hover:bg-white/20 text-white"}`}>
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                        {unreadCount > 9 ? "9+" : unreadCount}
                      </span>
                    )}
                  </button>

                  {showNotif && (
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border overflow-hidden z-50">
                      <div className="flex items-center justify-between px-4 py-3 border-b">
                        <h3 className="font-semibold text-gray-800">Notifications</h3>
                        <button onClick={markAllRead} className="text-xs text-blue-600 hover:underline flex items-center gap-1">
                          <CheckCheck className="w-3 h-3" /> Mark all read
                        </button>
                      </div>
                      <div className="max-h-80 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <p className="text-center text-gray-400 text-sm py-8">No notifications</p>
                        ) : (
                          notifications.slice(0, 15).map((n) => (
                            <div key={n._id}
                              className={`flex items-start gap-3 px-4 py-3 border-b hover:bg-gray-50 transition ${!n.read ? "bg-blue-50" : ""}`}>
                              <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${n.type === "message" ? "bg-blue-500" : n.type === "appointment" ? "bg-green-500" : "bg-gray-400"}`} />
                              <div className="flex-1 min-w-0 cursor-pointer" onClick={() => { navigate(n.link || "/dashboard"); setShowNotif(false); }}>
                                <p className="text-sm font-medium text-gray-800 truncate">{n.title}</p>
                                <p className="text-xs text-gray-500 truncate">{n.body}</p>
                                <p className="text-xs text-gray-400 mt-0.5">{new Date(n.createdAt).toLocaleString()}</p>
                              </div>
                              <button onClick={() => removeNotification(n._id)} className="text-gray-300 hover:text-red-500 transition shrink-0">
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ))
                        )}
                      </div>
                      <div className="px-4 py-2 border-t text-center">
                        <Link to="/dashboard/messages" onClick={() => setShowNotif(false)} className="text-xs text-blue-600 hover:underline">View all messages</Link>
                      </div>
                    </div>
                  )}
                </div>

                {/* User avatar + Dashboard */}
                <Link to="/dashboard" className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition ${isScrolled ? "hover:bg-gray-100" : "hover:bg-white/20"}`}>
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">
                    {currentUser?.name?.charAt(0)}
                  </div>
                  <span className={`text-sm font-medium ${textColor}`}>Dashboard</span>
                </Link>
                <button onClick={handleLogout} className={`text-sm font-medium px-3 py-1.5 rounded-lg transition ${isScrolled ? "text-red-600 hover:bg-red-50" : "text-white hover:bg-white/20"}`}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className={`text-sm font-medium px-3 py-1.5 rounded-lg transition ${textColor} ${hoverColor}`}>Sign In</Link>
                <Link to="/register" className="text-sm font-semibold px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">Get Started</Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className={`md:hidden p-2 rounded-md ${textColor}`}>
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t shadow-lg">
          <div className="px-4 py-3 space-y-2">
            {navLinks.map(({ path, label }) => (
              <Link key={path} to={path} onClick={() => setIsMenuOpen(false)}
                className="block px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg">
                {label}
              </Link>
            ))}
            <hr />
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg">Dashboard</Link>
                <button onClick={() => { handleLogout(); setIsMenuOpen(false); }} className="block w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg">Sign In</Link>
                <Link to="/register" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg text-center">Get Started</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
