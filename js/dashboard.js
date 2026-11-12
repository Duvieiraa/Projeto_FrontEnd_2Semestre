/**
 * dashboard.js - Finanças Pessoais
 * Módulo responsável pela renderização da Visão Geral (Dashboard):
 * - 4 KPIs dinâmicos (Saldo Disponível, Receitas, Despesas, Resultado)
 * - Gráficos nativos em HTML5 Canvas (Sem bibliotecas externas)
 * - Lista resumida das transações recentes
 * - Mini widget do plano de gastos
 */

import {
  obterMovimentacoes,
  calcularTotais,
  calcularGastosPorCategoria,
  formatarMoeda,
  formatarData,
  obterOrcamentos,
  inscreverAtualizacao
} from './data.js';

// Paleta de cores para os gráficos nativos (estilo fintech moderno)
const CORES_CATEGORIAS = [
  '#0f4c3a', // Verde escuro esmeralda
  '#1ab273', // Verde menta
  '#2a9d8f', // Turquesa
  '#e76f51', // Coral terracota
  '#f4a261', // Laranja suave
  '#e63946', // Vermelho suave
  '#457b9d', // Azul ardósia
  '#8338ec'  // Roxo moderno
];

/**
 * Atualiza os valores numéricos e badges dos 4 cartões de métricas (KPIs)
 * @param {Object} elementos - Referências aos elementos do DOM
 */
export function atualizarCartoesKPI(elementos) {
  const { kpiSaldo, kpiReceitas, kpiDespesas, kpiResultado, kpiTaxaPoupanca } = elementos;
  const totais = calcularTotais();

  // 1. Saldo Disponível
  if (kpiSaldo) {
    kpiSaldo.textContent = formatarMoeda(totais.saldoDisponivel);
    // Aplica cor semântica caso o saldo esteja negativo
    if (totais.saldoDisponivel < 0) {
      kpiSaldo.classList.add('texto-perigo');
      kpiSaldo.classList.remove('texto-sucesso');
    } else {
      kpiSaldo.classList.add('texto-sucesso');
      kpiSaldo.classList.remove('texto-perigo');
    }
  }

  // 2. Total de Receitas
  if (kpiReceitas) {
    kpiReceitas.textContent = formatarMoeda(totais.totalReceitas);
  }

  // 3. Total de Despesas
  if (kpiDespesas) {
    kpiDespesas.textContent = formatarMoeda(totais.totalDespesas);
  }

  // 4. Resultado Financeiro e Taxa de Economia
  if (kpiResultado) {
    kpiResultado.textContent = formatarMoeda(totais.resultadoMes);
    if (totais.resultadoMes < 0) {
      kpiResultado.classList.add('texto-perigo');
      kpiResultado.classList.remove('texto-sucesso');
    } else {
      kpiResultado.classList.add('texto-sucesso');
      kpiResultado.classList.remove('texto-perigo');
    }
  }

  if (kpiTaxaPoupanca) {
    kpiTaxaPoupanca.textContent = `${totais.taxaEconomia.toFixed(1)}% economizado`;
  }
}

/**
 * Ajusta resolução de um elemento Canvas para suportar telas de alta densidade (Retina/DPI)
 * @param {HTMLCanvasElement} canvas 
 * @returns {CanvasRenderingContext2D}
 */
function prepararCanvasDPI(canvas) {
  if (!canvas) return null;
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();

  // Define tamanho real em pixels do canvas
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;

  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);
  return ctx;
}

/**
 * Desenha o Gráfico 1: Comparativo de Receitas vs Despesas (Barras Verticais em Canvas Puro)
 * @param {HTMLCanvasElement} canvas 
 */
