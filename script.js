
let dataBase = [];
let numCarga = " ";

// Seleciona os elementos do scanner/buttons originais
let boxScanner = document.querySelector(".boxScanner");
let btnScanner = document.querySelector(".btn-send1"); 
let btnScanner2 = document.querySelector("#btn-send2");

// Seleciona os novos elementos de atalho do HTML
let quickLabel = document.querySelector(".quick-label");
let shortcutsBox = document.querySelector(".shortcuts");

// Oculta o scanner/buttons ao iniciar a página
if (boxScanner) boxScanner.setAttribute('hidden', '');
if (btnScanner) btnScanner.setAttribute('hidden', '');
if (btnScanner2) btnScanner2.setAttribute('hidden', '');

function sendCarga(idNumCarga) {
    // Armazena o valor do input na var numCarga
    numCarga = document.getElementById(idNumCarga).value;

    if (numCarga === "") {
        window.alert("Por favor, selecione ou digite o tratamento da semente.");
        return;
    }
    
    const titleCabecalho = document.querySelector('#title-cabecalho');
    const inputCarga = document.querySelector('#inputCarga');
    const btnSend = document.querySelector('.btn-send');

    // Pós armazenamento, oculta os inputs, botões principais e ATALHOS
    if (titleCabecalho) titleCabecalho.setAttribute('hidden', '');
    if (inputCarga) inputCarga.setAttribute('hidden', '');
    if (btnSend) btnSend.setAttribute('hidden', '');
    if (quickLabel) quickLabel.setAttribute('hidden', '');       // Oculta o texto "Escolha Rápida"
    if (shortcutsBox) shortcutsBox.setAttribute('hidden', '');   // Oculta os botões de atalho

    // Devolve o scanner e os botões de ação do leitor
    if (boxScanner) boxScanner.removeAttribute('hidden', '');
    if (btnScanner) btnScanner.removeAttribute('hidden', '');
    if (btnScanner2) btnScanner2.removeAttribute('hidden', '');
}

function data(urlRecebida) {
    if (!numCarga || numCarga.trim() === "") {
        window.alert("Por favor, grave o tratamento antes de escanear!");
        return; 
    }

    try {
        // Trata os dados lidos
        const urlParams = new URL(urlRecebida);
        const ic = urlParams.searchParams.get("ic");
        const lote = urlParams.searchParams.get("NUMEROLOTE");
        
        // Testa se o Qrcode lido é o correto 
        if (!ic || !lote) {
            document.getElementById('result').innerText = "Erro na leitura! QR Code inválido para soja.";
            return;
        }

        // Verifica se já existe algum item no dataBase com o mesmo IC
        const jaExiste = dataBase.some(item => item.ic === ic);

        if (jaExiste) {
            document.getElementById('result').innerText = `Atenção: Embalagem ${ic} já foi gravada!`;
            return; 
        }

        // Se não for duplicado, grava os dados
        document.getElementById('result').innerText = `Embalagem ${ic}, Lote: ${lote}. Gravado com sucesso!`;
        dataBase.push({ ic, lote });

    } catch (error) {
        document.getElementById('result').innerText = "Erro: O código lido não contém dados válidos.";
    }
}

function onScanSuccess(decodedText, decodedResult) {
    data(decodedText);
}

function onScanFailure(error) {
    // Falhas de leitura contínuas da câmera (pode deixar vazio)
}

// Inicialização segura que espera a biblioteca carregar antes de rodar o leitor
document.addEventListener("DOMContentLoaded", () => {
    try {
        if (typeof Html5QrcodeScanner !== "undefined") {
            let html5QrcodeScanner = new Html5QrcodeScanner(
                "reader",
                { fps: 5, qrbox: { width: 250, height: 250 } },
                /* verbose= */ false
            );
            html5QrcodeScanner.render(onScanSuccess, onScanFailure);
        } else {
            console.error("A biblioteca Html5QrcodeScanner não foi encontrada. Verifique a tag script do HTML.");
        }
    } catch (e) {
        console.error("Erro ao inicializar o scanner de QR Code:", e);
    }
});

// Download do arquivo TXT
function arquivo() {

    if (dataBase.length === 0) {
        alert("Nenhuma embalagem foi gravada para esta carga!");
        return;
    }

    if (!numCarga || numCarga.trim() === "") {
        window.alert("Por favor, digite e grave o número da Carga antes de escanear!")
        return; 
    }

    // Mapeia cada objeto formatando com IC e LOTE na mesma linha
    const linhasDeTexto = dataBase.map(objeto => `IC: ${objeto.ic} | Lote: ${objeto.lote}`);
    
    // Junta tudo separando por quebras de linha
    const conteudo = [cabecalhoArquivo, ...linhasDeTexto].join("\n");

    // Cria o Blob com o conteúdo
    const blob = new Blob([conteudo], { type: "text/plain;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    
    // O nome do arquivo salvo no celular também levará a data organizada
    link.download = `Carga_${dia}-${mes}-${ano}_${numCarga.replace(/[^a-zA-Z0-9]/g, "_")}.txt`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
}

function limpar() {
    dataBase = [];
    document.getElementById('result').innerText = "Aguardando leitura...";

    const titleCabecalho = document.querySelector('#title-cabecalho');
    const inputCarga = document.querySelector('#inputCarga');
    const btnSend = document.querySelector('.btn-send');

    // Pós limpeza, devolve a tela inicial completa incluindo os ATALHOS
    if (titleCabecalho) titleCabecalho.removeAttribute('hidden', '');
    if (inputCarga) inputCarga.removeAttribute('hidden', '');
    if (btnSend) btnSend.removeAttribute('hidden', '');
    if (quickLabel) quickLabel.removeAttribute('hidden', '');     // Reexibe o texto "Escolha Rápida"
    if (shortcutsBox) shortcutsBox.removeAttribute('hidden', ''); // Reexibe os botões de atalho

    // Reseta o input para o estado inicial
    if (inputCarga) {
        inputCarga.value = "";
        inputCarga.setAttribute('placeholder', 'Selecione ou digite o tratamento...');
    }

    // Oculta novamente o painel do scanner
    if (boxScanner) boxScanner.setAttribute('hidden', '');
    if (btnScanner) btnScanner.setAttribute('hidden', '');
    if (btnScanner2) btnScanner2.setAttribute('hidden', '');
}