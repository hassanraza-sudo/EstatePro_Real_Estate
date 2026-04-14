import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Mail, User, CalendarDays, BadgeCheck, Lock } from "lucide-react";
import toast from "react-hot-toast";

const Profile = () => {
  const { currentUser } = useAuth();

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [updating, setUpdating] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();

    const { currentPassword, newPassword, confirmPassword } = passwordForm;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return toast.error("Please fill in all fields");
    }

    if (newPassword !== confirmPassword) {
      return toast.error("New passwords do not match");
    }

    if (newPassword.length < 6) {
      return toast.error("Password must be at least 6 characters");
    }

    try {
      setUpdating(true);
      const res = await fetch(
        "http://localhost:5000/api/users/change-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${currentUser?.token}`,
          },
          body: JSON.stringify({
            email: currentUser.email,
            currentPassword,
            newPassword,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to change password");
      }

      toast.success("Password updated successfully");
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setUpdating(false);
    }
  };

  if (!currentUser) {
    return (
      <div className="p-6 max-w-3xl mx-auto">
        <h2 className="text-xl text-red-600">No user data available.</h2>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-10">
      <h2 className="text-3xl font-bold text-gray-800">👤 My Profile</h2>

      {/* User Info */}
      <div className="bg-white shadow-md rounded-2xl p-6 space-y-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-2xl font-bold">
            {currentUser.name.charAt(0)}
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-800">
              {currentUser.name}
            </h3>
            <p className="text-sm text-gray-500 capitalize">
              {currentUser.role}
            </p>
          </div>
        </div>

        <div className="space-y-3 text-gray-700">
          <div className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-gray-500" />
            <span>{currentUser.email}</span>
          </div>
          <div className="flex items-center gap-2">
            <BadgeCheck className="w-5 h-5 text-gray-500" />
            <span>Role: {currentUser.role}</span>
          </div>
          <div className="flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-gray-500" />
            <span>
              Joined:{" "}
              {currentUser.createdAt
                ? new Date(currentUser.createdAt).toLocaleDateString()
                : "N/A"}
            </span>
          </div>
        </div>
      </div>

      {/* Change Password */}
      <div className="bg-white shadow-md rounded-2xl p-6">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">
          Change Password
        </h3>

        <form onSubmit={handlePasswordUpdate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Current Password
            </label>
            <input
              type="password"
              name="currentPassword"
              className="input w-full"
              value={passwordForm.currentPassword}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New Password
            </label>
            <input
              type="password"
              name="newPassword"
              className="input w-full"
              value={passwordForm.newPassword}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm New Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              className="input w-full"
              value={passwordForm.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            disabled={updating}
            className="btn btn-primary w-full mt-4"
          >
            {updating ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
