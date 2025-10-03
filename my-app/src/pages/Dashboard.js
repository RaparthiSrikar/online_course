import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useCourses } from "../contexts/CourseContext";
import { Link } from "react-router-dom";
import { useToast } from "../contexts/ToastContext";
import "./Dashboard.css";

function Dashboard() {
  const { currentUser } = useAuth();
  const { courses, loadingCourses, enroll } = useCourses();
  const { showToast } = useToast();
  const [myCourses, setMyCourses] = useState([]);

  useEffect(() => {
    if (currentUser && courses) {
      if (currentUser.role === "student") {
        const enrolled = courses.filter((c) => c.enrolled?.includes(currentUser.id));
        setMyCourses(enrolled);
      } else if (currentUser.role === "instructor") {
        const teaching = courses.filter((c) => c.instructorId === currentUser.id);
        setMyCourses(teaching);
      }
    }
  }, [currentUser, courses]);

  const handleEnroll = async (courseId) => {
    try {
      await enroll(courseId, currentUser.id);
      showToast("Enrolled successfully!", "success");
      const enrolled = courses.filter((c) => c.enrolled?.includes(currentUser.id));
      setMyCourses(enrolled);
    } catch (err) {
      showToast(err.message || "Enroll failed", "error");
    }
  };

  if (!currentUser) return <div>Loading user...</div>;

  return (
    <div className="max-w-5xl mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-4">Welcome, {currentUser.fullName}</h1>

      {currentUser.role === "student" && (
        <>
          <h2 className="text-xl font-semibold mb-2">My Enrolled Courses</h2>
          {loadingCourses ? (
            <div>Loading courses...</div>
          ) : myCourses.length === 0 ? (
            <div>You are not enrolled in any courses yet.</div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              {myCourses.map((c) => (
                <div key={c.id} className="dashboard-card">
                  <div className="dashboard-card-header">{c.title}</div>
                  <div className="dashboard-card-sub">Category: {c.category}</div>
                  <div className="dashboard-card-progress mt-2">
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{ width: `${c.progress?.[currentUser.id]?.percent || 0}%` }}
                      ></div>
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      Progress: {c.progress?.[currentUser.id]?.percent || 0}%
                    </div>
                  </div>
                  <Link
                    to={`/courses/${c.id}`}
                    className="mt-2 inline-block text-blue-600 hover:underline"
                  >
                    View Course
                  </Link>
                </div>
              ))}
            </div>
          )}

          {/* Available courses for enrollment */}
          <h2 className="text-xl font-semibold mb-2">Available Courses</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {courses.map((c) => {
              const isEnrolled = c.enrolled?.includes(currentUser.id);
              return (
                <div key={c.id} className="dashboard-card flex justify-between items-center">
                  <div>
                    <div className="dashboard-card-header">{c.title}</div>
                    <div className="dashboard-card-sub">Category: {c.category}</div>
                  </div>
                  <div>
                    {isEnrolled ? (
                      <span className="enrolled-badge">Enrolled</span>
                    ) : (
                      <button
                        onClick={() => handleEnroll(c.id)}
                        className="enroll-button"
                      >
                        Enroll
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {currentUser.role === "instructor" && (
        <>
          <h2 className="text-xl font-semibold mb-2">Courses I Teach</h2>
          {myCourses.length === 0 ? (
            <div>
              You have not created any courses yet.{" "}
              <Link to="/course-management" className="text-blue-600">
                Create one
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {myCourses.map((c) => (
                <div key={c.id} className="dashboard-card">
                  <div className="dashboard-card-header">{c.title}</div>
                  <div className="dashboard-card-sub">Approved: {c.approved ? "Yes" : "No"}</div>
                  <Link
                    to={`/courses/${c.id}`}
                    className="mt-2 inline-block text-blue-600 hover:underline"
                  >
                    View Course
                  </Link>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {currentUser.role === "admin" && (
        <>
          <h2 className="text-xl font-semibold mb-2">Admin Dashboard</h2>
          <div className="bg-white p-4 rounded shadow">
            You can manage courses and users from the sidebar links.
          </div>
        </>
      )}
    </div>
  );
}

export default Dashboard;
