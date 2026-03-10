const statusText = document.getElementById("status");

const scanner = new Html5Qrcode("reader");

function startScanner(){

scanner.start(

{
facingMode: { exact: "environment" }   // forces rear camera
},

{
fps: 10,

qrbox: { width: 250, height: 250 }

},

onScanSuccess

).catch(err=>{

console.log("Camera error:",err);

statusText.innerText="Camera access failed";

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

startScanner();
