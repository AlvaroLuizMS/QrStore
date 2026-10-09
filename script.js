let dataBase = [];

function data(urlRecebida) {
    try {
        const urlParams = new URL(urlRecebida);

        const ic = urlParams.searchParams.get("ic");
        const lote = urlParams.searchParams.get("NUMEROLOTE");

        if (!ic || !lote) {
            document.getElementById('result').innerText = "QR Code lido não possui 'ic' ou 'NUMEROLOTE' válidos!";
            return;
        }

        // VERIFICAÇÃO DE DUPLICIDADE:
        // Verifica se já existe algum item no dataBase com o mesmo IC
        const jaExiste = dataBase.some(item => item.ic === ic);

        if (jaExiste) {
            document.getElementById('result').innerText = `Atenção: Embalagem ${ic} já foi gravada anteriormente!`;
            return; // Interrompe a função e não adiciona ao dataBase
        }

        // Se não for duplicado, grava os dados
        document.getElementById('result').innerText = `Embalagem ${ic}, Lote: ${lote}. Gravado com sucesso!`;
        dataBase.push({ ic, lote });

    } catch (error) {
        document.getElementById('result').innerText = "Erro: O QR Code lido não é um link/URL válido.";
    }
}

function onScanSuccess(decodedText, decodedResult) {
    data(decodedText);
}

function onScanFailure(error) {
    // Falhas de leitura contínuas da câmera (pode deixar vazio)
}

let html5QrcodeScanner = new Html5QrcodeScanner(
    "reader",
    { fps: 5, qrbox: { width: 250, height: 250 } },
    /* verbose= */ false
);

html5QrcodeScanner.render(onScanSuccess, onScanFailure);

// Download do arquivo TXT
function arquivo() {
    if (dataBase.length === 0) {
        alert("Nenhuma embalagem foi gravada!");
        return;
    }

    // Mapeia cada objeto formatando com IC e LOTE na mesma linha
    // Exemplo de saída: "IC: 12345 - Lote: LOTE987"
    // Ou se preferir separado por vírgula (formato CSV): `${objeto.ic},${objeto.lote}`
    const linhasDeTexto = dataBase.map(objeto => `IC: ${objeto.ic} | Lote: ${objeto.lote}`);
    
    // Junta todas as linhas separadas por quebra de linha (\n)
    const conteudo = linhasDeTexto.join("\n");

    // Cria o Blob com o conteúdo
    const blob = new Blob([conteudo], { type: "text/plain;charset=utf-8" });

    // Cria o link para download
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "Carga.txt";

    // Dispara o download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
}

function limpar() {
	dataBase = []
}