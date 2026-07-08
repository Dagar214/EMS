import { useEffect, useState } from "react";
import {
  Moon,
  Sun,
  Plus,
  Search,
  Pencil,
  Trash2,
  X,
  Check,
  Users,
  Building2,
  Wallet,
  TrendingUp,
} from "lucide-react";

// Fixed color pool so the same name/department always maps to the same tag color
const COLOR_POOL = [
  { bg: "var(--tag-1-soft)", fg: "var(--tag-1)" },
  { bg: "var(--tag-2-soft)", fg: "var(--tag-2)" },
  { bg: "var(--tag-3-soft)", fg: "var(--tag-3)" },
  { bg: "var(--tag-4-soft)", fg: "var(--tag-4)" },
  { bg: "var(--tag-5-soft)", fg: "var(--tag-5)" },
];

const colorFor = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
  return COLOR_POOL[Math.abs(hash) % COLOR_POOL.length];
};

function App() {
  const [employees, setEmployees] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDept, setFilterDept] = useState("All");
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    department: "",
    salary: "",
  });

  const API_URL = "http://localhost:5000/employees" || import.meta.env.VITE_API_URL;

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
    setShowForm(false);
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
    setShowForm(true);
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
    setShowForm(false);
    getEmployees();
  };

  // CANCEL EDIT / CLOSE PANEL
  const closeForm = () => {
    setEditingId(null);
    setFormData({ name: "", department: "", salary: "" });
    setShowForm(false);
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

  // INITIALS for avatar
  const getInitials = (name) =>
    name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("");

  // KPI STATS
  const totalPayroll = employees.reduce((sum, e) => sum + Number(e.salary || 0), 0);
  const avgSalary = employees.length ? Math.round(totalPayroll / employees.length) : 0;
  const deptCount = departments.length - 1;

  const formatCurrency = (n) => `₹${Number(n).toLocaleString("en-IN")}`;

  return (
    <div className="page">
      {/* NAVBAR */}
      <header className="navbar">
        <div className="navbar-inner">
          <div className="header-titles">
            <div className="logo-mark">
              <Users size={20} strokeWidth={2.2} />
            </div>
            <div>
              <h1>Employee Management</h1>
              <p className="navbar-subtitle">Manage your team and track payroll at a glance</p>
            </div>
          </div>
          <button className="dark-toggle" onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? <Sun size={16} /> : <Moon size={16} />}
            {darkMode ? "Light" : "Dark"}
          </button>
        </div>
      </header>

      <div className="container">
        {/* KPI STATS */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon stat-icon-a">
              <Users size={18} />
            </div>
            <div>
              <p className="stat-label">Total Employees</p>
              <p className="stat-value">{employees.length}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon stat-icon-b">
              <Building2 size={18} />
            </div>
            <div>
              <p className="stat-label">Departments</p>
              <p className="stat-value">{deptCount}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon stat-icon-c">
              <Wallet size={18} />
            </div>
            <div>
              <p className="stat-label">Monthly Payroll</p>
              <p className="stat-value">{formatCurrency(totalPayroll)}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon stat-icon-d">
              <TrendingUp size={18} />
            </div>
            <div>
              <p className="stat-label">Avg. Salary</p>
              <p className="stat-value">{formatCurrency(avgSalary)}</p>
            </div>
          </div>
        </div>

        {/* TOOLBAR */}
        <div className="toolbar">
          <div className="search-wrap">
            <Search size={16} />
            <input
              type="text"
              className="search-input"
              placeholder="Search by name or department…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
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
          <button
            className="btn-add toolbar-add"
            onClick={() => (showForm && !editingId ? closeForm() : setShowForm(true))}
          >
            <Plus size={16} />
            Add Employee
          </button>
        </div>

        {/* SLIDE-DOWN FORM PANEL */}
        {showForm && (
          <div className="panel">
            <div className="panel-header">
              <h2>{editingId ? "Edit Employee" : "Add New Employee"}</h2>
              <button className="icon-btn" onClick={closeForm} type="button" aria-label="Close">
                <X size={16} />
              </button>
            </div>
            <form onSubmit={editingId ? saveEdit : addEmployee} className="form-grid">
              <div className="field">
                <label>Full Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="e.g. Priya Sharma"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="field">
                <label>Department</label>
                <input
                  type="text"
                  name="department"
                  placeholder="e.g. Human Resources"
                  value={formData.department}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="field">
                <label>Monthly Salary (₹)</label>
                <input
                  type="number"
                  name="salary"
                  placeholder="e.g. 45000"
                  value={formData.salary}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-actions">
                <button type="button" className="btn-cancel" onClick={closeForm}>
                  <X size={16} />
                  Cancel
                </button>
                <button type="submit" className={editingId ? "btn-save" : "btn-add"}>
                  {editingId ? <Check size={16} /> : <Plus size={16} />}
                  {editingId ? "Save Changes" : "Add Employee"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* RESULTS COUNT */}
        <p className="results-count">
          Showing {visibleEmployees.length} of {employees.length} employee
          {employees.length !== 1 ? "s" : ""}
        </p>

        {/* EMPLOYEE GRID */}
        {visibleEmployees.length === 0 ? (
          <div className="empty-state">
            <Users size={32} />
            <p className="empty-msg">No employees match your search.</p>
          </div>
        ) : (
          <div className="employee-grid">
            {visibleEmployees.map((employee) => {
              const avatarColor = colorFor(employee.name);
              const badgeColor = colorFor(employee.department);
              return (
                <div
                  key={employee.id}
                  className={`card ${editingId === employee.id ? "card-editing" : ""}`}
                >
                  <div className="card-header">
                    <div
                      className="avatar"
                      style={{ background: avatarColor.bg, color: avatarColor.fg }}
                    >
                      {getInitials(employee.name)}
                    </div>
                    <h3>{employee.name}</h3>
                  </div>
                  <div className="card-body">
                    <span
                      className="dept-badge"
                      style={{ background: badgeColor.bg, color: badgeColor.fg }}
                    >
                      {employee.department}
                    </span>
                    <p className="salary-row">
                      <span className="label">Salary</span>
                      <strong>{formatCurrency(employee.salary)}</strong>
                    </p>
                  </div>
                  <div className="card-actions">
                    <button className="edit-btn" onClick={() => startEdit(employee)}>
                      <Pencil size={14} />
                      Edit
                    </button>
                    <button className="delete-btn" onClick={() => deleteEmployee(employee._id)}>
                      <Trash2 size={14} />
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
