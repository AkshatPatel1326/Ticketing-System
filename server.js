const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const cors = require("cors");

const ticketRoutes = require("./routes/ticketRoutes");

const app = express();

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// API routes
app.use("/api", ticketRoutes);

// Main dashboard (Register / Scanner / Admin)
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public/index.html"));
});

// Admin login page
app.get("/admin", (req, res) => {
    res.sendFile(path.join(__dirname, "public/admin-login.html"));
});

// Admin dashboard page
app.get("/admin/dashboard", (req, res) => {
    res.sendFile(path.join(__dirname, "public/admin-dashboard.html"));
});

// Start server
const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});