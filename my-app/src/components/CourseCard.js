import React from "react";
import { Link } from "react-router-dom";
import "./CourseCard.css";

function CourseCard({ course }) {
  return (
    <div className="course-card">
      <h3 className="course-card-title">{course.title}</h3>
      <p className="course-card-category">Category: {course.category || "General"}</p>
      <p className="course-card-fee">Fee: {course.fee ? `₹${course.fee}` : "Free"}</p>
      <div className="course-card-actions">
        <Link to={`/courses/${course.id}`}>View</Link>
      </div>
    </div>
  );
}

export default CourseCard;
