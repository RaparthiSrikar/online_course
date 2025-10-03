import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../contexts/ToastContext";
import "./CourseDetail.css";

function CourseDetail() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const { currentUser } = useAuth();
  const { showToast } = useToast();

  useEffect(() => {
    api.call("get", `/courses/${id}`).then(setCourse).catch((e) => showToast(e.message));
  }, [id]);

  const handleEnroll = async () => {
    try {
      await api.call("post", `/courses/${id}/enroll`, { userId: currentUser.id });
      showToast("Enrolled successfully", "success");
      const updated = await api.call("get", `/courses/${id}`);
      setCourse(updated);
    } catch (err) {
      showToast(err.message || "Enroll failed", "error");
    }
  };

  if (!course) return <div>Loading course...</div>;

  const isEnrolled = course.enrolled?.includes(currentUser?.id);

  return (
    <div className="course-detail-container">
      <h1 className="course-detail-title">{course.title}</h1>
      <p className="course-detail-text">Instructor ID: {course.instructorId}</p>
      <p className="course-detail-text">Category: {course.category}</p>
      <p className="course-detail-text">Fee: {course.fee ? `₹${course.fee}` : "Free"}</p>

      <div className="course-detail-actions">
        {!isEnrolled ? (
          <button onClick={handleEnroll} className="course-detail-button">Enroll</button>
        ) : (
          <div className="course-detail-enrolled">You are enrolled</div>
        )}
      </div>
    </div>
  );
}

export default CourseDetail;
