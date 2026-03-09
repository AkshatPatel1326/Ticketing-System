const express = require("express");
const router = express.Router();

// Import controller functions
const {
    registerUser,
    verifyTicket,
    getStats
} = require("../controllers/ticketController");


// ============================
// USER REGISTRATION
// ============================
router.post("/register", registerUser);


// ============================
// QR TICKET VERIFICATION
// ============================
router.get("/verify/:ticketID", verifyTicket);


// ============================
// ADMIN STATS API
// ============================
router.get("/stats", getStats);


// Export router
module.exports = router;