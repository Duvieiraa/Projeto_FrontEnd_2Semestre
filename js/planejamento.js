/**
 * planejamento.js - Finanças Pessoais
 * Módulo de Planejamento de Gastos e Limites por Categoria com Alertas Visuais
 * 
 * Conteúdos aplicados do semestre:
 * - Semana 9: Variáveis (let, const), tipos de dados.
 * - Semana 11: Manipulação do DOM (createElement, appendChild, textContent).
 * - Semana 12: Operadores lógicos e estruturas condicionais (if / else if / else para alertas de 80% e 100%).
 * - Semana 13: Estruturas de repetição (for), Arrays de Objetos mantidos em memória.
 */

/**
 * Semana 11 e 13: Renderiza o resumo do planejamento orçamentário
 */
function renderizarResumoPlanejamento() {
  const container = document.getElementById('resumo-planejamento');
  if (!container) return;

  const listaOrcamentos = obterOrcamentos();
  const gastosPorCategoria = calcularGastosPorCategoria();

  let totalOrcado = 0;
  for (let i = 0; i < listaOrcamentos.length; i++) {
    totalOrcado += listaOrcamentos[i].limite;
  }

  let totalGasto = 0;
  for (let i = 0; i < CATEGORIAS_DESPESA.length; i++) {
    const cat = CATEGORIAS_DESPESA[i];
    totalGasto += gastosPorCategoria[cat] || 0;
  }

  let saldoRestante = totalOrcado - totalGasto;
  if (saldoRestante < 0) {
    saldoRestante = 0;
  }

  let percentualGeral = 0;
  if (totalOrcado > 0) {
    percentualGeral = ((totalGasto / totalOrcado) * 100).toFixed(0);
  }

  container.innerHTML = `
    <div class="card-kpi card-planejamento">
      <span class="kpi-titulo">Total Orçado</span>
      <strong class="kpi-valor">${formatarMoeda(totalOrcado)}</strong>
      <span class="kpi-subtitulo">Teto de gastos planejado</span>
    </div>
    <div class="card-kpi card-planejamento">
      <span class="kpi-titulo">Total Utilizado</span>
      <strong class="kpi-valor ${totalGasto > totalOrcado ? 'texto-perigo' : ''}">${formatarMoeda(totalGasto)}</strong>
      <span class="kpi-subtitulo">${percentualGeral}% do teto total consumido</span>
    </div>
    <div class="card-kpi card-planejamento">
      <span class="kpi-titulo">Saldo no Orçamento</span>
      <strong class="kpi-valor ${saldoRestante <= 0 ? 'texto-perigo' : 'texto-sucesso'}">${formatarMoeda(saldoRestante)}</strong>
      <span class="kpi-subtitulo">Margem de segurança para despesas</span>
    </div>
  `;
}

/**
 * Semana 11, 12 e 13: Renderiza os cartões individuais de limite por categoria
 * Exibe barra de progresso e alertas visuais automáticos:
 * - < 80%: Normal (Verde)
 * - 80% a 99%: Alerta (Âmbar/Laranja)
 * - >= 100%: Limite Ultrapassado (Vermelho)
 */
