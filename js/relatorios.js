/**
 * relatorios.js - Finanças Pessoais
 * Módulo de Relatórios Financeiros Analíticos e Filtros por Período
 * 
 * Conteúdos aplicados do semestre:
 * - Semana 9: Variáveis (let, const), tipos de dados.
 * - Semana 11: Manipulação do DOM (getElementById, createElement, appendChild, textContent).
 * - Semana 12: Operadores lógicos (&&, ||, ===) e estruturas condicionais (if / else).
 * - Semana 13: Estruturas de repetição (for), Arrays de Objetos e ordenação.
 */

let periodoSelecionado = 'todos';

/**
 * Semana 12 e 13: Filtra a lista de movimentações de acordo com o período selecionado
 */
function filtrarMovimentacoesPorPeriodo(lista, periodo) {
  if (periodo === 'todos') {
    return lista;
  }

  const hoje = new Date();
  const anoAtual = hoje.getFullYear();
  const mesAtual = hoje.getMonth(); // 0 a 11

  const filtrados = [];

  for (let i = 0; i < lista.length; i++) {
    const item = lista[i];
    if (item.data) {
      const partes = item.data.split('-');
      const anoItem = parseInt(partes[0], 10);
      const mesItem = parseInt(partes[1], 10) - 1;

      if (periodo === 'mes-atual') {
        if (anoItem === anoAtual && mesItem === mesAtual) {
          filtrados.push(item);
        }
      } else if (periodo === 'ultimos-3') {
        const dataItem = new Date(anoItem, mesItem, 1);
        const dataLimite = new Date(anoAtual, mesAtual - 2, 1);
        if (dataItem >= dataLimite && dataItem <= hoje) {
          filtrados.push(item);
        }
      } else if (periodo === 'ultimos-6') {
        const dataItem = new Date(anoItem, mesItem, 1);
        const dataLimite = new Date(anoAtual, mesAtual - 5, 1);
        if (dataItem >= dataLimite && dataItem <= hoje) {
          filtrados.push(item);
        }
      }
    }
  }

  return filtrados;
}

/**
 * Semana 11 e 12: Renderiza os 3 cartões de métricas do período selecionado
 */
function renderizarMetricasPeriodo(dadosPeriodo) {
  const container = document.getElementById('metricas-relatorio');
  if (!container) return;

  let totalRec = 0;
  let totalDesp = 0;
  let qtdRec = 0;
  let qtdDesp = 0;

  for (let i = 0; i < dadosPeriodo.length; i++) {
    const item = dadosPeriodo[i];
    if (item.tipo === 'receita') {
      totalRec += item.valor;
      qtdRec++;
    } else if (item.tipo === 'despesa') {
      totalDesp += item.valor;
      qtdDesp++;
    }
  }

  const saldoPeriodo = totalRec - totalDesp;
  let taxaPoupanca = 0;
  if (totalRec > 0) {
    taxaPoupanca = ((totalRec - totalDesp) / totalRec) * 100;
  }

  container.innerHTML = `
    <div class="card-kpi">
      <span class="kpi-titulo">Receitas no Período</span>
      <strong class="kpi-valor texto-sucesso">+ ${formatarMoeda(totalRec)}</strong>
      <span class="kpi-subtitulo">${qtdRec} entrada(s)</span>
    </div>
    <div class="card-kpi">
      <span class="kpi-titulo">Despesas no Período</span>
      <strong class="kpi-valor texto-perigo">- ${formatarMoeda(totalDesp)}</strong>
      <span class="kpi-subtitulo">${qtdDesp} saída(s)</span>
    </div>
    <div class="card-kpi">
      <span class="kpi-titulo">Resultado Líquido</span>
      <strong class="kpi-valor ${saldoPeriodo >= 0 ? 'texto-sucesso' : 'texto-perigo'}">${formatarMoeda(saldoPeriodo)}</strong>
      <span class="kpi-subtitulo">${taxaPoupanca >= 0 ? taxaPoupanca.toFixed(1) + '% poupado' : 'Déficit no período'}</span>
    </div>
  `;
}

/**
 * Semana 11 e 13: Renderiza o ranking Top 5 das maiores despesas do período
 */
