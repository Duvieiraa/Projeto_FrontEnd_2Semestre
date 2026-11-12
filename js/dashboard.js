/**
 * dashboard.js - Finanças Pessoais
 * Módulo responsável pela renderização da Visão Geral (Dashboard):
 * - 4 KPIs dinâmicos (Saldo Disponível, Receitas, Despesas, Resultado)
 * - Painel de Dados Reais: Comparativo Receitas vs Despesas (substituindo imagens/canvas)
 * - Painel de Dados Reais: Distribuição de Despesas por Categoria com barras e percentuais exatos
 * - Painel de Dados Reais: Resumo do Fluxo Mensal
 * - Lista detalhada das últimas transações
 */

import {
  obterMovimentacoes,
  calcularTotais,
  calcularGastosPorCategoria,
  formatarMoeda,
  formatarData,
  inscreverAtualizacao
} from './data.js';

// Cores temáticas para identificação visual das categorias
const CORES_CATEGORIAS = [
  '#0f4c3a', // Verde escuro esmeralda
  '#1ab273', // Verde menta
  '#2a9d8f', // Turquesa
  '#e76f51', // Coral terracota
  '#f4a261', // Laranja suave
  '#d94343', // Vermelho suave
  '#3b82f6', // Azul moderno
  '#8b5cf6'  // Roxo moderno
];

/**
 * Atualiza os valores dos 4 cartões de métricas principais (KPIs)
 * @param {Object} elementos - Referências aos elementos do DOM
 */
