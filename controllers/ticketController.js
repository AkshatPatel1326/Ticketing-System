const db = require("../firebaseConfig");
const generateTicketID = require("../utils/generateTicket");


// ==============================
// REGISTER USER
// ==============================
exports.registerUser = async (req, res) => {

    try {

        const { name, phone } = req.body;

        if (!name || !phone) {
            return res.status(400).json({
                error: "Name and phone are required"
            });
        }

        // Prevent duplicate registration
        const existing = await db
            .collection("tickets")
            .where("phone", "==", phone)
            .get();

        if (!existing.empty) {
            return res.status(400).json({
                message: "This phone number is already registered"
            });
        }

        // Generate ticket
        const ticketID = generateTicketID();

        const ticket = {
            name,
            phone,
            ticketID,
            used: false,
            createdAt: new Date()
        };

        await db.collection("tickets").doc(ticketID).set(ticket);

        res.json({
            success: true,
            ticketID
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: "Server error"
        });

    }

};



// ==============================
// VERIFY TICKET (FAST SCANNER)
// ==============================
exports.verifyTicket = async (req, res) => {

    try {

        const ticketID = req.params.ticketID;

        const doc = await db.collection("tickets").doc(ticketID).get();

        // Ticket does not exist
        if (!doc.exists) {

            return res.json({
                status: "invalid"
            });

        }

        const data = doc.data();

        // Already used
        if (data.used) {

            return res.json({
                status: "used",
                name: data.name
            });

        }

        // Mark ticket as used
        await db.collection("tickets").doc(ticketID).update({
            used: true
        });

        res.json({
            status: "valid",
            name: data.name
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            status: "error"
        });

    }

};



// ==============================
// ADMIN STATS
// ==============================
exports.getStats = async (req, res) => {

    try {

        const snapshot = await db.collection("tickets").get();

        let total = snapshot.size;
        let entered = 0;

        snapshot.forEach(doc => {

            if (doc.data().used) {
                entered++;
            }

        });

        res.json({
            total,
            entered
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: "Failed to fetch stats"
        });

    }

};