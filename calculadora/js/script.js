// Fatores de emissão de CO2 em gramas por km
const emissionFactors = {
    'carro-gasolina': { factor: 120, name: '🚗 Carro (Gasolina)', icon: '🚗', shareable: true },
    'carro-diesel': { factor: 110, name: '🚙 Carro (Diesel)', icon: '🚙', shareable: true },
    'carro-eletrico': { factor: 50, name: '⚡ Carro (Elétrico)', icon: '⚡', shareable: true },
    'aviao-curto': { factor: 250, name: '✈️ Avião (Voo Curto)', icon: '✈️', shareable: false },
    'aviao-longo': { factor: 150, name: '🛫 Avião (Voo Longo)', icon: '🛫', shareable: false },
    'onibus': { factor: 50, name: '🚌 Ônibus', icon: '🚌', shareable: false },
    'trem': { factor: 14, name: '🚆 Trem (Elétrico)', icon: '🚆', shareable: false },
    'motocicleta': { factor: 100, name: '🏍️ Motocicleta', icon: '🏍️', shareable: true }
};

// Variáveis globais para o mapa
let map;
let originMarker;
let destinationMarker;
let routeLine;
let currentRoute = null;

// Elementos do DOM
const form = document.getElementById('calculatorForm');
const searchRouteBtn = document.getElementById('searchRoute');
const originInput = document.getElementById('origin');
const destinationInput = document.getElementById('destination');
const originSuggestions = document.getElementById('originSuggestions');
const destinationSuggestions = document.getElementById('destinationSuggestions');
const passengersInput = document.getElementById('passengers');
const routeInfo = document.getElementById('routeInfo');
const routeDistance = document.getElementById('routeDistance');
const routeDuration = document.getElementById('routeDuration');
const resultDiv = document.getElementById('result');

// Variáveis para controle de autocomplete
let originTimeout;
let destinationTimeout;
let selectedOrigin = null;
let selectedDestination = null;

// Inicialização do mapa
function initMap() {
    // Inicializa o mapa centrado no Brasil
    map = L.map('map').setView([-15.7801, -47.9292], 4);
    
    // Adiciona camada do OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19
    }).addTo(map);
}

// Busca coordenadas de um local usando Nominatim (OpenStreetMap)
async function geocodeLocation(location) {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}&limit=1`;
    
    try {
        const response = await fetch(url);
        const data = await response.json();
        
        if (data && data.length > 0) {
            return {
                lat: parseFloat(data[0].lat),
                lon: parseFloat(data[0].lon),
                displayName: data[0].display_name
            };
        }
        return null;
    } catch (error) {
        console.error('Erro ao buscar localização:', error);
        return null;
    }
}

// Calcula a rota usando OSRM (Open Source Routing Machine)
async function calculateRoute(originCoords, destCoords) {
    const url = `https://router.project-osrm.org/route/v1/driving/${originCoords.lon},${originCoords.lat};${destCoords.lon},${destCoords.lat}?overview=full&geometries=geojson`;
    
    try {
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.code === 'Ok' && data.routes && data.routes.length > 0) {
            const route = data.routes[0];
            return {
                distance: route.distance / 1000, // Converte para km
                duration: route.duration / 60, // Converte para minutos
                geometry: route.geometry
            };
        }
        return null;
    } catch (error) {
        console.error('Erro ao calcular rota:', error);
        return null;
    }
}

// Event Listeners
searchRouteBtn.addEventListener('click', handleRouteSearch);
form.addEventListener('submit', handleSubmit);

// Autocomplete listeners
originInput.addEventListener('input', (e) => handleAutocomplete(e, 'origin'));
destinationInput.addEventListener('input', (e) => handleAutocomplete(e, 'destination'));

// Fecha sugestões ao clicar fora
document.addEventListener('click', (e) => {
    if (!e.target.closest('.autocomplete-wrapper')) {
        originSuggestions.classList.remove('active');
        destinationSuggestions.classList.remove('active');
    }
});

// Autocomplete: busca sugestões de cidades
async function handleAutocomplete(event, field) {
    const input = event.target;
    const query = input.value.trim();
    const suggestionsDiv = field === 'origin' ? originSuggestions : destinationSuggestions;
    const timeout = field === 'origin' ? 'originTimeout' : 'destinationTimeout';
    
    // Limpa o timeout anterior
    if (window[timeout]) {
        clearTimeout(window[timeout]);
    }
    
    // Se o campo estiver vazio, esconde as sugestões
    if (query.length < 3) {
        suggestionsDiv.classList.remove('active');
        if (field === 'origin') selectedOrigin = null;
        else selectedDestination = null;
        return;
    }
    
    // Mostra loading
    suggestionsDiv.innerHTML = '<div class="suggestion-item loading">🔍 Buscando...</div>';
    suggestionsDiv.classList.add('active');
    
    // Aguarda 500ms antes de fazer a busca (debounce)
    window[timeout] = setTimeout(async () => {
        const suggestions = await searchLocations(query);
        displaySuggestions(suggestions, suggestionsDiv, field);
    }, 500);
}