export function desenharGraficoComparativo(canvas) {
  if (!canvas) return;
  const ctx = prepararCanvasDPI(canvas);
  if (!ctx) return;

  const rect = canvas.getBoundingClientRect();
  const largura = rect.width;
  const altura = rect.height;

  // Limpa o canvas
  ctx.clearRect(0, 0, largura, altura);

  const totais = calcularTotais();
  const dados = [
    { rotulo: 'Receitas', valor: totais.totalReceitas, cor: '#1ab273' },
    { rotulo: 'Despesas', valor: totais.totalDespesas, cor: '#e65c5c' },
    { rotulo: 'Saldo Líquido', valor: Math.max(0, totais.saldoDisponivel), cor: '#0f4c3a' }
  ];

  const maxValor = Math.max(...dados.map(d => d.valor), 100);
  const margemInferior = 40;
  const margemSuperior = 30;
  const margemLateral = 30;
  const alturaUtil = altura - margemInferior - margemSuperior;
  const larguraUtil = largura - (margemLateral * 2);

  // Linhas guia de fundo
  ctx.strokeStyle = '#eef2f0';
  ctx.lineWidth = 1;
  for (let i = 0; i <= 4; i++) {
    const y = margemSuperior + (alturaUtil * (i / 4));
    ctx.beginPath();
    ctx.moveTo(margemLateral, y);
    ctx.lineTo(largura - margemLateral, y);
    ctx.stroke();
  }

  // Desenha as barras
  const qtdBarras = dados.length;
  const larguraBarra = Math.min(60, (larguraUtil / qtdBarras) * 0.55);
  const espacoPorBarra = larguraUtil / qtdBarras;

  dados.forEach((item, index) => {
    const xCentro = margemLateral + (espacoPorBarra * index) + (espacoPorBarra / 2);
    const x = xCentro - (larguraBarra / 2);
    const alturaBarra = (item.valor / maxValor) * alturaUtil;
    const y = margemSuperior + alturaUtil - alturaBarra;

    // Barra com cantos arredondados no topo
    ctx.fillStyle = item.cor;
    const raio = Math.min(8, larguraBarra / 2);

    ctx.beginPath();
    ctx.moveTo(x, margemSuperior + alturaUtil);
    ctx.lineTo(x, y + raio);
    ctx.quadraticCurveTo(x, y, x + raio, y);
    ctx.lineTo(x + larguraBarra - raio, y);
    ctx.quadraticCurveTo(x + larguraBarra, y, x + larguraBarra, y + raio);
    ctx.lineTo(x + larguraBarra, margemSuperior + alturaUtil);
    ctx.closePath();
    ctx.fill();

    // Valor acima da barra
    ctx.fillStyle = '#1e293b';
    ctx.font = '600 12px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(formatarMoeda(item.valor), xCentro, Math.max(16, y - 8));

    // Rótulo abaixo da barra
    ctx.fillStyle = '#64748b';
    ctx.font = '500 12px Inter, sans-serif';
    ctx.fillText(item.rotulo, xCentro, altura - 12);
  });
}

/**
 * Desenha o Gráfico 2: Distribuição de Despesas por Categoria (Gráfico Rosca / Donut em Canvas Puro)
 * @param {HTMLCanvasElement} canvas 
 * @param {HTMLElement} containerLegenda 
 */
