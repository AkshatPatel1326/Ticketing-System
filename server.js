const express = require("express");
const path = require("path");
const admin = require("firebase-admin");

const app = express();
const PORT = process.env.PORT || 10000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// ================= FIREBASE INIT =================

let serviceAccount;

if (process.env.FIREBASE_SERVICE_ACCOUNT) {
serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
} else {
serviceAccount = require("./firebase-service-account.json");
}

admin.initializeApp({
credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// ================= PAGE ROUTES =================

// Home
app.get("/", (req, res) => {
res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Register Page
app.get("/register", (req, res) => {
res.sendFile(path.join(__dirname, "public", "register.html"));
});

// Admin Login Page
app.get("/admin", (req, res) => {
res.sendFile(path.join(__dirname, "public", "admin-login.html"));
});

// Admin Dashboard
app.get("/dashboard", (req, res) => {
res.sendFile(path.join(__dirname, "public", "admin-dashboard.html"));
});

// Scanner Page
app.get("/scan", (req, res) => {
res.sendFile(path.join(__dirname, "public", "scan.html"));
});

// Ticket Page
app.get("/ticket", (req, res) => {
res.sendFile(path.join(__dirname, "public", "ticket.html"));
});

// ================= REGISTER API =================

app.post("/register", async (req, res) => {

try {

```
const { name, phone } = req.body;

if (!name || !phone) {
  return res.status(400).json({ error: "Missing name or phone" });
}

const ticketId =
  "FEST-" + Math.random().toString(36).substring(2, 8).toUpperCase();

await db.collection("tickets").doc(ticketId).set({
  name,
  phone,
  ticketId,
  used: false,
  createdAt: new Date()
});

res.json({
  success: true,
  ticketId: ticketId
});
```

} catch (error) {

```
console.error(error);

res.status(500).json({
  error: "Server error. Please try again."
});
```

}

});

// ================= VERIFY QR (SCANNER) =================

app.post("/verify-ticket", async (req, res) => {

try {

```
const { ticketId } = req.body;

const ref = db.collection("tickets").doc(ticketId);
const doc = await ref.get();

if (!doc.exists) {
  return res.json({ status: "invalid" });
}

const data = doc.data();

if (data.used) {
  return res.json({ status: "already_used" });
}

await ref.update({ used: true });

res.json({
  status: "valid",
  name: data.name
});
```

} catch (error) {

```
console.error(error);

res.status(500).json({ error: "Server error" });
```

}

});

// ================= ADMIN STATS =================

app.get("/stats", async (req, res) => {

try {

```
const snapshot = await db.collection("tickets").get();

let total = snapshot.size;
let entered = 0;

snapshot.forEach(doc => {
  if (doc.data().used) entered++;
});

res.json({
  total: total,
  entered: entered,
  remaining: total - entered
});
```

} catch (error) {

```
console.error(error);

res.status(500).json({ error: "Server error" });
```

}

});

// ================= SERVER START =================

app.listen(PORT, () => {
console.log("Server running on port " + PORT);
});