function renderizarCardsPlanejamento() {
  const container = document.getElementById('grid-planejamento');
  if (!container) return;

  const listaOrcamentos = obterOrcamentos();
  const gastosPorCategoria = calcularGastosPorCategoria();

  container.innerHTML = '';

  for (let i = 0; i < listaOrcamentos.length; i++) {
    const item = listaOrcamentos[i];
    const gasto = gastosPorCategoria[item.categoria] || 0;
    const limite = item.limite;

    let percentual = 0;
    if (limite > 0) {
      percentual = (gasto / limite) * 100;
    }
    const percentualFormatado = percentual.toFixed(1);

    // Semana 12: Estrutura condicional para definir status e alertas visuais
    let statusClasse = 'status-normal';
    let statusTexto = 'Dentro da meta';
    let barraClasse = 'barra-normal';

    if (percentual >= 100) {
      statusClasse = 'status-perigo';
      statusTexto = '⚠️ Limite Ultrapassado!';
      barraClasse = 'barra-perigo';
    } else if (percentual >= 80) {
      statusClasse = 'status-alerta';
      statusTexto = '⚡ Atenção (80% atingido)';
      barraClasse = 'barra-alerta';
    }

    const card = document.createElement('div');
    card.className = 'card-limite ' + statusClasse;

    // Cabeçalho do Card
    const cabecalho = document.createElement('div');
    cabecalho.className = 'cabecalho-limite';

    const infoCat = document.createElement('div');
    infoCat.className = 'info-categoria-limite';

    const nomeCat = document.createElement('h3');
    nomeCat.className = 'nome-categoria';
    nomeCat.textContent = item.categoria;
    infoCat.appendChild(nomeCat);

    const badgeStatus = document.createElement('span');
    badgeStatus.className = 'badge-alerta-limite ' + statusClasse;
    badgeStatus.textContent = statusTexto;

    cabecalho.appendChild(infoCat);
    cabecalho.appendChild(badgeStatus);

    // Valores (Gasto vs Limite)
    const corpoValores = document.createElement('div');
    corpoValores.className = 'corpo-valores-limite';

    const linhaValores = document.createElement('div');
    linhaValores.className = 'linha-valores';

    const textoGasto = document.createElement('span');
    textoGasto.className = 'valor-gasto-limite';
    textoGasto.textContent = formatarMoeda(gasto);

    const separador = document.createElement('span');
    separador.className = 'separador-limite';
    separador.textContent = ' de ';

    const textoLimite = document.createElement('span');
    textoLimite.className = 'valor-teto-limite';
    textoLimite.textContent = formatarMoeda(limite);

    linhaValores.appendChild(textoGasto);
    linhaValores.appendChild(separador);
    linhaValores.appendChild(textoLimite);

    const textoPct = document.createElement('span');
    textoPct.className = 'percentual-limite';
    textoPct.textContent = percentualFormatado + '%';

    corpoValores.appendChild(linhaValores);
    corpoValores.appendChild(textoPct);

    // Trilha e Barra de Progresso
    const trilha = document.createElement('div');
    trilha.className = 'trilha-progresso';

    const barra = document.createElement('div');
    barra.className = 'barra-preenchimento ' + barraClasse;
    // Limita visualmente a 100% para não vazar o layout
    const larguraBarra = percentual > 100 ? 100 : percentual;
    barra.style.width = larguraBarra + '%';

    trilha.appendChild(barra);

    // Rodapé com Botão para Ajustar Limite em memória
    const rodape = document.createElement('div');
    rodape.className = 'rodape-limite';

    const btnAjustar = document.createElement('button');
    btnAjustar.type = 'button';
    btnAjustar.className = 'btn-secundario btn-sm';
    btnAjustar.textContent = 'Ajustar Limite';

    // Semana 11: Evento de clique
    btnAjustar.addEventListener('click', function() {
      const resposta = window.prompt('Digite o novo limite mensal para "' + item.categoria + '" em R$:', item.limite);
      if (resposta !== null) {
        const novoValor = parseFloat(resposta.replace(',', '.'));
        // Semana 12: Validação com operador lógico
        if (!isNaN(novoValor) && novoValor >= 0) {
          atualizarOrcamento(item.categoria, novoValor);
          if (typeof exibirToast === 'function') {
            exibirToast('sucesso', 'Limite de ' + item.categoria + ' atualizado para ' + formatarMoeda(novoValor) + '!');
          }
        } else {
          if (typeof exibirToast === 'function') {
            exibirToast('erro', 'Por favor, informe um valor numérico válido.');
          }
        }
      }
    });

    rodape.appendChild(btnAjustar);

    // Monta o Card
    card.appendChild(cabecalho);
    card.appendChild(corpoValores);
    card.appendChild(trilha);
    card.appendChild(rodape);

    container.appendChild(card);
  }
}

/**
 * Função mestre para renderizar toda a seção de Planejamento
 */
function renderizarPlanejamento() {
  renderizarResumoPlanejamento();
  renderizarCardsPlanejamento();
}
