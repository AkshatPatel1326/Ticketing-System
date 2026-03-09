const express = require("express");
const path = require("path");
const admin = require("firebase-admin");

const app = express();
const PORT = process.env.PORT || 10000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

app.get("/", (req, res) => {
res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/register", (req, res) => {
res.sendFile(path.join(__dirname, "public", "register.html"));
});

app.get("/admin", (req, res) => {
res.sendFile(path.join(__dirname, "public", "admin-login.html"));
});

app.get("/admin/dashboard", (req, res) => {
res.sendFile(path.join(__dirname, "public", "admin-dashboard.html"));
});

app.get("/scan", (req, res) => {
res.sendFile(path.join(__dirname, "public", "scan.html"));
});

app.get("/ticket", (req, res) => {
res.sendFile(path.join(__dirname, "public", "ticket.html"));
});

// ================= REGISTER =================

app.post("/register", async (req, res) => {

try {

```
const { name, phone } = req.body;

if (!name || !phone) {
  return res.status(400).json({
    error: "Name and phone required"
  });
}

const ticketId =
  "FEST-" + Math.random().toString(36).substring(2,8).toUpperCase();

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

} catch (err) {

```
console.error(err);

res.status(500).json({
  error: "Server error"
});
```

}

});

// ================= VERIFY TICKET (UPDATED) =================

app.post("/verify-ticket", async (req, res) => {

try {

```
let { ticketId } = req.body;

if (!ticketId) {
  return res.json({ status: "invalid" });
}

// If QR contains URL, extract the ID
if (ticketId.includes("id=")) {
  ticketId = ticketId.split("id=")[1];
}

// Remove extra params if present
if (ticketId.includes("&")) {
  ticketId = ticketId.split("&")[0];
}

ticketId = ticketId.trim();

console.log("Verifying Ticket:", ticketId);

const ref = db.collection("tickets").doc(ticketId);
const doc = await ref.get();

if (!doc.exists) {
  return res.json({ status: "invalid" });
}

const data = doc.data();

if (data.used === true) {
  return res.json({ status: "already_used" });
}

await ref.update({
  used: true
});

res.json({
  status: "valid",
  name: data.name
});
```

} catch (err) {

```
console.error("Verification error:", err);

res.status(500).json({
  status: "error"
});
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

  if (doc.data().used === true) {
    entered++;
  }

});

res.json({
  total,
  entered,
  remaining: total - entered
});
```

} catch (err) {

```
console.error(err);

res.status(500).json({
  error: "Failed to fetch stats"
});
```

}

});

// ================= START SERVER =================

app.listen(PORT, () => {

console.log("Server running on port " + PORT);

});
