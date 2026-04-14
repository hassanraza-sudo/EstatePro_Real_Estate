import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";

const Settings = () => {
  const { currentUser, userRole, logout } = useAuth();
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState({
    emailUpdates: true,
    pushNotifications: false,
  });

  const [deleting, setDeleting] = useState(false);

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to permanently delete your account? This cannot be undone."
    );
    if (!confirmed) return;

    setDeleting(true);
    try {
      await axios.delete(`http://localhost:5000/api/users/${currentUser._id}`, {
        headers: { Authorization: `Bearer ${currentUser?.token}` },
      });
      toast.success("Account deleted.");
      logout();
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete account.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Account Settings</h1>

      {/* Profile Info (read-only) */}
      <div className="bg-white shadow-md rounded-xl p-6 mb-6 border">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Profile Information</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Full Name</label>
            <input type="text" value={currentUser?.name || ""} disabled
              className="w-full px-4 py-2 border rounded-md bg-gray-100 text-gray-700" />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Email Address</label>
            <input type="email" value={currentUser?.email || ""} disabled
              className="w-full px-4 py-2 border rounded-md bg-gray-100 text-gray-700" />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Role</label>
            <input type="text" value={userRole || "User"} disabled
              className="w-full px-4 py-2 border rounded-md bg-gray-100 text-gray-700 capitalize" />
          </div>
        </div>
      </div>

      {/* Security */}
      <div className="bg-white shadow-md rounded-xl p-6 mb-6 border">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Security</h2>
        <p className="text-sm text-gray-500 mb-3">Update your password from the Profile page.</p>
        <button
          onClick={() => navigate("/dashboard/profile")}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          Go to Profile → Change Password
        </button>
      </div>

      {/* Notifications */}
      <div className="bg-white shadow-md rounded-xl p-6 mb-6 border">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Notifications</h2>
        <div className="space-y-4">
          <label className="flex items-center space-x-3 cursor-pointer">
            <input type="checkbox" checked={notifications.emailUpdates}
              onChange={(e) => setNotifications((p) => ({ ...p, emailUpdates: e.target.checked }))}
              className="form-checkbox h-5 w-5 text-blue-600" />
            <span className="text-gray-700">Email me about property updates</span>
          </label>
          <label className="flex items-center space-x-3 cursor-pointer">
            <input type="checkbox" checked={notifications.pushNotifications}
              onChange={(e) => setNotifications((p) => ({ ...p, pushNotifications: e.target.checked }))}
              className="form-checkbox h-5 w-5 text-blue-600" />
            <span className="text-gray-700">Send push notifications</span>
          </label>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-white shadow-md rounded-xl p-6 border border-red-200">
        <h2 className="text-xl font-semibold text-red-600 mb-2">Danger Zone</h2>
        <p className="text-sm text-gray-600 mb-4">
          Once you delete your account, there is no going back. All your data will be permanently removed.
        </p>
        <button
          onClick={handleDeleteAccount}
          disabled={deleting}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition disabled:opacity-60"
        >
          {deleting ? "Deleting..." : "Delete My Account"}
        </button>
      </div>
    </div>
  );
};

export default Settings;
