/**
 * relatorios.js - Finanças Pessoais
 * Módulo de relatórios e análises financeiras consolidadas:
 * - Filtros por período (Todo o período, Mês atual, Últimos 3 meses, Últimos 6 meses)
 * - Indicadores consolidados do período
 * - Ranking das categorias com maiores gastos
 * - Tabela analítica com detalhamento de despesas e receitas
 */

import {
  obterMovimentacoes,
  formatarMoeda,
  inscreverAtualizacao
} from './data.js';

let periodoSelecionado = 'todos'; // 'todos' | 'mes-atual' | 'ultimos-3' | 'ultimos-6'

/**
 * Filtra a lista de movimentações conforme o período selecionado
 * @param {Array} lista 
 * @param {string} periodo 
 * @returns {Array}
 */
export function filtrarPorPeriodo(lista, periodo) {
  if (periodo === 'todos') return lista;

  const hoje = new Date();
  const anoAtual = hoje.getFullYear();
  const mesAtual = hoje.getMonth(); // 0 a 11

  return lista.filter(item => {
    if (!item.data) return false;
    const [anoStr, mesStr] = item.data.split('-');
    const ano = parseInt(anoStr, 10);
    const mes = parseInt(mesStr, 10) - 1;

    if (periodo === 'mes-atual') {
      return ano === anoAtual && mes === mesAtual;
    }

    if (periodo === 'ultimos-3') {
      const dataItem = new Date(ano, mes, 1);
      const dataLimite = new Date(anoAtual, mesAtual - 2, 1);
      return dataItem >= dataLimite && dataItem <= hoje;
    }

    if (periodo === 'ultimos-6') {
      const dataItem = new Date(ano, mes, 1);
      const dataLimite = new Date(anoAtual, mesAtual - 5, 1);
      return dataItem >= dataLimite && dataItem <= hoje;
    }

    return true;
  });
}

/**
 * Renderiza os cartões de indicadores consolidados do relatório
 * @param {HTMLElement} container 
 * @param {Array} dadosPeriodo 
 */
function renderizarMetricasPeriodo(container, dadosPeriodo) {
  if (!container) return;

  let totalRec = 0;
  let totalDesp = 0;

  dadosPeriodo.forEach(item => {
    if (item.tipo === 'receita') totalRec += item.valor;
    if (item.tipo === 'despesa') totalDesp += item.valor;
  });

  const saldoPeriodo = totalRec - totalDesp;
  const taxaPoupanca = totalRec > 0 ? ((totalRec - totalDesp) / totalRec) * 100 : 0;

  container.innerHTML = `
    <div class="card-kpi">
      <span class="kpi-titulo">Receitas no Período</span>
      <strong class="kpi-valor texto-sucesso">+ ${formatarMoeda(totalRec)}</strong>
      <span class="kpi-subtitulo">${dadosPeriodo.filter(i => i.tipo === 'receita').length} entrada(s)</span>
    </div>
    <div class="card-kpi">
      <span class="kpi-titulo">Despesas no Período</span>
      <strong class="kpi-valor texto-perigo">- ${formatarMoeda(totalDesp)}</strong>
      <span class="kpi-subtitulo">${dadosPeriodo.filter(i => i.tipo === 'despesa').length} saída(s)</span>
    </div>
    <div class="card-kpi">
      <span class="kpi-titulo">Resultado Líquido</span>
      <strong class="kpi-valor ${saldoPeriodo >= 0 ? 'texto-sucesso' : 'texto-perigo'}">${formatarMoeda(saldoPeriodo)}</strong>
      <span class="kpi-subtitulo">${taxaPoupanca >= 0 ? taxaPoupanca.toFixed(1) + '% poupado' : 'Déficit no período'}</span>
    </div>
  `;
}

/**
 * Renderiza o Ranking das 5 maiores categorias de gastos
 * @param {HTMLElement} container 
 * @param {Array} dadosPeriodo 
 */
