// Paleta de cores para identificar visualmente cada categoria
const CORES_CATEGORIAS_DASH = [
  '#0f4c3a',
  '#1ab273',
  '#2a9d8f',
  '#e76f51',
  '#f4a261',
  '#d94343',
  '#3b82f6',
  '#8b5cf6'
];

/**
 * Semana 11 e 12: Atualiza os 4 cartões de indicadores (KPIs) no topo da Visão Geral
 */
function atualizarCartoesKPI() {
  const elSaldo = document.getElementById('kpi-saldo-valor');
  const elReceitas = document.getElementById('kpi-receitas-valor');
  const elDespesas = document.getElementById('kpi-despesas-valor');
  const elResultado = document.getElementById('kpi-resultado-valor');
  const elTaxaPoupanca = document.getElementById('kpi-taxa-poupanca');

  const totais = calcularTotais();

  // 1. Saldo Disponível (Semana 12: condicional if/else para definir a cor)
  if (elSaldo) {
    elSaldo.textContent = formatarMoeda(totais.saldoDisponivel);
    if (totais.saldoDisponivel < 0) {
      elSaldo.classList.add('texto-perigo');
      elSaldo.classList.remove('texto-sucesso');
    } else {
      elSaldo.classList.add('texto-sucesso');
      elSaldo.classList.remove('texto-perigo');
    }
  }

  // 2. Total de Receitas
  if (elReceitas) {
    elReceitas.textContent = formatarMoeda(totais.totalReceitas);
  }

  // 3. Total de Despesas
  if (elDespesas) {
    elDespesas.textContent = formatarMoeda(totais.totalDespesas);
  }

  // 4. Resultado Financeiro
  if (elResultado) {
    elResultado.textContent = formatarMoeda(totais.resultadoMes);
    if (totais.resultadoMes < 0) {
      elResultado.classList.add('texto-perigo');
      elResultado.classList.remove('texto-sucesso');
    } else {
      elResultado.classList.add('texto-sucesso');
      elResultado.classList.remove('texto-perigo');
    }
  }

  if (elTaxaPoupanca) {
    elTaxaPoupanca.textContent = totais.taxaEconomia.toFixed(1) + '% economizado';
  }
}

/**
 * Semana 11, 12 e 13: Renderiza o painel de Receitas vs Despesas com dados reais das movimentações
 */
