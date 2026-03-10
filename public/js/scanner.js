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

fetch("/verify-ticket",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({
ticketId:decodedText
})

})

.then(res=>res.json())

.then(data=>{

if(data.status==="valid"){

statusText.innerHTML="✅ Entry Allowed";
statusText.style.color="lightgreen";

}

else if(data.status==="already_used"){

statusText.innerHTML="⚠ Ticket Already Used";
statusText.style.color="orange";

}

else{

statusText.innerHTML="❌ Invalid Ticket";
statusText.style.color="red";

}

});

}
