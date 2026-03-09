const { v4: uuidv4 } = require("uuid");

function generateTicketID() {
    const id = uuidv4().replace(/-/g, "").substring(0, 6).toUpperCase();
    return `FEST-${id}`;
}

module.exports = generateTicketID;