export function desenharGraficoCategorias(canvas, containerLegenda) {
  if (!canvas) return;
  const ctx = prepararCanvasDPI(canvas);
  if (!ctx) return;

  const rect = canvas.getBoundingClientRect();
  const largura = rect.width;
  const altura = rect.height;

  ctx.clearRect(0, 0, largura, altura);

  const gastos = calcularGastosPorCategoria();
  const itens = Object.entries(gastos)
    .filter(([_, valor]) => valor > 0)
    .sort((a, b) => b[1] - a[1]);

  const totalGasto = itens.reduce((acc, [_, v]) => acc + v, 0);

  // Se não houver despesas cadastradas
  if (totalGasto === 0) {
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 20;
    ctx.beginPath();
    ctx.arc(largura / 2, altura / 2, Math.min(largura, altura) * 0.32, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = '#94a3b8';
    ctx.font = '500 13px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Sem despesas', largura / 2, altura / 2);

    if (containerLegenda) {
      containerLegenda.innerHTML = '<p class="legenda-vazia">Nenhuma despesa para exibir.</p>';
    }
    return;
  }

  const centroX = largura / 2;
  const centroY = altura / 2;
  const raioExterno = Math.min(largura, altura) * 0.38;
  const espessura = 28;

  let anguloInicial = -Math.PI / 2;

  // Legenda HTML para acessibilidade e clareza
  if (containerLegenda) {
    containerLegenda.innerHTML = '';
  }

  itens.forEach(([categoria, valor], index) => {
    const proporcao = valor / totalGasto;
    const anguloFatia = proporcao * (Math.PI * 2);
    const anguloFinal = anguloInicial + anguloFatia;
    const cor = CORES_CATEGORIAS[index % CORES_CATEGORIAS.length];

    // Arco da rosca
    ctx.beginPath();
    ctx.arc(centroX, centroY, raioExterno, anguloInicial, anguloFinal);
    ctx.strokeStyle = cor;
    ctx.lineWidth = espessura;
    ctx.lineCap = 'butt';
    ctx.stroke();

    anguloInicial = anguloFinal;

    // Constrói item da legenda
    if (containerLegenda) {
      const itemLegenda = document.createElement('div');
      itemLegenda.className = 'legenda-item';

      const bolinha = document.createElement('span');
      bolinha.className = 'legenda-cor';
      bolinha.style.backgroundColor = cor;

      const textoNome = document.createElement('span');
      textoNome.className = 'legenda-nome';
      textoNome.textContent = categoria;

      const percentual = ((valor / totalGasto) * 100).toFixed(0);
      const textoValor = document.createElement('span');
      textoValor.className = 'legenda-valor';
      textoValor.textContent = `${formatarMoeda(valor)} (${percentual}%)`;

      itemLegenda.append(bolinha, textoNome, textoValor);
      containerLegenda.append(itemLegenda);
    }
  });

  // Texto central da rosca
  ctx.fillStyle = '#64748b';
  ctx.font = '500 11px Inter, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('Total Gasto', centroX, centroY - 10);

  ctx.fillStyle = '#0f4c3a';
  ctx.font = '700 14px Inter, sans-serif';
  ctx.fillText(formatarMoeda(totalGasto), centroX, centroY + 10);
}

/**
 * Desenha o Gráfico 3: Fluxo Mensal / Evolução das movimentações
 * @param {HTMLCanvasElement} canvas 
 */
export function desenharGraficoEvolucao(canvas) {
  if (!canvas) return;
  const ctx = prepararCanvasDPI(canvas);
  if (!ctx) return;

  const rect = canvas.getBoundingClientRect();
  const largura = rect.width;
  const altura = rect.height;

  ctx.clearRect(0, 0, largura, altura);

  const movimentacoes = obterMovimentacoes();
  
  // Agrupa movimentações pelos últimos 5 meses ou meses existentes
  const mesesMap = {};
  const nomesMeses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

  // Inicializa últimos 4 meses padrão para referência visual rica
  const hoje = new Date();
  for (let i = 3; i >= 0; i--) {
    const d = new Date(hoje.getFullYear(), hoje.getMonth() - i, 1);
    const chave = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const rotulo = nomesMeses[d.getMonth()];
    mesesMap[chave] = { rotulo, receitas: 0, despesas: 0 };
  }

  // Preenche dados reais
  movimentacoes.forEach(m => {
    if (!m.data) return;
    const partes = m.data.split('-');
    if (partes.length >= 2) {
      const chave = `${partes[0]}-${partes[1]}`;
      if (!mesesMap[chave]) {
        const mesIdx = parseInt(partes[1], 10) - 1;
        mesesMap[chave] = { rotulo: nomesMeses[mesIdx] || chave, receitas: 0, despesas: 0 };
      }
      if (m.tipo === 'receita') mesesMap[chave].receitas += m.valor;
      if (m.tipo === 'despesa') mesesMap[chave].despesas += m.valor;
    }
  });

  const entradasMeses = Object.values(mesesMap);
  const maxValor = Math.max(
    ...entradasMeses.flatMap(m => [m.receitas, m.despesas]),
    500
  );

  const margemLateral = 30;
  const margemSuperior = 30;
  const margemInferior = 35;
  const alturaUtil = altura - margemSuperior - margemInferior;
  const larguraUtil = largura - (margemLateral * 2);

  // Linhas de grade sutis
  ctx.strokeStyle = '#f1f5f3';
  ctx.lineWidth = 1;
  for (let i = 0; i <= 3; i++) {
    const y = margemSuperior + (alturaUtil * (i / 3));
    ctx.beginPath();
    ctx.moveTo(margemLateral, y);
    ctx.lineTo(largura - margemLateral, y);
    ctx.stroke();
  }

  const espacoGrupo = larguraUtil / entradasMeses.length;
  const larguraBarra = Math.min(20, espacoGrupo * 0.28);

  entradasMeses.forEach((mes, idx) => {
    const xCentro = margemLateral + (espacoGrupo * idx) + (espacoGrupo / 2);

    // Barra de Receita (Verde)
    const altRec = (mes.receitas / maxValor) * alturaUtil;
    const yRec = margemSuperior + alturaUtil - altRec;
    ctx.fillStyle = '#1ab273';
    ctx.fillRect(xCentro - larguraBarra - 2, yRec, larguraBarra, altRec);

    // Barra de Despesa (Coral)
    const altDesp = (mes.despesas / maxValor) * alturaUtil;
    const yDesp = margemSuperior + alturaUtil - altDesp;
    ctx.fillStyle = '#e65c5c';
    ctx.fillRect(xCentro + 2, yDesp, larguraBarra, altDesp);

    // Rótulo do Mês
    ctx.fillStyle = '#64748b';
    ctx.font = '500 11px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(mes.rotulo, xCentro, altura - 10);
  });
}

