# Calculadora de Emissão de CO2 para Viagens

## 📋 Descrição
Projeto de calculadora web para estimar a emissão de CO2 em diferentes tipos de viagens (carro, avião, ônibus, trem, etc.).

## 🎯 Objetivo
Conscientizar usuários sobre o impacto ambiental de suas viagens e ajudar na escolha de meios de transporte mais sustentáveis.

## 🛠️ Tecnologias Utilizadas
- **HTML5**: Estrutura da página
- **CSS3**: Estilização e responsividade
- **JavaScript**: Lógica de cálculo e interatividade
- **Leaflet**: Biblioteca de mapas interativos
- **OpenStreetMap**: Base de mapas e dados geográficos
- **Nominatim API**: Geocodificação e autocomplete de localizações
- **OSRM API**: Cálculo de rotas e distâncias reais

## 📁 Estrutura do Projeto
```
calculadora/
├── index.html          # Página principal com mapa interativo
├── css/
│   └── styles.css      # Estilos responsivos e animações
├── js/
│   └── script.js       # Lógica de cálculo, mapa e autocomplete
└── README.md           # Documentação do projeto
```

## 🎨 Características Visuais
- Design moderno com gradientes
- Cards coloridos por nível de emissão:
  - 🟢 **Verde**: Baixa emissão (< 5 kg CO2)
  - 🟠 **Laranja**: Média emissão (5-20 kg CO2)
  - 🔴 **Vermelho**: Alta emissão (> 20 kg CO2)
- Animações suaves e transições
- Interface 100% responsiva
- Mapa interativo em tela cheia

## 🚀 Como Usar
1. Abra o arquivo `index.html` em seu navegador
2. **Digite o local de origem** no primeiro campo (ex: "São Paulo, SP")
   - Aguarde as sugestões de autocomplete aparecerem
   - Selecione a localização desejada
3. **Digite o destino** no segundo campo (ex: "Rio de Janeiro, RJ")
   - Selecione a localização da lista de sugestões
4. Clique em **"🔍 Buscar Rota"**
   - O mapa mostrará a rota com marcadores de origem e destino
   - A distância e tempo estimado serão calculados automaticamente
5. (Opcional) Ajuste o **número de passageiros** para veículos pessoais
6. Clique em **"Calcular Emissões"**
7. Visualize os resultados **comparativos de todos os meios de transporte**
   - Ordenados do mais sustentável ao menos sustentável
   - Com destaque para a melhor opção ambiental

## 📊 Fatores de Emissão (estimativas médias)
- **🚗 Carro (gasolina)**: ~120g CO2/km
- **🚙 Carro (diesel)**: ~110g CO2/km
- **⚡ Carro (elétrico)**: ~50g CO2/km
- **✈️ Avião (voo curto)**: ~250g CO2/km
- **🛫 Avião (voo longo)**: ~150g CO2/km
- **🚌 Ônibus**: ~50g CO2/km
- **🚆 Trem (elétrico)**: ~14g CO2/km
- **🏍️ Motocicleta**: ~100g CO2/km

*Valores calculados por passageiro para veículos compartilháveis (carros e motos)*

## 🌱 Funcionalidades
- [x] **Mapa interativo** com Leaflet e OpenStreetMap
- [x] **Autocomplete de cidades** para origem e destino
- [x] **Cálculo automático de distância** usando rotas reais (OSRM)
- [x] **Comparação entre todos os meios de transporte**
- [x] **Visualização de rota no mapa** com marcadores e linha de trajeto
- [x] **Tempo estimado de viagem** (modo carro)
- [x] **Cálculo de emissão por passageiro** para veículos compartilháveis
- [x] **Cards coloridos** por nível de emissão (verde/laranja/vermelho)
- [x] **Destaque da melhor opção ambiental**
- [x] **Cálculo de árvores necessárias** para compensação
- [x] **Interface responsiva** para mobile e desktop
- [ ] Visualização gráfica dos resultados (gráfico de barras)
- [ ] Dicas de compensação de carbono
- [ ] Histórico de viagens calculadas
- [ ] Exportação de relatórios em PDF

## 📝 Roteiro de Desenvolvimento

### ✅ Fase 1: Estrutura Básica (Concluída)
1. ✅ Criar HTML com formulário de entrada
2. ✅ Estilizar página com CSS
3. ✅ Implementar cálculos básicos em JavaScript

### ✅ Fase 2: Funcionalidades Avançadas (Concluída)
1. ✅ Integração com mapa interativo (Leaflet)
2. ✅ Implementar autocomplete de localizações
3. ✅ Cálculo de rotas reais com OSRM
4. ✅ Sistema de comparação entre todos os transportes
5. ✅ Validações de formulário

### 🚧 Fase 3: Melhorias (Em Andamento)
1. [ ] Adicionar gráficos e visualizações (Chart.js)
2. [x] Implementar responsividade completa
3. [x] Adicionar animações e transições
4. [ ] Sistema de histórico com localStorage
5. [ ] Exportação de relatórios

## 👨‍💻 Autor
Miguel

## 📄 Licença
Projeto educacional - Livre para uso e modificação
