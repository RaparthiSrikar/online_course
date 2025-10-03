import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";
import "./CourseContext.css";

const CourseContext = createContext();

export function CourseProvider({ children }) {
  const [courses, setCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(false);

  const fetchCourses = async () => {
    setLoadingCourses(true);
    try {
      const list = await api.call("get", "/courses");
      setCourses(list);
    } finally {
      setLoadingCourses(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const createCourse = async (payload) => {
    const course = await api.call("post", "/courses", payload);
    setCourses((c) => [...c, course]);
    return course;
  };

  const updateCourse = async (id, update) => {
    const course = await api.call("put", `/courses/${id}`, update);
    setCourses((c) => c.map((x) => (x.id === course.id ? course : x)));
    return course;
  };

  const deleteCourse = async (id) => {
    await api.call("delete", `/courses/${id}`);
    setCourses((c) => c.filter((x) => x.id !== Number(id)));
  };

  const enroll = async (courseId, userId) => {
    const course = await api.call("post", `/courses/${courseId}/enroll`, { userId });
    setCourses((c) => c.map((x) => (x.id === course.id ? course : x)));
    return course;
  };

  return (
    <CourseContext.Provider
      value={{
        courses,
        loadingCourses,
        fetchCourses,
        createCourse,
        updateCourse,
        deleteCourse,
        enroll,
      }}
    >
      {children}
    </CourseContext.Provider>
  );
}

export function useCourses() {
  return useContext(CourseContext);
}