/**
 * Renderiza o widget de resumo das últimas 5 transações na Visão Geral
 * @param {HTMLElement} containerLista 
 */
export function renderizarTransacoesRecentes(containerLista) {
  if (!containerLista) return;

  const todas = obterMovimentacoes();
  // Ordena pelas mais recentes
  const recentes = [...todas].sort((a, b) => new Date(b.data) - new Date(a.data)).slice(0, 5);

  containerLista.innerHTML = '';

  if (recentes.length === 0) {
    containerLista.innerHTML = '<p class="lista-vazia-texto">Nenhuma transação recente.</p>';
    return;
  }

  recentes.forEach(item => {
    const itemEl = document.createElement('div');
    itemEl.className = 'item-transacao-recente';

    const info = document.createElement('div');
    info.className = 'info-recente';

    const titulo = document.createElement('strong');
    titulo.className = 'titulo-recente';
    titulo.textContent = item.descricao;

    const meta = document.createElement('span');
    meta.className = 'meta-recente';
    meta.textContent = `${formatarData(item.data)} • ${item.categoria}`;

    info.append(titulo, meta);

    const valor = document.createElement('span');
    valor.className = `valor-recente ${item.tipo === 'receita' ? 'positivo' : 'negativo'}`;
    valor.textContent = (item.tipo === 'receita' ? '+ ' : '- ') + formatarMoeda(item.valor);

    itemEl.append(info, valor);
    containerLista.append(itemEl);
  });
}

/**
 * Inicializa a Visão Geral e inscreve para atualizações
 * @param {Object} elementosDOM 
 */
export function inicializarDashboard(elementosDOM) {
  const renderizarTudo = () => {
    atualizarCartoesKPI(elementosDOM);
    if (elementosDOM.canvasComparativo) desenharGraficoComparativo(elementosDOM.canvasComparativo);
    if (elementosDOM.canvasCategorias) desenharGraficoCategorias(elementosDOM.canvasCategorias, elementosDOM.legendaCategorias);
    if (elementosDOM.canvasEvolucao) desenharGraficoEvolucao(elementosDOM.canvasEvolucao);
    if (elementosDOM.containerRecentes) renderizarTransacoesRecentes(elementosDOM.containerRecentes);
  };

  // Re-desenha gráficos ao redimensionar a janela para garantir nitidez
  window.addEventListener('resize', () => {
    renderizarTudo();
  });

  inscreverAtualizacao(renderizarTudo);
  renderizarTudo();
}
