let dataBase = [];

function data(urlRecebida) {
    try {
        const urlParams = new URL(urlRecebida);

        // Extrai 'ic' e 'NUMEROLOTE' da query string
        const ic = urlParams.searchParams.get("ic");
        const lote = urlParams.searchParams.get("NUMEROLOTE");

        // Valida se os parâmetros realmente existem na URL
        if (!ic || !lote) {
            document.getElementById('result').innerText = "Erro: URL lida não contém 'ic' ou 'NUMEROLOTE'.";
            return;
        }

        // Exibe o resultado na tela
        document.getElementById('result').innerText = `Embalagem ${ic}, Lote: ${lote}. Gravado com sucesso!`;

        // Grava os dados no Array
        dataBase.push({ ic, lote });

    } catch (error) {
        // Trata o caso onde o texto escaneado não é uma URL válida
        document.getElementById('result').innerText = "Erro: O código escaneado não é uma URL válida.";
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
    { fps: 10, qrbox: { width: 250, height: 250 } },
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