document.getElementById("form").addEventListener("submit", async (e) => {

    e.preventDefault();

    const name = document.getElementById("name").value;
    const phone = document.getElementById("phone").value;

    const res = await fetch("/api/register", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({ name, phone })

    });

    const data = await res.json();

    if (data.ticketID) {

        window.location.href = `/ticket.html?id=${data.ticketID}`;

    } else {

        alert(data.message);

    }

});