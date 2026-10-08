function data(urlRecebida) {
	const urlParams = new URL(urlRecebida);

	// Extrai o ic
	const ic = urlParams.searchParams.get("ic");
	// Extrai o lote
	const lote = urlParams.searchParams.get("NUMEROLOTE")

	alert(ic);
}


function onScanSuccess(decodedText, decodedResult) {
	// Exibe o dado extraido do QRcode 
	document.getElementById('result').innerText = `Resultado: ${decodedText}`;
	data(decodedText);
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


