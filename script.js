let dataBase = [];
let numCarga = " ";

//oculta o scanner/buttons
let boxScanner = document.querySelector(".boxScanner")
let btnScanner = document.querySelector(".btn-send1") 
let btnScanner2 = document.querySelector("#btn-send2")

boxScanner.setAttribute('hidden', '')
btnScanner.setAttribute('hidden', '')
btnScanner2.setAttribute('hidden', '')

function sendCarga(idNumCarga) {

    // Armazena o valor do input na var numCarga
    numCarga = document.getElementById(idNumCarga).value

    if (numCarga === "") {
        window.alert("Digite o numero da carga.")
        return;
    }
    
    const titleCabecalho = document.querySelector('#title-cabecalho')
    const inputCarga = document.querySelector('#inputCarga')
    const btnSend = document.querySelector('.btn-send')

    // pos armazenamento oculta os inputs/button/h1
    titleCabecalho.setAttribute('hidden', '')
    inputCarga.setAttribute('hidden', '')
    btnSend.setAttribute('hidden', '')

    //devolve o scanner/buttons
    boxScanner.removeAttribute('hidden', '')
    btnScanner.removeAttribute('hidden', '')
    btnScanner2.removeAttribute('hidden', '')
}

function data(urlRecebida) {

    if (!numCarga || numCarga.trim() === "") {
        window.alert("Por favor, digite e grave o número da Carga antes de escanear!")
        return; 
    }

    try {
        //Trata os dados lidos
        const urlParams = new URL(urlRecebida);
        const ic = urlParams.searchParams.get("ic");
        const lote = urlParams.searchParams.get("NUMEROLOTE");
        
        //Testa se o Qrcode lido é o correto 
        if (!ic || !lote) {
            document.getElementById('result').innerText = "Erro na leitura!";
            return;
        }

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

    if (!numCarga || numCarga.trim() === "") {
        window.alert("Por favor, digite e grave o número da Carga antes de escanear!");
        return; 
    }

    // 1. Cria uma cópia do dataBase e ordena em ordem crescente pelo 'ic'
    const dataBaseOrdenado = [...dataBase].sort((a, b) => a.ic.localeCompare(b.ic, undefined, { numeric: true }));

    // 2. Mapeia cada objeto da lista ORDENADA formatando com IC e LOTE na mesma linha
    const linhasDeTexto = dataBaseOrdenado.map(objeto => `IC: ${objeto.ic} | Lote: ${objeto.lote}`);
    
    // Junta todas as linhas separadas por quebra de linha (\n)
    const conteudo = linhasDeTexto.join("\n");

    // Cria o Blob com o conteúdo
    const blob = new Blob([conteudo], { type: "text/plain;charset=utf-8" });

    // Cria o link para download
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `Carga ${numCarga}.txt`;

    // Dispara o download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
}

function limpar() {
	dataBase = []
    document.getElementById('result').innerText = "Aguardando leitura..."

    const titleCabecalho = document.querySelector('#title-cabecalho')
    const inputCarga = document.querySelector('#inputCarga')
    const btnSend = document.querySelector('.btn-send')

    // pos limpeza devolve os inputs/button/h1
    titleCabecalho.removeAttribute('hidden', '')
    inputCarga.removeAttribute('hidden', '')
    btnSend.removeAttribute('hidden', '')

    //add placeholder no input
    inputCarga.value = ""
    inputCarga.setAttribute('placeholder', 'Numero da carga....')

    //devolve o boxScanner
    boxScanner.setAttribute('hidden', '')
    btnScanner.setAttribute('hidden', '')
    btnScanner2.setAttribute('hidden', '')
}