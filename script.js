function onScanSuccess(decodedText, decodedResult) {
	// Exibe o dado extraido do QRcode 
	document.getElementById('result').innerText = `Resultado: ${decodedText}`;
	console.log(`Codigo lido: ${decodedText}`, decodedResult);
}

function onScanFailure(error) {
	// Falhas de leitura 
}

let html5QrcodeScanner = new Html5QrcodeScanner(
	"reader",
	{fps:10, qrbox: {width: 250, height: 250} },
	/* verbose= */ false
);

html5QrcodeScanner.render(onScanSuccess, onScanFailure);