export function atualizarCartoesKPI(elementos) {
  const { kpiSaldo, kpiReceitas, kpiDespesas, kpiResultado, kpiTaxaPoupanca } = elementos;
  const totais = calcularTotais();

  // 1. Saldo Disponível
  if (kpiSaldo) {
    kpiSaldo.textContent = formatarMoeda(totais.saldoDisponivel);
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
 * Renderiza o Painel de Dados Reais: Receitas vs Despesas
 * Apresenta métricas exatas e proporção visual baseadas nas movimentações cadastradas
 * @param {HTMLElement} container 
 */
export function renderizarPainelComparativo(container) {
  if (!container) return;

  const movimentacoes = obterMovimentacoes();
  const totais = calcularTotais();

  const receitas = movimentacoes.filter(m => m.tipo === 'receita');
  const despesas = movimentacoes.filter(m => m.tipo === 'despesa');

  // Encontra a maior receita e maior despesa
  const maiorReceita = receitas.length > 0 
    ? receitas.reduce((max, cur) => cur.valor > max.valor ? cur : max, receitas[0])
    : null;

  const maiorDespesa = despesas.length > 0 
    ? despesas.reduce((max, cur) => cur.valor > max.valor ? cur : max, despesas[0])
    : null;

  const totalGeral = totais.totalReceitas + totais.totalDespesas;
  const pctReceita = totalGeral > 0 ? ((totais.totalReceitas / totalGeral) * 100).toFixed(1) : 0;
  const pctDespesa = totalGeral > 0 ? ((totais.totalDespesas / totalGeral) * 100).toFixed(1) : 0;

  container.innerHTML = `
    <div class="painel-comparativo-real">
      <!-- Barra Proporcional de Entradas vs Saídas -->
      <div>
        <div class="legenda-barra-dupla" style="margin-bottom: 8px;">
          <span style="color: var(--color-receita);">Receitas: ${pctReceita}%</span>
          <span style="color: var(--color-despesa);">Despesas: ${pctDespesa}%</span>
        </div>
        <div class="barra-proporcional-dupla">
          <div class="segmento-barra-receita" style="width: ${pctReceita}%;"></div>
          <div class="segmento-barra-despesa" style="width: ${pctDespesa}%;"></div>
        </div>
      </div>

      <!-- Detalhamento em Cartões -->
      <div class="grid-comparativo-cards">
        <div class="card-mini-comparativo receita">
          <div class="mini-cabecalho">
            <span>Total Entradas</span>
            <span class="badge-tipo badge-receita">+ ${receitas.length} reg.</span>
          </div>
          <strong class="mini-valor texto-sucesso">${formatarMoeda(totais.totalReceitas)}</strong>
          <span class="mini-info-adicional">
            ${maiorReceita ? `Maior entrada: <strong>${maiorReceita.descricao}</strong> (${formatarMoeda(maiorReceita.valor)})` : 'Nenhuma receita'}
          </span>
        </div>

        <div class="card-mini-comparativo despesa">
          <div class="mini-cabecalho">
            <span>Total Saídas</span>
            <span class="badge-tipo badge-despesa">- ${despesas.length} reg.</span>
          </div>
          <strong class="mini-valor texto-perigo">${formatarMoeda(totais.totalDespesas)}</strong>
          <span class="mini-info-adicional">
            ${maiorDespesa ? `Maior saída: <strong>${maiorDespesa.descricao}</strong> (${formatarMoeda(maiorDespesa.valor)})` : 'Nenhuma despesa'}
          </span>
        </div>
      </div>

      <!-- Linha de Balanço e Economia -->
      <div class="linha-resumo-balanco">
        <div>
          <span style="color: var(--text-muted); font-size: 0.8rem; display: block;">Saldo Líquido em Caixa</span>
          <strong class="${totais.saldoDisponivel >= 0 ? 'texto-sucesso' : 'texto-perigo'}" style="font-size: 1.1rem;">
            ${formatarMoeda(totais.saldoDisponivel)}
          </strong>
        </div>
        <div>
          <span class="kpi-badge-poupanca" style="font-size: 0.82rem; padding: 4px 12px;">
            ${totais.taxaEconomia.toFixed(1)}% de economia mensal
          </span>
        </div>
      </div>
    </div>
  `;
}

/**
 * Renderiza o Painel de Dados Reais: Despesas por Categoria
 * Substitui o gráfico por um detalhamento visual com valores reais e barras proporcionais
 * @param {HTMLElement} container 
 */
export function renderizarPainelCategorias(container) {
  if (!container) return;

  const movimentacoes = obterMovimentacoes();
  const gastosPorCategoria = calcularGastosPorCategoria();
  const totais = calcularTotais();

  const totalDespesas = totais.totalDespesas;

  // Filtra apenas categorias com gastos reais e ordena do maior para o menor
  const categoriasAtivas = Object.entries(gastosPorCategoria)
    .filter(([_, valor]) => valor > 0)
    .sort((a, b) => b[1] - a[1]);

  container.innerHTML = '';

  if (categoriasAtivas.length === 0) {
    container.innerHTML = '<p class="legenda-vazia">Nenhuma despesa registrada no momento.</p>';
    return;
  }

  const painel = document.createElement('div');
  painel.className = 'painel-categorias-real';

  categoriasAtivas.forEach(([categoria, valor], index) => {
    const percentual = totalDespesas > 0 ? ((valor / totalDespesas) * 100).toFixed(1) : 0;
    const cor = CORES_CATEGORIAS[index % CORES_CATEGORIAS.length];

    // Conta quantidade real de lançamentos desta categoria
    const qtdLancamentos = movimentacoes.filter(m => m.tipo === 'despesa' && m.categoria === categoria).length;

    const itemEl = document.createElement('div');
    itemEl.className = 'item-categoria-real';

    itemEl.innerHTML = `
      <div class="item-categoria-topo">
        <div class="item-categoria-nome-wrapper">
          <span class="categoria-dot" style="background-color: ${cor};"></span>
          <span class="item-categoria-nome">${categoria}</span>
        </div>
        <div class="item-categoria-valor-wrapper">
          <span class="item-categoria-valor">${formatarMoeda(valor)}</span>
          <span class="item-categoria-pct">(${percentual}%)</span>
        </div>
      </div>

      <div class="item-categoria-trilha">
        <div class="item-categoria-progresso" style="width: ${percentual}%; background-color: ${cor};"></div>
      </div>

      <div class="item-categoria-rodape">
        <span>${qtdLancamentos} ${qtdLancamentos === 1 ? 'lançamento' : 'lançamentos'}</span>
        <span>${formatarMoeda(valor)} do total de despesas</span>
      </div>
    `;

    painel.append(itemEl);
  });

  container.append(painel);
}

/**
 * Renderiza o Painel de Evolução Mensal com dados reais agrupados
 * @param {HTMLElement} container 
 */
export function renderizarPainelEvolucao(container) {
  if (!container) return;

  const movimentacoes = obterMovimentacoes();
  const mesesMap = {};
  const nomesMeses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

  movimentacoes.forEach(m => {
    if (!m.data) return;
    const partes = m.data.split('-');
    if (partes.length >= 2) {
      const ano = partes[0];
      const mesNum = parseInt(partes[1], 10) - 1;
      const chave = `${ano}-${partes[1]}`;
      const nomeMes = `${nomesMeses[mesNum]} / ${ano}`;

      if (!mesesMap[chave]) {
        mesesMap[chave] = { nome: nomeMes, receitas: 0, despesas: 0 };
      }

      if (m.tipo === 'receita') mesesMap[chave].receitas += m.valor;
      if (m.tipo === 'despesa') mesesMap[chave].despesas += m.valor;
    }
  });

  const entradasMeses = Object.values(mesesMap);

  container.innerHTML = '';

  if (entradasMeses.length === 0) {
    container.innerHTML = '<p class="legenda-vazia">Sem movimentações para exibir no fluxo mensal.</p>';
    return;
  }

  const painel = document.createElement('div');
  painel.className = 'painel-evolucao-real';

  entradasMeses.forEach(item => {
    const saldo = item.receitas - item.despesas;
    const itemEl = document.createElement('div');
    itemEl.className = 'item-mes-real';

    itemEl.innerHTML = `
      <div>
        <span class="mes-nome">${item.nome}</span>
        <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 2px;">
          Balanço líquido: <strong class="${saldo >= 0 ? 'texto-sucesso' : 'texto-perigo'}">${formatarMoeda(saldo)}</strong>
        </div>
      </div>
      <div class="mes-detalhes">
        <span class="texto-sucesso">Entradas: <strong>+ ${formatarMoeda(item.receitas)}</strong></span>
        <span class="texto-perigo">Saídas: <strong>- ${formatarMoeda(item.despesas)}</strong></span>
      </div>
    `;

    painel.append(itemEl);
  });

  container.append(painel);
}

/**
 * Renderiza o widget de resumo das últimas 5 transações na Visão Geral
 * @param {HTMLElement} containerLista 
 */
export function renderizarTransacoesRecentes(containerLista) {
  if (!containerLista) return;

  const todas = obterMovimentacoes();
  const recentes = [...todas].sort((a, b) => new Date(b.data) - new Date(a.data)).slice(0, 5);

  containerLista.innerHTML = '';

  if (recentes.length === 0) {
    containerLista.innerHTML = '<p class="lista-vazia-texto" style="padding: 20px; text-align: center; color: var(--text-muted);">Nenhuma transação recente.</p>';
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
 * Inicializa a Visão Geral conectando todos os painéis com dados reais
 * @param {Object} elementosDOM 
 */
export function inicializarDashboard(elementosDOM) {
  const renderizarTudo = () => {
    atualizarCartoesKPI(elementosDOM);
    if (elementosDOM.containerComparativo) renderizarPainelComparativo(elementosDOM.containerComparativo);
    if (elementosDOM.containerCategorias) renderizarPainelCategorias(elementosDOM.containerCategorias);
    if (elementosDOM.containerEvolucao) renderizarPainelEvolucao(elementosDOM.containerEvolucao);
    if (elementosDOM.containerRecentes) renderizarTransacoesRecentes(elementosDOM.containerRecentes);
  };

  inscreverAtualizacao(renderizarTudo);
  renderizarTudo();
}
