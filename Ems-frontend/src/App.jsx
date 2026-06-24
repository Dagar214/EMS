import { useEffect, useState } from "react";

function App() {
  const [employees, setEmployees] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDept, setFilterDept] = useState("All");
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    department: "",
    salary: "",
  });

  const API_URL = "http://localhost:5000/employees";

  // FETCH EMPLOYEES
  const getEmployees = async () => {
    const response = await fetch(API_URL);
    const data = await response.json();
    setEmployees(data);
  };

  useEffect(() => {
    getEmployees();
  }, []);

  // DARK MODE: apply class to body
  useEffect(() => {
    document.body.className = darkMode ? "dark" : "";
  }, [darkMode]);

  // HANDLE INPUT
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ADD EMPLOYEE
  const addEmployee = async (e) => {
    e.preventDefault();

    await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    setFormData({ name: "", department: "", salary: "" });
    getEmployees();
  };

  // DELETE EMPLOYEE
  const deleteEmployee = async (id) => {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    getEmployees();
  };

  // START EDITING
  const startEdit = (employee) => {
    setEditingId(employee.id);
    setFormData({
      name: employee.name,
      department: employee.department,
      salary: employee.salary,
    });
  };

  // SAVE EDIT
  const saveEdit = async (e) => {
    e.preventDefault();

    await fetch(`${API_URL}/${editingId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    setEditingId(null);
    setFormData({ name: "", department: "", salary: "" });
    getEmployees();
  };

  // CANCEL EDIT
  const cancelEdit = () => {
    setEditingId(null);
    setFormData({ name: "", department: "", salary: "" });
  };

  // UNIQUE DEPARTMENTS for filter dropdown
  const departments = ["All", ...new Set(employees.map((e) => e.department).filter(Boolean))];

  // FILTERED + SEARCHED EMPLOYEES
  const visibleEmployees = employees.filter((emp) => {
    const matchesSearch =
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.department.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = filterDept === "All" || emp.department === filterDept;
    return matchesSearch && matchesDept;
  });

  return (
    <div className="container">
      {/* HEADER */}
      <div className="header">
        <div>
          <h1>Employee Management</h1>
          <p className="subtitle">
            {employees.length} total employee{employees.length !== 1 ? "s" : ""}
            {filterDept !== "All" || searchQuery
              ? ` · ${visibleEmployees.length} shown`
              : ""}
          </p>
        </div>
        <button className="dark-toggle" onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? "☀ Light" : "☾ Dark"}
        </button>
      </div>

      {/* FORM */}
      <form onSubmit={editingId ? saveEdit : addEmployee} className="form">
        <input
          type="text"
          name="name"
          placeholder="Employee Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="department"
          placeholder="Department"
          value={formData.department}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="salary"
          placeholder="Salary"
          value={formData.salary}
          onChange={handleChange}
          required
        />
        <button type="submit" className={editingId ? "btn-save" : "btn-add"}>
          {editingId ? "Save Changes" : "Add Employee"}
        </button>
        {editingId && (
          <button type="button" className="btn-cancel" onClick={cancelEdit}>
            Cancel
          </button>
        )}
      </form>

      {/* SEARCH + FILTER */}
      <div className="controls">
        <input
          type="text"
          className="search-input"
          placeholder="Search by name or department…"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select
          className="filter-select"
          value={filterDept}
          onChange={(e) => setFilterDept(e.target.value)}
        >
          {departments.map((dept) => (
            <option key={dept} value={dept}>
              {dept}
            </option>
          ))}
        </select>
      </div>

      {/* EMPLOYEE GRID */}
      {visibleEmployees.length === 0 ? (
        <p className="empty-msg">No employees match your search.</p>
      ) : (
        <div className="employee-grid">
          {visibleEmployees.map((employee) => (
            <div key={employee.id} className={`card ${editingId === employee.id ? "card-editing" : ""}`}>
              <h3>{employee.name}</h3>
              <p>
                <span className="label">Department</span>
                {employee.department}
              </p>
              <p>
                <span className="label">Salary</span>₹{Number(employee.salary).toLocaleString("en-IN")}
              </p>
              <div className="card-actions">
                <button className="edit-btn" onClick={() => startEdit(employee)}>
                  Edit
                </button>
                <button className="delete-btn" onClick={() => deleteEmployee(employee.id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;