import React from "react";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useAuth } from "./contexts/AuthContext.jsx";

import Layout from "./components/layout/Layout.jsx";
import DashboardLayout from "./components/layout/DashboardLayout.jsx";

import Home from "./pages/Home.jsx";
import PropertyListings from "./pages/PropertyListings.jsx";
import PropertyDetails from "./pages/PropertyDetails.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import About from "./pages/About.jsx";
import Contact from "./pages/Contact.jsx";
import MortgageCalculator from "./pages/MortgageCalculator.jsx";
import PrivacyPolicy from "./pages/PrivacyPolicy.jsx";
import TermsOfService from "./pages/TermsOfServices.jsx";
import SiteMap from "./pages/SiteMap.jsx";
import NotFound from "./pages/NotFound.jsx";

import AdminDashboard from "./pages/dashboard/AdminDashboard.jsx";
import AgentDashboard from "./pages/dashboard/AgentDashboard.jsx";
import LandlordDashboard from "./pages/dashboard/LandlordDashboard.jsx";
import BuyerDashboard from "./pages/dashboard/BuyerDashboard.jsx";
import AddProperty from "./pages/dashboard/AddProperty.jsx";
import MyProperties from "./pages/dashboard/MyProperties.jsx";
import Message from "./pages/dashboard/Message.jsx";
import Profile from "./pages/dashboard/Profile.jsx";
import Settings from "./pages/dashboard/Settings.jsx";
import AdminUsers from "./pages/dashboard/AdminUsers.jsx";
import AdminProperties from "./pages/dashboard/AdminProperties.jsx";
import AdminAnalytics from "./pages/dashboard/AdminAnalytics.jsx";
import Appointments from "./pages/dashboard/Appointments.jsx";

import ProtectedRoute from "./components/auth/ProtectedRoute.jsx";

function App() {
  const { isAuthenticated, userRole } = useAuth();

  return (
    <>
      <Toaster position="top-right" />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="properties" element={<PropertyListings />} />
          <Route path="properties/:id" element={<PropertyDetails />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="mortgage-calculator" element={<MortgageCalculator />} />
          <Route path="privacy-policy" element={<PrivacyPolicy />} />
          <Route path="terms-of-service" element={<TermsOfService />} />
          <Route path="sitemap" element={<SiteMap />} />
        </Route>

        {/* Dashboard Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route
            index
            element={
              userRole === "admin" ? (
                <AdminDashboard />
              ) : userRole === "agent" ? (
                <AgentDashboard />
              ) : userRole === "landlord" ? (
                <LandlordDashboard />
              ) : (
                <BuyerDashboard />
              )
            }
          />

          {/* Shared routes */}
          <Route path="messages" element={<Message />} />
          <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<Settings />} />
          <Route path="appointments" element={<Appointments />} />

          {/* Property management */}
          <Route
            path="add-property"
            element={
              <ProtectedRoute allowedRoles={["admin", "agent", "landlord"]}>
                <AddProperty />
              </ProtectedRoute>
            }
          />
          <Route
            path="my-properties"
            element={
              <ProtectedRoute allowedRoles={["landlord", "agent", "admin"]}>
                <MyProperties />
              </ProtectedRoute>
            }
          />
          {/* Agent alias */}
          <Route
            path="my-listings"
            element={
              <ProtectedRoute allowedRoles={["agent", "admin"]}>
                <MyProperties />
              </ProtectedRoute>
            }
          />

          {/* Admin-only routes */}
          <Route
            path="users"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminUsers />
              </ProtectedRoute>
            }
          />
          <Route
            path="properties"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminProperties />
              </ProtectedRoute>
            }
          />
          <Route
            path="analytics"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminAnalytics />
              </ProtectedRoute>
            }
          />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
