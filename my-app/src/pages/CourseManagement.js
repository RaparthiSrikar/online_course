import React, { useState } from "react";
import { useCourses } from "../contexts/CourseContext";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../contexts/ToastContext";
import "./CourseManagement.css";

function CourseManagement() {
  const { courses, createCourse, updateCourse, deleteCourse } = useCourses();
  const { currentUser } = useAuth();
  const { showToast } = useToast();

  const [form, setForm] = useState({ title: "", category: "", fee: 0 });

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await createCourse({ ...form, instructorId: currentUser.id });
      setForm({ title: "", category: "", fee: 0 });
      showToast("Course created", "success");
    } catch (err) {
      showToast(err.message || "Create failed", "error");
    }
  };

  return (
    <div className="course-management-container">
      <h1 className="course-management-title">Course Management</h1>

      <form onSubmit={handleCreate} className="course-form">
        <h3 className="course-form-title">Create new course</h3>
        <input
          className="course-form-input"
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
        <input
          className="course-form-input"
          placeholder="Category"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
        />
        <input
          type="number"
          className="course-form-input"
          placeholder="Fee"
          value={form.fee}
          onChange={(e) => setForm({ ...form, fee: Number(e.target.value) })}
        />
        <button type="submit" className="course-form-button">Create Course</button>
      </form>

      <div className="course-list">
        {courses.map((c) => (
          <div key={c.id} className="course-item">
            <div className="course-item-info">
              <div className="course-title">{c.title}</div>
              <div className="course-approved">Approved: {c.approved ? "Yes" : "No"}</div>
            </div>
            <div className="course-item-buttons">
              <button
                onClick={() =>
                  updateCourse(c.id, { approved: !c.approved }).then(() =>
                    showToast("Updated", "success")
                  )
                }
                className="approve-button"
              >
                Toggle Approve
              </button>
              <button
                onClick={() =>
                  deleteCourse(c.id).then(() => showToast("Deleted", "success"))
                }
                className="delete-button"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CourseManagement;
