import React from "react";
import { useNavigate } from "react-router-dom";
import { Heart, Bell, CalendarClock } from "lucide-react";

function BuyerDashboard() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-white py-10 px-5 sm:px-8 lg:px-16">
      <h1 className="text-4xl font-extrabold text-gray-900 text-center mb-20">
        Buyer Dashboard
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Saved Properties */}
        <div
          onClick={() => navigate("/buyer/saved-properties")}
          className="cursor-pointer rounded-2xl shadow-md hover:shadow-xl transition bg-zinc-300 p-6"
        >
          <div className="w-14 h-14 flex items-center justify-center rounded-full bg-blue-50 mb-4">
            <Heart className="h-8 w-8 text-blue-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Saved Properties
          </h2>
          <p className="text-gray-600 text-sm">
            View and manage your favorited listings.
          </p>
        </div>

        {/* Property Alerts */}
        <div
          onClick={() => navigate("/buyer/property-alerts")}
          className="cursor-pointer rounded-2xl shadow-md hover:shadow-xl transition bg-zinc-300 p-6"
        >
          <div className="w-14 h-14 flex items-center justify-center rounded-full bg-green-50 mb-4">
            <Bell className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Property Alerts
          </h2>
          <p className="text-gray-600 text-sm">
            Customize notifications for new listings.
          </p>
        </div>

        {/* Viewing Schedule */}
        <div
          onClick={() => navigate("/buyer/viewing-schedule")}
          className="cursor-pointer rounded-2xl shadow-md hover:shadow-xl transition bg-zinc-300 p-6"
        >
          <div className="w-14 h-14 flex items-center justify-center rounded-full bg-purple-50 mb-4">
            <CalendarClock className="h-8 w-8 text-purple-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Viewing Schedule
          </h2>
          <p className="text-gray-600 text-sm">
            Track upcoming property viewings and meetings.
          </p>
        </div>
      </div>
    </div>
  );
}

export default BuyerDashboard;
