function onScanSuccess(decodedText) {

    window.location.href = decodedText;

}

let scanner = new Html5QrcodeScanner(

    "reader",

    { fps: 10, qrbox: 250 }

);

scanner.render(onScanSuccess);