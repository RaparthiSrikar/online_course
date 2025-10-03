import React, { useEffect, useState } from "react";
import api from "../services/api";
import { Bar } from "react-chartjs-2";
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from "chart.js";
import "./Reports.css";

Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

function Reports() {
  const [data, setData] = useState({});

  useEffect(() => {
    async function load() {
      const courses = await api.call("get", "/courses");
      const labels = courses.map((c) => c.title);
      const students = courses.map((c) => (c.enrolled ? c.enrolled.length : 0));
      const revenue = courses.map((c) => (c.enrolled ? c.enrolled.length * (c.fee || 0) : 0));
      setData({ labels, students, revenue });
    }
    load();
  }, []);

  if (!data.labels) return <div>Loading reports...</div>;

  return (
    <div className="reports-container">
      <h1 className="reports-title">Admin Reports</h1>

      <div className="reports-grid">
        <div className="reports-card">
          <h3 className="reports-card-title">Students per Course</h3>
          <Bar data={{ labels: data.labels, datasets: [{ label: "Students", data: data.students }] }} />
        </div>

        <div className="reports-card">
          <h3 className="reports-card-title">Revenue per Course</h3>
          <Bar data={{ labels: data.labels, datasets: [{ label: "Revenue", data: data.revenue }] }} />
        </div>

        <div className="reports-card reports-card-wide">
          <h3 className="reports-card-title">Active vs Completed (per course totals)</h3>
          <div className="reports-progress-grid">
            {data.labels.map((label, idx) => (
              <div key={label} className="reports-progress-item">
                <div className="font-medium">{label}</div>
                <div>Enrolled: {data.students[idx]}</div>
                <div>Revenue: ₹{data.revenue[idx]}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Reports;