function renderizarRankingMaioresGastos(container, dadosPeriodo) {
  if (!container) return;

  const gastosPorCategoria = {};
  let totalDespesasPeriodo = 0;

  dadosPeriodo.forEach(item => {
    if (item.tipo === 'despesa') {
      gastosPorCategoria[item.categoria] = (gastosPorCategoria[item.categoria] || 0) + item.valor;
      totalDespesasPeriodo += item.valor;
    }
  });

  const ranking = Object.entries(gastosPorCategoria)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  container.innerHTML = '';

  if (ranking.length === 0) {
    container.innerHTML = '<p class="legenda-vazia">Nenhuma despesa registrada para o período selecionado.</p>';
    return;
  }

  const maxGasto = ranking[0][1];

  ranking.forEach(([categoria, valor], index) => {
    const itemRanking = document.createElement('div');
    itemRanking.className = 'item-ranking';

    const linhaTopo = document.createElement('div');
    linhaTopo.className = 'linha-topo-ranking';

    const info = document.createElement('div');
    info.className = 'info-posicao-ranking';

    const posicao = document.createElement('span');
    posicao.className = 'numero-posicao';
    posicao.textContent = `#${index + 1}`;

    const nome = document.createElement('strong');
    nome.className = 'nome-categoria-ranking';
    nome.textContent = categoria;

    info.append(posicao, nome);

    const percentualDoTotal = totalDespesasPeriodo > 0 ? ((valor / totalDespesasPeriodo) * 100).toFixed(1) : 0;
    const valorEl = document.createElement('div');
    valorEl.className = 'valores-ranking';
    valorEl.innerHTML = `<strong>${formatarMoeda(valor)}</strong> <small class="porcentagem-ranking">(${percentualDoTotal}%)</small>`;

    linhaTopo.append(info, valorEl);

    // Barra proporcional
    const trilha = document.createElement('div');
    trilha.className = 'trilha-ranking';

    const barra = document.createElement('div');
    barra.className = 'barra-ranking';
    barra.style.width = `${(valor / maxGasto) * 100}%`;

    trilha.append(barra);
    itemRanking.append(linhaTopo, trilha);
    container.append(itemRanking);
  });
}

/**
 * Renderiza a tabela analítica de distribuição por categorias
 * @param {HTMLElement} tbodyElement 
 * @param {Array} dadosPeriodo 
 */
function renderizarTabelaAnalitica(tbodyElement, dadosPeriodo) {
  if (!tbodyElement) return;

  const totaisCategorias = {};
  let totalDespesas = 0;

  dadosPeriodo.forEach(item => {
    if (item.tipo === 'despesa') {
      if (!totaisCategorias[item.categoria]) {
        totaisCategorias[item.categoria] = { total: 0, quantidade: 0 };
      }
      totaisCategorias[item.categoria].total += item.valor;
      totaisCategorias[item.categoria].quantidade += 1;
      totalDespesas += item.valor;
    }
  });

  tbodyElement.innerHTML = '';

  const categorias = Object.entries(totaisCategorias).sort((a, b) => b[1].total - a[1].total);

  if (categorias.length === 0) {
    const tr = document.createElement('tr');
    tr.innerHTML = '<td colspan="4" class="td-vazio">Sem dados de despesas no período selecionado.</td>';
    tbodyElement.append(tr);
    return;
  }

  categorias.forEach(([categoria, dados]) => {
    const tr = document.createElement('tr');

    const tdCat = document.createElement('td');
    tdCat.textContent = categoria;

    const tdQtd = document.createElement('td');
    tdQtd.textContent = `${dados.quantidade} ${dados.quantidade === 1 ? 'registro' : 'registros'}`;

    const tdValor = document.createElement('td');
    tdValor.className = 'col-valor valor-negativo';
    tdValor.textContent = formatarMoeda(dados.total);

    const tdPercent = document.createElement('td');
    const pct = totalDespesas > 0 ? ((dados.total / totalDespesas) * 100).toFixed(1) : 0;
    tdPercent.textContent = `${pct}%`;

    tr.append(tdCat, tdQtd, tdValor, tdPercent);
    tbodyElement.append(tr);
  });
}

/**
 * Inicializa a tela de relatórios
 * @param {Object} elementosDOM 
 */
export function inicializarRelatorios(elementosDOM) {
  const {
    selectFiltroPeriodo,
    containerMetricasRelatorio,
    containerRankingGastos,
    tbodyAnaliticoRelatorios
  } = elementosDOM;

  const atualizarVisao = () => {
    const todasMovimentacoes = obterMovimentacoes();
    const dadosFiltrados = filtrarPorPeriodo(todasMovimentacoes, periodoSelecionado);

    renderizarMetricasPeriodo(containerMetricasRelatorio, dadosFiltrados);
    renderizarRankingMaioresGastos(containerRankingGastos, dadosFiltrados);
    renderizarTabelaAnalitica(tbodyAnaliticoRelatorios, dadosFiltrados);
  };

  if (selectFiltroPeriodo) {
    selectFiltroPeriodo.addEventListener('change', (e) => {
      periodoSelecionado = e.target.value;
      atualizarVisao();
    });
  }

  inscreverAtualizacao(atualizarVisao);
  atualizarVisao();
}
