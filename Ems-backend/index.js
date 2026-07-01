const express = require("express");
const cors = require("cors");
const app = express();
const mongoose = require("mongoose"); 
const employeeRoutes = require("./routes/employeeRoutes");
const loggerMiddleware = require("./middleware/loggerMiddleware");
const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);

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

mongoose.connect("mongodb+srv://Dev:DAGAR@cluster0.bspqa60.mongodb.net/EMS")
.then(() => {
  console.log("Connected to MongoDB");
})
.catch((err) => {
  console.log(err);
});

app.listen(5000, () => {

  console.log("Server Running on Port 5000");

});