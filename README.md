# Employee Management System (EMS)

A full-stack Employee Management System built with **React (Vite)** on the frontend and **Node.js + Express** on the backend. Add, search, filter, update, and remove employee records through a clean, responsive dashboard with light/dark themes.

**Live Demo:** [ems-rust-sigma.vercel.app](https://ems-rust-sigma.vercel.app/)

<!-- Optional: add a screenshot of the dashboard here once you have one
![EMS Dashboard](./screenshot.png)
-->

---

## ✨ Features

- 📋 **Full CRUD** — add, edit, and delete employee records
- 🔍 **Live search** by name or department
- 🗂️ **Department filter** dropdown, generated dynamically from existing records
- 📊 **Dashboard stats** — total headcount, department count, monthly payroll, and average salary at a glance
- 🌗 **Light / dark theme** toggle with persistent CSS variable theming
- 🎨 **Color-coded avatars & department tags** for quick visual scanning
- 📱 **Fully responsive** layout, from mobile to desktop
- ⚡ **Fast dev experience** powered by Vite

---

## 🛠️ Tech Stack

| Layer       | Technology                                  |
| ----------- | -------------------------------------------- |
| Frontend    | React 19, Vite, lucide-react (icons)         |
| Backend     | Node.js, Express 5                           |
| Styling     | Plain CSS with custom properties (theming)   |
| Deployment  | Vercel (frontend)                            |

---

## 📁 Project Structure

```text
EMS/
├── Ems-backend/
│   ├── controllers/
│   │   └── employeeController.js   # CRUD logic
│   ├── data/
│   │   └── employee.js             # In-memory employee store
│   ├── middleware/
│   │   └── loggerMiddleware.js     # Request logger
│   ├── routes/
│   │   └── employeeRoutes.js       # /employees routes
│   └── index.js                    # Express app entry point
│
└── Ems-frontend/
    ├── public/
    ├── src/
    │   ├── App.jsx                 # Main UI + state + API calls
    │   ├── index.css               # Theming, layout, components
    │   └── main.jsx                # React entry point
    └── vite.config.js
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- npm

### 1. Clone the repository

```bash
git clone https://github.com/Dagar214/EMS.git
cd EMS
```

### 2. Set up the backend

```bash
cd Ems-backend
npm install
npm run dev
```

The API will run at `http://localhost:5000`.

### 3. Set up the frontend

In a new terminal:

```bash
cd Ems-frontend
npm install
npm run dev
```

The app will run at `http://localhost:5173`.

### 4. Configure the API URL (optional)

The frontend reads the API base URL from an environment variable, falling back to `localhost:5000` if it isn't set:

```js
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/employees";
```

To point the frontend at a deployed backend, create a `.env` file inside `Ems-frontend/`:

```env
VITE_API_URL=https://your-deployed-backend-url.com/employees
```

---

## 📡 API Reference

Base URL: `http://localhost:5000/employees`

| Method | Endpoint  | Description            | Body                                         |
| ------ | --------- | ----------------------- | --------------------------------------------- |
| GET    | `/`       | Get all employees        | —                                              |
| GET    | `/:id`    | Get a single employee    | —                                              |
| POST   | `/`       | Add a new employee       | `{ "name", "department", "salary" }`           |
| PUT    | `/:id`    | Update an employee       | Any subset of `{ name, department, salary }`   |
| DELETE | `/:id`    | Delete an employee       | —                                              |

> Note: employee data currently lives in memory (`data/employee.js`) and resets whenever the backend restarts. Swap this out for a real database (MongoDB, PostgreSQL, etc.) for persistent storage in production.

---

## 🗺️ Roadmap

- [ ] Persistent database instead of in-memory storage
- [ ] Authentication for admin-only access
- [ ] Pagination for large employee lists
- [ ] Sorting (by name, department, salary)
- [ ] Confirmation dialog before delete

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome. Feel free to open an issue or submit a pull request.

## 📄 License

This project is licensed under the ISC License.

## 👤 Author

**Dev**
GitHub: [@Dagar214](https://github.com/Dagar214)


