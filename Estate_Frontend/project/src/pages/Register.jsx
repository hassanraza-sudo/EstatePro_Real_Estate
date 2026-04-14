import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Lock,
  UserPlus,
  Users,
  Eye,
  EyeOff,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext.jsx";
import toast from "react-hot-toast";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "buyer",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.password) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      await register(
        formData.name,
        formData.email,
        formData.password,
        formData.role
      );
      toast.success("Account created successfully!");
      navigate("/dashboard");
    } catch (error) {
      toast.error("Failed to create account");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-300 to-sky-200 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-slate-300 shadow-xl rounded-2xl p-8 sm:p-10">
        {/* Header */}
        <div className="flex flex-col items-center mb-6">
          <Users className="h-12 w-12 text-sky-950"/>
          <h2 className="mt-4 text-3xl font-serif font-extrabold text-gray-800 text-center">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-gray-600 text-center">
            Or{" "}
            <Link
              to="/login"
              className="text-blue-600 font-medium hover:underline"
            >
              sign in to your existing account
            </Link>
          </p>
        </div>

        {/* Form */}
        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* Full Name */}
          <div className="relative">
            <User className="absolute top-3.5 left-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              name="name"
              required
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-2 border bg-slate-100 border-gray-300 rounded-lg focus:ring-2  focus:ring-sky-300 focus:border-x-gray-500 transition"
            />
          </div>

          {/* Email */}
          <div className="relative">
            <Mail className="absolute top-3.5 left-3 h-5 w-5 text-gray-400" />
            <input
              type="email"
              name="email"
              required
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-2 border bg-slate-100 border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-300 focus:border-x-gray-500 transition"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <Lock className="absolute top-3.5 left-3 h-5 w-5 text-gray-400" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              required
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full pl-10 pr-10 py-2 border bg-slate-100 border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-300 focus:border-x-gray-500 transition"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-3.5 right-3 text-gray-400 hover:text-gray-600"
              aria-label="Toggle password visibility"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <Lock className="absolute top-3.5 left-3 h-5 w-5 text-gray-400" />
            <input
              type={showPassword ? "text" : "password"}
              name="confirmPassword"
              required
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-2 border bg-slate-100 border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-300 focus:border-x-gray-500 transition"
            />
          </div>

          {/* Role Selection */}
          <div>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full py-2 px-4 border bg-slate-100 border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-300 focus:border-x-gray-500 transition"
              required
            >
              <option value="buyer">Buyer / Tenant</option>
              <option value="landlord">Landlord</option>
              <option value="agent">Real Estate Agent</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {/* Terms Agreement */}
          <div className="flex items-center text-sm">
            <input
              id="terms"
              type="checkbox"
              required
              className="mr-2 bg-slate-100 border-gray-300 text-blue-600 focus:ring-blue-500 rounded"
            />
            <label htmlFor="terms" className="text-gray-700">
              I agree to the{" "}
              <a href="#" className="text-blue-600 hover:underline font-medium">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="text-blue-600 hover:underline font-medium">
                Privacy Policy
              </a>
            </label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center py-2 bg-sky-800 text-white rounded-lg hover:bg-sky-900 transition font-semibold disabled:opacity-50"
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 mr-2"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Creating Account...
              </>
            ) : (
              <>
                <UserPlus className="h-5 w-5 mr-2" />
                Create Account
              </>
            )}
          </button>
        </form>

        {/* Divider and Social */}
        <div className="mt-6 ">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className=" px-2 text-gray-600">
                Or continue with
              </span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 ">
            <button className="flex justify-center items-center text-white gap-2 py-2 border border-gray-300 rounded-xl bg-sky-700 hover:bg-sky-900 transition text-sm ">
              Google
            </button>
            <button className="flex justify-center items-center text-white gap-2 py-2 border border-gray-300 rounded-xl bg-sky-700 hover:bg-sky-900 transition text-sm">
              Facebook
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