function renderizarRankingMaioresGastos(dadosPeriodo) {
  const container = document.getElementById('ranking-gastos-relatorio');
  if (!container) return;

  const gastos = {};
  let totalDespesasPeriodo = 0;

  for (let i = 0; i < dadosPeriodo.length; i++) {
    const item = dadosPeriodo[i];
    if (item.tipo === 'despesa') {
      if (!gastos[item.categoria]) {
        gastos[item.categoria] = 0;
      }
      gastos[item.categoria] += item.valor;
      totalDespesasPeriodo += item.valor;
    }
  }

  // Converte para array para ordenar
  const listaRanking = [];
  for (let cat in gastos) {
    listaRanking.push({ categoria: cat, valor: gastos[cat] });
  }

  listaRanking.sort(function(a, b) {
    return b.valor - a.valor;
  });

  const top5 = listaRanking.slice(0, 5);
  container.innerHTML = '';

  if (top5.length === 0) {
    container.innerHTML = '<p class="legenda-vazia">Nenhuma despesa registrada para o período selecionado.</p>';
    return;
  }

  const maiorValor = top5[0].valor;

  for (let i = 0; i < top5.length; i++) {
    const item = top5[i];
    let percentual = 0;
    if (totalDespesasPeriodo > 0) {
      percentual = ((item.valor / totalDespesasPeriodo) * 100).toFixed(1);
    }

    const itemRanking = document.createElement('div');
    itemRanking.className = 'item-ranking';

    const linhaTopo = document.createElement('div');
    linhaTopo.className = 'linha-topo-ranking';

    const info = document.createElement('div');
    info.className = 'info-posicao-ranking';

    const posicao = document.createElement('span');
    posicao.className = 'numero-posicao';
    posicao.textContent = '#' + (i + 1);

    const nome = document.createElement('strong');
    nome.className = 'nome-categoria-ranking';
    nome.textContent = item.categoria;

    info.appendChild(posicao);
    info.appendChild(nome);

    const valorEl = document.createElement('div');
    valorEl.className = 'valores-ranking';
    valorEl.innerHTML = `<strong>${formatarMoeda(item.valor)}</strong> <small class="porcentagem-ranking">(${percentual}%)</small>`;

    linhaTopo.appendChild(info);
    linhaTopo.appendChild(valorEl);

    // Barra de progresso proporcional
    const trilha = document.createElement('div');
    trilha.className = 'trilha-ranking';

    const barra = document.createElement('div');
    barra.className = 'barra-ranking';
    let largura = 0;
    if (maiorValor > 0) {
      largura = (item.valor / maiorValor) * 100;
    }
    barra.style.width = largura + '%';

    trilha.appendChild(barra);
    itemRanking.appendChild(linhaTopo);
    itemRanking.appendChild(trilha);

    container.appendChild(itemRanking);
  }
}

/**
 * Semana 11 e 13: Renderiza a tabela analítica com o detalhamento por categoria
 */
function renderizarTabelaAnalitica(dadosPeriodo) {
  const tbody = document.getElementById('tbody-relatorios-analitico');
  if (!tbody) return;

  const categoriasMap = {};
  let totalDespesasPeriodo = 0;

  for (let i = 0; i < dadosPeriodo.length; i++) {
    const item = dadosPeriodo[i];
    if (item.tipo === 'despesa') {
      if (!categoriasMap[item.categoria]) {
        categoriasMap[item.categoria] = { total: 0, quantidade: 0 };
      }
      categoriasMap[item.categoria].total += item.valor;
      categoriasMap[item.categoria].quantidade += 1;
      totalDespesasPeriodo += item.valor;
    }
  }

  const listaCategorias = [];
  for (let cat in categoriasMap) {
    listaCategorias.push({
      categoria: cat,
      total: categoriasMap[cat].total,
      quantidade: categoriasMap[cat].quantidade
    });
  }

  listaCategorias.sort(function(a, b) {
    return b.total - a.total;
  });

  tbody.innerHTML = '';

  if (listaCategorias.length === 0) {
    const tr = document.createElement('tr');
    tr.innerHTML = '<td colspan="4" class="td-vazio">Sem dados de despesas no período selecionado.</td>';
    tbody.appendChild(tr);
    return;
  }

  for (let i = 0; i < listaCategorias.length; i++) {
    const item = listaCategorias[i];
    let percentual = 0;
    if (totalDespesasPeriodo > 0) {
      percentual = ((item.total / totalDespesasPeriodo) * 100).toFixed(1);
    }

    const tr = document.createElement('tr');

    const tdCat = document.createElement('td');
    tdCat.textContent = item.categoria;

    const tdQtd = document.createElement('td');
    tdQtd.textContent = item.quantidade + (item.quantidade === 1 ? ' registro' : ' registros');

    const tdValor = document.createElement('td');
    tdValor.className = 'col-valor valor-negativo';
    tdValor.textContent = formatarMoeda(item.total);

    const tdPct = document.createElement('td');
    tdPct.textContent = percentual + '%';

    tr.appendChild(tdCat);
    tr.appendChild(tdQtd);
    tr.appendChild(tdValor);
    tr.appendChild(tdPct);

    tbody.appendChild(tr);
  }
}

/**
 * Função mestre para renderizar toda a seção de Relatórios
 */
function renderizarRelatorios() {
  const todas = obterMovimentacoes();
  const filtradas = filtrarMovimentacoesPorPeriodo(todas, periodoSelecionado);

  renderizarMetricasPeriodo(filtradas);
  renderizarRankingMaioresGastos(filtradas);
  renderizarTabelaAnalitica(filtradas);
}

/**
 * Semana 11: Configura o evento change do select de filtro de período
 */
function inicializarRelatorios() {
  const selectPeriodo = document.getElementById('filtro-periodo-relatorio');
  if (selectPeriodo) {
    selectPeriodo.addEventListener('change', function() {
      periodoSelecionado = selectPeriodo.value;
      renderizarRelatorios();
    });
  }

  renderizarRelatorios();
}
