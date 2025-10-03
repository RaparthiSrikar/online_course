import React from "react";
import { useCourses } from "../contexts/CourseContext";
import CourseCard from "../components/CourseCard";
import "./Courses.css";

function Courses() {
  const { courses, loadingCourses } = useCourses();

  return (
    <div className="courses-container">
      <h1 className="courses-title">Course Catalog</h1>
      {loadingCourses ? (
        <div className="courses-loading">Loading...</div>
      ) : (
        <div className="courses-grid">
          {courses.map((c) => (
            <CourseCard key={c.id} course={c} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Courses;
