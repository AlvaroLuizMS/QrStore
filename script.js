let dataBase = [];
let numCarga = " ";

// Seleciona os elementos do scanner/buttons originais
let boxScanner = document.querySelector(".boxScanner");
let btnScanner = document.querySelector(".btn-send1"); 
let btnScanner2 = document.querySelector("#btn-send2");

// Seleciona os novos elementos de atalho do HTML
let quickLabel = document.querySelector(".quick-label");
let shortcutsBox = document.querySelector(".shortcutsBox");

// Oculta o scanner/buttons ao iniciar a página
if (boxScanner) boxScanner.style.display = 'none';
if (btnScanner) btnScanner.style.display = 'none';
if (btnScanner2) btnScanner2.style.display = 'none';

function sendCarga(idNumCarga) {
    // Armazena o valor do input na var numCarga
    numCarga = document.getElementById(idNumCarga).value;

    if (numCarga === "") {
        window.alert("Por favor, selecione ou digite o tratamento da semente.");
        return;
    }

    const titleCabecalho = document.querySelector('#title-cabecalho');
    const logo = document.querySelector('#icon');
    const inputCarga = document.querySelector('#inputCarga');
    const btnSend = document.querySelector('.btn-send');

    // Pós armazenamento, oculta os inputs e botões principais
    if (titleCabecalho) titleCabecalho.style.display = 'none';
    if (icon) icon.style.display = 'none';
    if (inputCarga) inputCarga.style.display = 'none';
    if (btnSend) btnSend.style.display = 'none';
    
    // OCULTAR ATALHOS (Usando style.display para garantir que suma)
    if (quickLabel) quickLabel.style.display = 'none'; 
    if (shortcutsBox) shortcutsBox.style.display = 'none'; 

    // Devolve o scanner e os botões de ação do leitor
    if (boxScanner) boxScanner.style.display = 'block'; // ou 'flex' dependendo do seu layout
    if (btnScanner) btnScanner.style.display = 'inline-block';
    if (btnScanner2) btnScanner2.style.display = 'inline-block';
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
                { fps: 10, qrbox: { width: 250, height: 250 } },
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
        window.alert("Por favor, digite e grave o número da Carga antes de escanear!");
        return; 
    }

    // Pega a data atual do sistema formatada (DD/MM/AAAA)
    const agora = new Date();
    const dia = String(agora.getDate()).padStart(2, '0');
    const mes = String(agora.getMonth() + 1).padStart(2, '0');
    const ano = agora.getFullYear();
    const dataFormatada = `${dia}/${mes}/${ano}`;

    // Monta o texto do cabeçalho solicitado
    const textoCabecalho = `Carga ${dataFormatada} - ${numCarga.trim().toUpperCase()}`;
    const linhaDivisora = "--------------------------------------------------";

    // Centraliza o texto do cabeçalho com base no tamanho da linha divisora (50 caracteres)
    let cabecalhoCentralizado = textoCabecalho;
    if (textoCabecalho.length < linhaDivisora.length) {
        const espacosTotal = linhaDivisora.length - textoCabecalho.length;
        const espacosEsquerda = Math.floor(espacosTotal / 2);
        cabecalhoCentralizado = " ".repeat(espacosEsquerda) + textoCabecalho;
    }

    // Cria o bloco do cabeçalho alinhado/centralizado
    const cabecalhoArquivo = `${cabecalhoCentralizado}\n${linhaDivisora}`;
    
    // Cria uma cópia ordenada do banco de dados para o arquivo
    const dadosOrdenados = [...dataBase].sort((a, b) => {
        return a.ic.localeCompare(b.ic, undefined, { numeric: true, sensitivity: 'base' });
    });

    // Mapeia cada objeto formatado com IC e LOTE (usando a lista ordenada)
    const linhasDeTexto = dadosOrdenados.map(objeto => `IC: ${objeto.ic} | Lote: ${objeto.lote}`);
    
    // Junta tudo separando por quebras de linha
    const conteudo = [cabecalhoArquivo, ...linhasDeTexto].join("\n");

    // Cria o Blob com o conteúdo
    const blob = new Blob([conteudo], { type: "text/plain;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    
    // O nome do arquivo salvo no celular
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
    if (titleCabecalho) titleCabecalho.style.display = '';
    if (icon) icon.style.display = '';
    if (btnSend) btnSend.style.display = '';
    if (inputCarga) inputCarga.style.display = '';
    if (btnSend) btnSend.style.display = '';
    
    // REEXIBIR ATALHOS (Remove o 'none' para adotar o padrão original do CSS)
    if (quickLabel) quickLabel.style.display = ''; 
    if (shortcutsBox) shortcutsBox.style.display = ''; 

    // Reseta o input para o estado inicial
    if (inputCarga) {
        inputCarga.value = "";
        inputCarga.setAttribute('placeholder', 'Selecione ou digite o tratamento...');
    }

    // Oculta novamente o painel do scanner
    if (boxScanner) boxScanner.style.display = 'none';
    if (btnScanner) btnScanner.style.display = 'none';
    if (btnScanner2) btnScanner2.style.display = 'none';
}