function renderizarPainelComparativo() {
  const container = document.getElementById('painel-comparativo-dados');
  if (!container) return;

  const lista = obterMovimentacoes();
  const totais = calcularTotais();

  let qtdReceitas = 0;
  let qtdDespesas = 0;
  let maiorReceita = null;
  let maiorDespesa = null;

  // Semana 13: Loop for para calcular quantidades e identificar maior entrada/saída
  for (let i = 0; i < lista.length; i++) {
    const item = lista[i];
    if (item.tipo === 'receita') {
      qtdReceitas++;
      if (maiorReceita === null || item.valor > maiorReceita.valor) {
        maiorReceita = item;
      }
    } else if (item.tipo === 'despesa') {
      qtdDespesas++;
      if (maiorDespesa === null || item.valor > maiorDespesa.valor) {
        maiorDespesa = item;
      }
    }
  }

  const totalGeral = totais.totalReceitas + totais.totalDespesas;
  let pctReceita = 0;
  let pctDespesa = 0;
  if (totalGeral > 0) {
    pctReceita = ((totais.totalReceitas / totalGeral) * 100).toFixed(1);
    pctDespesa = ((totais.totalDespesas / totalGeral) * 100).toFixed(1);
  }

  container.innerHTML = `
    <div class="painel-comparativo-real">
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

      <div class="grid-comparativo-cards">
        <div class="card-mini-comparativo receita">
          <div class="mini-cabecalho">
            <span>Total Entradas</span>
            <span class="badge-tipo badge-receita">+ ${qtdReceitas} reg.</span>
          </div>
          <strong class="mini-valor texto-sucesso">${formatarMoeda(totais.totalReceitas)}</strong>
          <span class="mini-info-adicional">
            ${maiorReceita ? `Maior entrada: <strong>${maiorReceita.descricao}</strong> (${formatarMoeda(maiorReceita.valor)})` : 'Nenhuma receita'}
          </span>
        </div>

        <div class="card-mini-comparativo despesa">
          <div class="mini-cabecalho">
            <span>Total Saídas</span>
            <span class="badge-tipo badge-despesa">- ${qtdDespesas} reg.</span>
          </div>
          <strong class="mini-valor texto-perigo">${formatarMoeda(totais.totalDespesas)}</strong>
          <span class="mini-info-adicional">
            ${maiorDespesa ? `Maior saída: <strong>${maiorDespesa.descricao}</strong> (${formatarMoeda(maiorDespesa.valor)})` : 'Nenhuma despesa'}
          </span>
        </div>
      </div>

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
 * Semana 11 e 13: Renderiza o painel de Despesas por Categoria com barras proporcionais reais
 */
function renderizarPainelCategorias() {
  const container = document.getElementById('painel-categorias-dados');
  if (!container) return;

  const lista = obterMovimentacoes();
  const gastosPorCategoria = calcularGastosPorCategoria();
  const totais = calcularTotais();
  const totalDespesas = totais.totalDespesas;

  // Monta lista com as categorias que possuem gastos > 0
  const categoriasComGasto = [];
  for (let i = 0; i < CATEGORIAS_DESPESA.length; i++) {
    const nomeCat = CATEGORIAS_DESPESA[i];
    const valorGasto = gastosPorCategoria[nomeCat] || 0;
    if (valorGasto > 0) {
      // Conta quantidade de lançamentos desta categoria
      let qtd = 0;
      for (let j = 0; j < lista.length; j++) {
        if (lista[j].tipo === 'despesa' && lista[j].categoria === nomeCat) {
          qtd++;
        }
      }
      categoriasComGasto.push({
        categoria: nomeCat,
        valor: valorGasto,
        quantidade: qtd
      });
    }
  }

  // Ordena da maior para a menor despesa
  categoriasComGasto.sort(function(a, b) {
    return b.valor - a.valor;
  });

  container.innerHTML = '';

  if (categoriasComGasto.length === 0) {
    container.innerHTML = '<p class="legenda-vazia">Nenhuma despesa registrada no momento.</p>';
    return;
  }

  const painel = document.createElement('div');
  painel.className = 'painel-categorias-real';

  for (let i = 0; i < categoriasComGasto.length; i++) {
    const item = categoriasComGasto[i];
    let percentual = 0;
    if (totalDespesas > 0) {
      percentual = ((item.valor / totalDespesas) * 100).toFixed(1);
    }
    const cor = CORES_CATEGORIAS_DASH[i % CORES_CATEGORIAS_DASH.length];

    const itemEl = document.createElement('div');
    itemEl.className = 'item-categoria-real';
    itemEl.innerHTML = `
      <div class="item-categoria-topo">
        <div class="item-categoria-nome-wrapper">
          <span class="categoria-dot" style="background-color: ${cor};"></span>
          <span class="item-categoria-nome">${item.categoria}</span>
        </div>
        <div class="item-categoria-valor-wrapper">
          <span class="item-categoria-valor">${formatarMoeda(item.valor)}</span>
          <span class="item-categoria-pct">(${percentual}%)</span>
        </div>
      </div>
      <div class="item-categoria-trilha">
        <div class="item-categoria-progresso" style="width: ${percentual}%; background-color: ${cor};"></div>
      </div>
      <div class="item-categoria-rodape">
        <span>${item.quantidade} ${item.quantidade === 1 ? 'lançamento' : 'lançamentos'}</span>
        <span>${formatarMoeda(item.valor)} do total de saídas</span>
      </div>
    `;

    painel.appendChild(itemEl);
  }

  container.appendChild(painel);
}

/**
 * Semana 13: Renderiza o fluxo mensal consolidado
 */
function renderizarPainelEvolucao() {
  const container = document.getElementById('painel-evolucao-dados');
  if (!container) return;

  const lista = obterMovimentacoes();
  const mesesMap = {};
  const nomesMeses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

  for (let i = 0; i < lista.length; i++) {
    const item = lista[i];
    if (item.data) {
      const partes = item.data.split('-');
      if (partes.length >= 2) {
        const ano = partes[0];
        const mesIdx = parseInt(partes[1], 10) - 1;
        const chave = ano + '-' + partes[1];
        const nomeFormatado = nomesMeses[mesIdx] + ' / ' + ano;

        if (!mesesMap[chave]) {
          mesesMap[chave] = { nome: nomeFormatado, receitas: 0, despesas: 0 };
        }

        if (item.tipo === 'receita') {
          mesesMap[chave].receitas += item.valor;
        } else if (item.tipo === 'despesa') {
          mesesMap[chave].despesas += item.valor;
        }
      }
    }
  }

  const mesesArray = Object.values(mesesMap);
  container.innerHTML = '';

  if (mesesArray.length === 0) {
    container.innerHTML = '<p class="legenda-vazia">Sem movimentações para exibir no fluxo mensal.</p>';
    return;
  }

  const painel = document.createElement('div');
  painel.className = 'painel-evolucao-real';

  for (let i = 0; i < mesesArray.length; i++) {
    const mes = mesesArray[i];
    const saldo = mes.receitas - mes.despesas;

    const itemEl = document.createElement('div');
    itemEl.className = 'item-mes-real';
    itemEl.innerHTML = `
      <div>
        <span class="mes-nome">${mes.nome}</span>
        <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 2px;">
          Balanço líquido: <strong class="${saldo >= 0 ? 'texto-sucesso' : 'texto-perigo'}">${formatarMoeda(saldo)}</strong>
        </div>
      </div>
      <div class="mes-detalhes">
        <span class="texto-sucesso">Entradas: <strong>+ ${formatarMoeda(mes.receitas)}</strong></span>
        <span class="texto-perigo">Saídas: <strong>- ${formatarMoeda(mes.despesas)}</strong></span>
      </div>
    `;

    painel.appendChild(itemEl);
  }

  container.appendChild(painel);
}

/**
 * Semana 11: Renderiza as 5 últimas movimentações registradas
 */
function renderizarTransacoesRecentes() {
  const container = document.getElementById('lista-recentes-dashboard');
  if (!container) return;

  const todas = obterMovimentacoes();

  // Clona e ordena pelas mais recentes
  const ordenadas = [];
  for (let i = 0; i < todas.length; i++) {
    ordenadas.push(todas[i]);
  }
  ordenadas.sort(function(a, b) {
    return new Date(b.data) - new Date(a.data);
  });

  const recentes = ordenadas.slice(0, 5);

  container.innerHTML = '';

  if (recentes.length === 0) {
    container.innerHTML = '<p style="padding: 20px; text-align: center; color: var(--text-muted);">Nenhuma transação recente.</p>';
    return;
  }

  for (let i = 0; i < recentes.length; i++) {
    const item = recentes[i];
    const itemEl = document.createElement('div');
    itemEl.className = 'item-transacao-recente';

    const info = document.createElement('div');
    info.className = 'info-recente';

    const titulo = document.createElement('strong');
    titulo.className = 'titulo-recente';
    titulo.textContent = item.descricao;

    const meta = document.createElement('span');
    meta.className = 'meta-recente';
    meta.textContent = formatarData(item.data) + ' • ' + item.categoria;

    info.appendChild(titulo);
    info.appendChild(meta);

    const valor = document.createElement('span');
    valor.className = 'valor-recente ' + (item.tipo === 'receita' ? 'positivo' : 'negativo');
    valor.textContent = (item.tipo === 'receita' ? '+ ' : '- ') + formatarMoeda(item.valor);

    itemEl.appendChild(info);
    itemEl.appendChild(valor);
    container.appendChild(itemEl);
  }
}

/**
 * Função mestre para renderizar toda a tela do Dashboard
 */
function renderizarDashboard() {
  atualizarCartoesKPI();
  renderizarPainelComparativo();
  renderizarPainelCategorias();
  renderizarPainelEvolucao();
  renderizarTransacoesRecentes();
}
