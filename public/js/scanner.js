let html5QrCode;

const statusText = document.getElementById("status");

function startScanner(){

statusText.innerText="Starting camera...";

html5QrCode = new Html5Qrcode("reader");

Html5Qrcode.getCameras().then(cameras => {

if(cameras && cameras.length){

const backCamera = cameras.find(cam =>
cam.label.toLowerCase().includes("back")
);

const cameraId = backCamera ? backCamera.id : cameras[0].id;

html5QrCode.start(

cameraId,

{
fps:10,
qrbox:{width:250,height:250}
},

onScanSuccess

);

}

}).catch(err => {

console.log(err);
statusText.innerText="Camera permission denied";

});

}

function onScanSuccess(decodedText){

statusText.innerText="Checking ticket...";

// -------- HANDLE NORMAL PHONE CAMERA QR --------
// If QR contains URL like ticket.html?id=FEST-XXXXX
let ticketId = decodedText;

if(decodedText.includes("id=")){
ticketId = decodedText.split("id=")[1];
}

if(ticketId.includes("&")){
ticketId = ticketId.split("&")[0];
}

ticketId = ticketId.trim();

fetch("/verify-ticket",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({
ticketId:ticketId
})

})

.then(res=>res.json())

.then(data=>{

if(data.status==="valid"){

statusText.innerHTML="✅ ENTRY ALLOWED";
statusText.style.color="white";

document.body.style.background="green";

}

else if(data.status==="already_used"){

statusText.innerHTML="⚠ TICKET ALREADY USED";
statusText.style.color="white";

document.body.style.background="orange";

}

else{

statusText.innerHTML="❌ INVALID TICKET";
statusText.style.color="white";

document.body.style.background="red";

}

})

.catch(err=>{

console.log(err);

statusText.innerHTML="Server error";

document.body.style.background="red";

});

}
