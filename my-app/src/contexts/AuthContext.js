import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

import "./Auth.css";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    const raw = localStorage.getItem("ocms_current_user");
    return raw ? JSON.parse(raw) : null;
  });

  useEffect(() => {
    // keep in localStorage
    if (currentUser) localStorage.setItem("ocms_current_user", JSON.stringify(currentUser));
    else localStorage.removeItem("ocms_current_user");
  }, [currentUser]);

  const login = async (email, password) => {
    const user = await api.call("post", "/auth/login", { email, password });
    setCurrentUser(user);
    return user;
  };

  const register = async (email, password, fullName, role = "student") => {
    const user = await api.call("post", "/auth/register", { email, password, fullName, role });
    setCurrentUser(user);
    return user;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
