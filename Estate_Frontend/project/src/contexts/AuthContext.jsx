import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("realEstateUser");
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setCurrentUser(user);
        setUserRole(user.role);
        setIsAuthenticated(true);
      } catch (e) {
        localStorage.removeItem("realEstateUser");
        localStorage.removeItem("token");
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const res = await fetch("http://localhost:5000/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Login failed. Please try again.");
    }

    if (data && data.token && data.user) {
      const userWithToken = { ...data.user, token: data.token };
      localStorage.setItem("realEstateUser", JSON.stringify(userWithToken));
      localStorage.setItem("token", data.token);
      setCurrentUser(userWithToken);
      setUserRole(data.user.role);
      setIsAuthenticated(true);
      return userWithToken;
    } else {
      throw new Error("Invalid response from server");
    }
  };

  const register = async (name, email, password, role) => {
    // Uses authRoutes /api/register which returns { token, user }
    const res = await fetch("http://localhost:5000/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, role }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Registration failed.");
    }

    if (data && data.token && data.user) {
      const userWithToken = { ...data.user, token: data.token };
      localStorage.setItem("realEstateUser", JSON.stringify(userWithToken));
      localStorage.setItem("token", data.token);
      setCurrentUser(userWithToken);
      setUserRole(data.user.role);
      setIsAuthenticated(true);
      return userWithToken;
    } else {
      throw new Error("Invalid response from server");
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setUserRole(null);
    setIsAuthenticated(false);
    localStorage.removeItem("realEstateUser");
    localStorage.removeItem("token");
  };

  const value = { currentUser, userRole, isAuthenticated, login, register, logout, loading };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
