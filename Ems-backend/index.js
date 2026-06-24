const express = require("express");
const cors = require("cors");
const app = express();
const employeeRoutes = require("./routes/employeeRoutes");
const loggerMiddleware = require("./middleware/loggerMiddleware");

// Middleware

app.use(express.json());
app.use(loggerMiddleware);
app.use(cors({
  origin:[
    "http://localhost:5173",
    "https://ems-rust-sigma.vercel.app"
  ]
}));

// Routes
app.use("/employees", employeeRoutes);

app.get("/", (req, res) => {

  res.send("Employee Management API Running");

});

app.listen(5000, () => {

  console.log("Server Running on Port 5000");

});