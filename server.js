const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static("public"));

/* REGISTER ROUTE */

app.post("/register", async (req, res) => {

    const { name, phone } = req.body;

    if (!name || !phone) {
        return res.status(400).json({
            error: "Missing fields"
        });
    }

    const ticketId = "FEST-" + Math.random().toString(36).substring(2,8).toUpperCase();

    return res.json({
        message: "Registration successful",
        ticketId: ticketId
    });

});


app.listen(PORT, () => {
    console.log("Server running on port " + PORT);
});