// Busca localizações na API Nominatim
async function searchLocations(query) {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&addressdetails=1`;
    
    try {
        const response = await fetch(url, {
            headers: {
                'Accept-Language': 'pt-BR,pt;q=0.9'
            }
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erro ao buscar localizações:', error);
        return [];
    }
}

// Exibe sugestões no dropdown
function displaySuggestions(suggestions, suggestionsDiv, field) {
    if (!suggestions || suggestions.length === 0) {
        suggestionsDiv.innerHTML = '<div class="suggestion-item loading">Nenhuma localização encontrada</div>';
        return;
    }
    
    suggestionsDiv.innerHTML = '';
    
    suggestions.forEach(location => {
        const item = document.createElement('div');
        item.className = 'suggestion-item';
        
        // Formata o nome da localização
        const name = location.name || location.display_name.split(',')[0];
        const details = formatLocationDetails(location);
        
        item.innerHTML = `
            <div class="suggestion-name">${name}</div>
            <div class="suggestion-details">${details}</div>
        `;
        
        // Ao clicar na sugestão
        item.addEventListener('click', () => {
            const input = field === 'origin' ? originInput : destinationInput;
            input.value = location.display_name;
            
            // Armazena a localização selecionada
            if (field === 'origin') {
                selectedOrigin = {
                    lat: parseFloat(location.lat),
                    lon: parseFloat(location.lon),
                    displayName: location.display_name
                };
            } else {
                selectedDestination = {
                    lat: parseFloat(location.lat),
                    lon: parseFloat(location.lon),
                    displayName: location.display_name
                };
            }
            
            suggestionsDiv.classList.remove('active');
        });
        
        suggestionsDiv.appendChild(item);
    });
}

// Formata os detalhes da localização
function formatLocationDetails(location) {
    const address = location.address || {};
    const parts = [];
    
    if (address.city) parts.push(address.city);
    else if (address.town) parts.push(address.town);
    else if (address.village) parts.push(address.village);
    
    if (address.state) parts.push(address.state);
    if (address.country) parts.push(address.country);
    
    return parts.join(', ') || location.display_name;
}

// Busca e exibe a rota
async function handleRouteSearch() {
    const origin = originInput.value.trim();
    const destination = destinationInput.value.trim();
    
    if (!origin || !destination) {
        alert('Por favor, preencha origem e destino.');
        return;
    }
    
    // Mostra loading
    searchRouteBtn.textContent = '🔄 Buscando...';
    searchRouteBtn.disabled = true;
    
    try {
        // Usa as coordenadas selecionadas ou busca novamente
        let originCoords = selectedOrigin;
        let destCoords = selectedDestination;
        
        if (!originCoords) {
            originCoords = await geocodeLocation(origin);
        }
        
        if (!destCoords) {
            destCoords = await geocodeLocation(destination);
        }
        
        if (!originCoords || !destCoords) {
            alert('Não foi possível encontrar uma ou ambas as localizações. Tente ser mais específico.');
            return;
        }
        
        // Calcula a rota
        const route = await calculateRoute(originCoords, destCoords);
        
        if (!route) {
            alert('Não foi possível calcular a rota.');
            return;
        }
        
        // Armazena a rota atual
        currentRoute = {
            origin: originCoords.displayName,
            destination: destCoords.displayName,
            distance: route.distance,
            duration: route.duration
        };
        
        // Limpa marcadores anteriores
        if (originMarker) map.removeLayer(originMarker);
        if (destinationMarker) map.removeLayer(destinationMarker);
        if (routeLine) map.removeLayer(routeLine);
        
        // Adiciona marcadores
        originMarker = L.marker([originCoords.lat, originCoords.lon], {
            title: 'Origem'
        }).addTo(map).bindPopup(`<b>🟢 Origem:</b><br>${origin}`);
        
        destinationMarker = L.marker([destCoords.lat, destCoords.lon], {
            title: 'Destino'
        }).addTo(map).bindPopup(`<b>🔴 Destino:</b><br>${destination}`);
        
        // Adiciona linha da rota
        routeLine = L.geoJSON(route.geometry, {
            style: {
                color: '#2196f3',
                weight: 4,
                opacity: 0.7
            }
        }).addTo(map);
        
        // Ajusta o zoom para mostrar toda a rota
        const bounds = L.latLngBounds(
            [originCoords.lat, originCoords.lon],
            [destCoords.lat, destCoords.lon]
        );
        map.fitBounds(bounds, { padding: [50, 50] });
        
        // Exibe informações da rota
        routeDistance.textContent = route.distance.toFixed(1);
        routeDuration.textContent = formatDuration(route.duration);
        routeInfo.classList.remove('hidden');
        
    } catch (error) {
        console.error('Erro:', error);
        alert('Ocorreu um erro ao buscar a rota. Tente novamente.');
    } finally {
        searchRouteBtn.textContent = '🔍 Buscar Rota';
        searchRouteBtn.disabled = false;
    }
}

// Formata duração em horas e minutos
function formatDuration(minutes) {
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    
    if (hours > 0) {
        return `${hours}h ${mins}min`;
    }
    return `${mins}min`;
}

// Processa o formulário e calcula emissões para todos os transportes
function handleSubmit(event) {
    event.preventDefault();
    
    if (!currentRoute) {
        alert('Por favor, busque uma rota primeiro.');
        return;
    }
    
    const distance = currentRoute.distance;
    const passengers = parseInt(passengersInput.value) || 1;
    
    // Calcula emissões para todos os tipos de transporte
    const results = calculateAllEmissions(distance, passengers);
    
    // Exibe resultados
    displayAllResults(results, distance, passengers);
}

// Calcula emissões para todos os tipos de transporte
function calculateAllEmissions(distance, passengers) {
    const results = [];
    
    for (const [key, transport] of Object.entries(emissionFactors)) {
        let emissionGrams = transport.factor * distance;
        
        // Divide por passageiros se for veículo compartilhável
        if (transport.shareable && passengers > 1) {
            emissionGrams = emissionGrams / passengers;
        }
        
        const emissionKg = emissionGrams / 1000;
        const trees = Math.ceil(emissionKg / 21); // Árvores necessárias
        
        results.push({
            key: key,
            name: transport.name,
            icon: transport.icon,
            emission: emissionKg,
            trees: trees,
            shareable: transport.shareable
        });
    }
    
    // Ordena por emissão (menor para maior)
    results.sort((a, b) => a.emission - b.emission);
    
    return results;
}

// Exibe todos os resultados
function displayAllResults(results, distance, passengers) {
    const transportResults = document.getElementById('transportResults');
    const bestTransport = document.getElementById('bestTransport');
    
    // Limpa resultados anteriores
    transportResults.innerHTML = '';
    
    // Preenche sumário
    document.getElementById('summaryOrigin').textContent = currentRoute.origin.split(',')[0];
    document.getElementById('summaryDestination').textContent = currentRoute.destination.split(',')[0];
    document.getElementById('summaryDistance').textContent = distance.toFixed(1);
    document.getElementById('summaryPassengers').textContent = passengers;
    
    // Cria cards para cada transporte
    results.forEach((result, index) => {
        const card = createTransportCard(result, index === 0);
        transportResults.appendChild(card);
    });
    
    // Exibe melhor opção
    const best = results[0];
    bestTransport.innerHTML = `
        <div class="transport-type">${best.icon} ${best.name}</div>
        <div class="transport-emission">
            <span class="emission-number">${best.emission.toFixed(2)}</span>
            <span class="emission-unit">kg de CO2</span>
        </div>
        <p style="margin-top: 15px; color: var(--text-color);">
            🌳 Necessário plantar <strong>${best.trees} árvore(s)</strong> para compensar
        </p>
    `;
    
    // Mostra seção de resultados
    resultDiv.classList.remove('hidden');
    resultDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Cria card de transporte
function createTransportCard(result, isBest) {
    const card = document.createElement('div');
    const emissionClass = getEmissionClass(result.emission);
    
    card.className = `transport-card ${emissionClass}`;
    card.innerHTML = `
        <div class="transport-info-left">
            <div class="transport-type">${result.name}</div>
            <div class="transport-details">
                ${result.shareable ? '👥 Emissão por pessoa' : '📊 Emissão total'}
            </div>
            <div class="trees-info">🌳 ${result.trees} árvore(s) necessária(s)</div>
        </div>
        <div class="transport-emission">
            <span class="emission-number">${result.emission.toFixed(2)}</span>
            <span class="emission-unit">kg CO2</span>
        </div>
    `;
    
    return card;
}

// Retorna classe CSS baseada no nível de emissão
function getEmissionClass(emission) {
    if (emission < 5) {
        return 'low-emission';
    } else if (emission < 20) {
        return 'medium-emission';
    } else {
        return 'high-emission';
    }
}

// Reseta a calculadora
function resetCalculator() {
    form.reset();
    resultDiv.classList.add('hidden');
    routeInfo.classList.add('hidden');
    currentRoute = null;
    
    // Limpa marcadores do mapa
    if (originMarker) map.removeLayer(originMarker);
    if (destinationMarker) map.removeLayer(destinationMarker);
    if (routeLine) map.removeLayer(routeLine);
    
    // Reseta zoom do mapa
    map.setView([-15.7801, -47.9292], 4);
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    initMap();
    console.log('Calculadora de Emissão de CO2 com mapa carregada!');
});
