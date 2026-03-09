const express = require("express");
const path = require("path");
const admin = require("firebase-admin");

const app = express();
const PORT = process.env.PORT || 10000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

let serviceAccount;

try {
  serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
} catch (error) {
  console.error("Failed to parse Firebase credentials:", error);
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

app.post("/register", async (req, res) => {
  try {

    const { name, phone } = req.body;

    if (!name || !phone) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const ticketId =
      "FEST-" + Math.random().toString(36).substring(2, 8).toUpperCase();

    await db.collection("tickets").add({
      name,
      phone,
      ticketId,
      entered: false,
      createdAt: new Date()
    });

    res.json({
      success: true,
      ticketId
    });

  } catch (error) {
    console.error("Firebase error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
