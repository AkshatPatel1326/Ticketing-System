const express = require("express");
const path = require("path");
const admin = require("firebase-admin");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static("public"));

/* FIREBASE INIT */

const serviceAccount = require("./firebase-service-account.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();


/* REGISTER API */

app.post("/register", async (req, res) => {

    try {

        const { name, phone } = req.body;

        if (!name || !phone) {
            return res.status(400).json({
                error: "Missing fields"
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

        return res.json({
            message: "Registration successful",
            ticketId: ticketId
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            error: "Server error"
        });

    }

});


/* START SERVER */

app.listen(PORT, () => {
    console.log("Server running on port " + PORT);
});
