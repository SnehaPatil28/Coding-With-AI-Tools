// App.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:5000/api/students";

export default function App() {
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    roll_number: "",
    department: "",
    marks: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");

  // Fetch all students on component load
  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await axios.get(API_BASE_URL);
      setStudents(res.data);
    } catch (err) {
      setError("Failed to fetch students.");
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (editingId) {
        // UPDATE
        await axios.put(`${API_BASE_URL}/${editingId}`, formData);
        setEditingId(null);
      } else {
        // CREATE
        await axios.post(API_BASE_URL, formData);
      }
      setFormData({ name: "", roll_number: "", department: "", marks: "" });
      fetchStudents();
    } catch (err) {
      setError(err.response?.data?.error || "Action failed.");
    }
  };

  const handleEdit = (student) => {
    setEditingId(student.id);
    setFormData({
      name: student.name,
      roll_number: student.roll_number,
      department: student.department,
      marks: student.marks,
    });
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/${id}`);
      fetchStudents();
    } catch (err) {
      setError("Failed to delete student.");
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({ name: "", roll_number: "", department: "", marks: "" });
  };

  return (
    <div
      style={{
        maxWidth: "800px",
        margin: "2rem auto",
        fontFamily: "sans-serif",
      }}
    >
      <h2>Student Record Manager</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Form Component */}
      <form
        onSubmit={handleSubmit}
        style={{
          marginBottom: "2rem",
          display: "flex",
          gap: "8px",
          flexWrap: "wrap",
        }}
      >
        <input
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleInputChange}
          required
        />
        <input
          name="roll_number"
          placeholder="Roll Number"
          value={formData.roll_number}
          onChange={handleInputChange}
          required
        />
        <input
          name="department"
          placeholder="Department"
          value={formData.department}
          onChange={handleInputChange}
          required
        />
        <input
          name="marks"
          type="number"
          placeholder="Marks"
          value={formData.marks}
          onChange={handleInputChange}
          required
        />
        <button type="submit">
          {editingId ? "Update Record" : "Add Student"}
        </button>
        {editingId && (
          <button type="button" onClick={handleCancel}>
            Cancel
          </button>
        )}
      </form>

      {/* Table Component */}
      <table
        border="1"
        cellPadding="8"
        style={{ width: "100%", borderCollapse: "collapse" }}
      >
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Roll No.</th>
            <th>Department</th>
            <th>Marks</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((st) => (
            <tr key={st.id}>
              <td>{st.id}</td>
              <td>{st.name}</td>
              <td>{st.roll_number}</td>
              <td>{st.department}</td>
              <td>{st.marks}</td>
              <td>
                <button onClick={() => handleEdit(st)}>Edit</button>{" "}
                <button onClick={() => handleDelete(st.id)}>Delete</button>
              </td>
            </tr>
          ))}
          {students.length === 0 && (
            <tr>
              <td colSpan="6" style={{ textAlign: "center" }}>
                No student records found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
