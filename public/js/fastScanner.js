let scanning = true;

function showFlash(type, text) {

    const flash = document.getElementById("flash");

    flash.className = "flash " + type;
    flash.innerText = text;

    flash.style.display = "flex";

    setTimeout(() => {

        flash.style.display = "none";

    }, 1500);

}

function onScanSuccess(decodedText) {

    if (!scanning) return;

    scanning = false;

    const ticketID = decodedText.split("/").pop();

    fetch(`/api/verify/${ticketID}`)
        .then(res => res.json())
        .then(data => {

            if (data.status === "valid") {

                showFlash("valid", "ENTRY OK");

            }

            else if (data.status === "used") {

                showFlash("used", "ALREADY USED");

            }

            else {

                showFlash("invalid", "INVALID");

            }

            setTimeout(() => {
                scanning = true;
            }, 2000);

        });

}

let scanner = new Html5QrcodeScanner(
    "reader",
    { fps: 10, qrbox: 250 }
);

scanner.render(onScanSuccess);