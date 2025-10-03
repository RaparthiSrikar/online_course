import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "./Navbar.css";

function Navbar() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div>
          <Link to="/dashboard" className="navbar-brand">
            LearnHub
          </Link>
        </div>

        <div className="navbar-links">
          <Link to="/courses">Courses</Link>
          {currentUser && currentUser.role === "instructor" && (
            <Link to="/course-management">Course Management</Link>
          )}
          {currentUser && currentUser.role === "admin" && (
            <Link to="/reports">Reports</Link>
          )}

          {!currentUser ? (
            <>
              <Link to="/login" className="navbar-login">Login</Link>
              <Link to="/register" className="navbar-register">Register</Link>
            </>
          ) : (
            <>
              <span className="navbar-user">{currentUser.fullName} ({currentUser.role})</span>
              <button onClick={handleLogout} className="navbar-logout">Logout</button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
