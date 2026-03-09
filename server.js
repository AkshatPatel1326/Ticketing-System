const express = require("express");
const path = require("path");
const admin = require("firebase-admin");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

/* =========================
   FIREBASE INITIALIZATION
========================= */

let serviceAccount;

try {

  // On Render (production)
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  } 
  // On local machine
  else {
    serviceAccount = require("./firebase-service-account.json");
  }

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });

} catch (err) {
  console.error("Firebase initialization error:", err);
}

const db = admin.firestore();


/* =========================
   REGISTER USER
========================= */

app.post("/register", async (req, res) => {

  try {

    const { name, phone } = req.body;

    if (!name || !phone) {
      return res.status(400).json({
        error: "Missing name or phone"
      });
    }

    const ticketId = "FEST-" + Math.random().toString(36).substring(2, 8).toUpperCase();

    await db.collection("tickets").doc(ticketId).set({
      name,
      phone,
      ticketId,
      used: false,
      createdAt: new Date()
    });

    res.json({
      message: "Registration successful",
      ticketId
    });

  } catch (error) {

    console.error("REGISTER ERROR:", error);

    res.status(500).json({
      error: "Server error. Please try again."
    });

  }

});


/* =========================
   SCAN TICKET
========================= */

app.post("/scan", async (req, res) => {

  try {

    const { ticketId } = req.body;

    const doc = await db.collection("tickets").doc(ticketId).get();

    if (!doc.exists) {
      return res.json({ status: "invalid" });
    }

    const data = doc.data();

    if (data.used) {
      return res.json({ status: "already-used" });
    }

    await db.collection("tickets").doc(ticketId).update({
      used: true
    });

    res.json({
      status: "valid",
      name: data.name
    });

  } catch (error) {

    console.error("SCAN ERROR:", error);

    res.status(500).json({
      status: "error"
    });

  }

});


/* =========================
   ADMIN STATS
========================= */

app.get("/stats", async (req, res) => {

  try {

    const snapshot = await db.collection("tickets").get();

    let total = snapshot.size;
    let entered = 0;

    snapshot.forEach(doc => {
      if (doc.data().used) entered++;
    });

    res.json({
      totalRegistered: total,
      totalEntered: entered,
      remaining: total - entered
    });

  } catch (error) {

    console.error("STATS ERROR:", error);

    res.status(500).json({
      error: "Unable to fetch stats"
    });

  }

});


/* =========================
   START SERVER
========================= */

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
