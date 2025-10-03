import React, { useEffect, useState } from "react";
import api from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import "./MyCourses.css";

function MyCourses() {
  const { currentUser } = useAuth();
  const [myCourses, setMyCourses] = useState([]);

  useEffect(() => {
    async function load() {
      const all = await api.call("get", "/courses");
      const mine = all.filter(
        (c) =>
          c.enrolled?.includes(currentUser.id) ||
          c.instructorId === currentUser.id
      );
      setMyCourses(mine);
    }
    load();
  }, [currentUser]);

  return (
    <div className="mycourses-container">
      <h1 className="mycourses-title">My Courses</h1>
      <div className="mycourses-grid">
        {myCourses.map((c) => (
          <div key={c.id} className="mycourses-item">
            <div className="course-title">{c.title}</div>
            <div className="course-progress">
              Progress: {c.progress?.[currentUser.id]?.percent || 0}%
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyCourses;
