// Fatores de emissão de CO2 em gramas por km
const emissionFactors = {
    'carro-gasolina': 120,
    'carro-diesel': 110,
    'carro-eletrico': 50,
    'aviao-curto': 250,
    'aviao-longo': 150,
    'onibus': 50,
    'trem': 14,
    'motocicleta': 100
};

// Nomes amigáveis para os tipos de transporte
const transportNames = {
    'carro-gasolina': 'Carro (Gasolina)',
    'carro-diesel': 'Carro (Diesel)',
    'carro-eletrico': 'Carro (Elétrico)',
    'aviao-curto': 'Avião (Voo Curto)',
    'aviao-longo': 'Avião (Voo Longo)',
    'onibus': 'Ônibus',
    'trem': 'Trem (Elétrico)',
    'motocicleta': 'Motocicleta'
};

// Elementos do DOM
const form = document.getElementById('calculatorForm');
const transportTypeSelect = document.getElementById('transportType');
const distanceInput = document.getElementById('distance');
const passengersGroup = document.getElementById('passengersGroup');
const passengersInput = document.getElementById('passengers');
const resultDiv = document.getElementById('result');
const emissionAmount = document.getElementById('emissionAmount');
const transportName = document.getElementById('transportName');
const distanceTraveled = document.getElementById('distanceTraveled');
const treesNeeded = document.getElementById('treesNeeded');

// Event Listeners
transportTypeSelect.addEventListener('change', handleTransportChange);
form.addEventListener('submit', handleSubmit);

// Mostra/oculta campo de passageiros conforme o tipo de transporte
function handleTransportChange() {
    const selectedTransport = transportTypeSelect.value;
    
    // Mostra campo de passageiros para carros
    if (selectedTransport.startsWith('carro') || selectedTransport === 'motocicleta') {
        passengersGroup.style.display = 'block';
    } else {
        passengersGroup.style.display = 'none';
        passengersInput.value = '1';
    }
}

// Processa o formulário e calcula a emissão
function handleSubmit(event) {
    event.preventDefault();
    
    const transportType = transportTypeSelect.value;
    const distance = parseFloat(distanceInput.value);
    const passengers = parseInt(passengersInput.value) || 1;
    
    // Validações
    if (!transportType) {
        alert('Por favor, selecione um tipo de transporte.');
        return;
    }
    
    if (!distance || distance <= 0) {
        alert('Por favor, insira uma distância válida.');
        return;
    }
    
    // Calcula a emissão
    const emission = calculateEmission(transportType, distance, passengers);
    
    // Exibe o resultado
    displayResult(transportType, distance, emission);
}

// Calcula a emissão de CO2
function calculateEmission(transportType, distance, passengers) {
    const factor = emissionFactors[transportType];
    
    // Calcula emissão total em gramas
    let totalEmissionGrams = factor * distance;
    
    // Se for transporte compartilhado, divide pelo número de passageiros
    if (passengers > 1) {
        totalEmissionGrams = totalEmissionGrams / passengers;
    }
    
    // Converte para kg
    const emissionKg = totalEmissionGrams / 1000;
    
    return emissionKg;
}

// Exibe o resultado na tela
function displayResult(transportType, distance, emission) {
    // Calcula número de árvores necessárias
    // Uma árvore absorve aproximadamente 21 kg de CO2 por ano
    const trees = Math.ceil(emission / 21);
    
    // Preenche os valores
    emissionAmount.textContent = emission.toFixed(2);
    transportName.textContent = transportNames[transportType];
    distanceTraveled.textContent = distance.toFixed(1);
    treesNeeded.textContent = trees;
    
    // Adiciona classe de cor baseado no nível de emissão
    emissionAmount.parentElement.style.background = getEmissionColor(emission);
    
    // Mostra o resultado com animação
    resultDiv.classList.remove('hidden');
    resultDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Retorna cor baseada no nível de emissão
function getEmissionColor(emission) {
    if (emission < 5) {
        return 'linear-gradient(135deg, #2ecc71, #27ae60)'; // Verde - Baixa emissão
    } else if (emission < 20) {
        return 'linear-gradient(135deg, #f39c12, #e67e22)'; // Laranja - Média emissão
    } else {
        return 'linear-gradient(135deg, #e74c3c, #c0392b)'; // Vermelho - Alta emissão
    }
}

// Reseta a calculadora
function resetCalculator() {
    form.reset();
    resultDiv.classList.add('hidden');
    passengersGroup.style.display = 'none';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    console.log('Calculadora de Emissão de CO2 carregada com sucesso!');
});
