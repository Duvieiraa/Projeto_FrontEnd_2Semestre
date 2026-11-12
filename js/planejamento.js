/**
 * planejamento.js - Finanças Pessoais
 * Módulo de gerenciamento do planejamento de gastos:
 * - Limites de despesa por categoria
 * - Percentual de consumo e barras de progresso
 * - Alertas visuais automáticos (80% atenção, 100% limite ultrapassado)
 * - Edição de limites orçamentários em memória
 */

import {
  obterOrcamentos,
  atualizarOrcamento,
  calcularGastosPorCategoria,
  formatarMoeda,
  inscreverAtualizacao
} from './data.js';

/**
 * Renderiza o resumo geral do planejamento (Totais orçados, gastos e restante)
 * @param {HTMLElement} containerResumo 
 */
function renderizarResumoPlanejamento(containerResumo) {
  if (!containerResumo) return;

  const orcamentos = obterOrcamentos();
  const gastosPorCategoria = calcularGastosPorCategoria();

  const totalOrcado = orcamentos.reduce((acc, item) => acc + item.limite, 0);
  const totalGasto = Object.values(gastosPorCategoria).reduce((acc, v) => acc + v, 0);
  const saldoRestante = Math.max(0, totalOrcado - totalGasto);
  const percentualGeral = totalOrcado > 0 ? ((totalGasto / totalOrcado) * 100).toFixed(0) : 0;

  containerResumo.innerHTML = `
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
      <span class="kpi-titulo">Saldo Disponível no Orçamento</span>
      <strong class="kpi-valor ${saldoRestante <= 0 ? 'texto-perigo' : 'texto-sucesso'}">${formatarMoeda(saldoRestante)}</strong>
      <span class="kpi-subtitulo">Margem de segurança para despesas</span>
    </div>
  `;
}

/**
 * Renderiza os cartões individuais de limites de gastos por categoria
 * @param {HTMLElement} containerCards 
 */
export function renderizarCardsPlanejamento(containerCards) {
  if (!containerCards) return;

  const orcamentos = obterOrcamentos();
  const gastosPorCategoria = calcularGastosPorCategoria();

  containerCards.innerHTML = '';

  orcamentos.forEach(item => {
    const gasto = gastosPorCategoria[item.categoria] || 0;
    const limite = item.limite;
    const percentual = limite > 0 ? (gasto / limite) * 100 : 0;
    const percentualFormatado = percentual.toFixed(1);

    // Determina o status visual e alertas de 80% e 100%
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
    card.className = `card-limite ${statusClasse}`;

    // Cabeçalho do Card (Nome da categoria e Badge de Alerta)
    const cabecalho = document.createElement('div');
    cabecalho.className = 'cabecalho-limite';

    const infoCat = document.createElement('div');
    infoCat.className = 'info-categoria-limite';

    const nomeCat = document.createElement('h3');
    nomeCat.className = 'nome-categoria';
    nomeCat.textContent = item.categoria;

    infoCat.append(nomeCat);

    const badgeStatus = document.createElement('span');
    badgeStatus.className = `badge-alerta-limite ${statusClasse}`;
    badgeStatus.textContent = statusTexto;

    cabecalho.append(infoCat, badgeStatus);

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

    linhaValores.append(textoGasto, separador, textoLimite);

    const textoPercentual = document.createElement('span');
    textoPercentual.className = 'percentual-limite';
    textoPercentual.textContent = `${percentualFormatado}%`;

    corpoValores.append(linhaValores, textoPercentual);

    // Barra de Progresso
    const trilhaProgresso = document.createElement('div');
    trilhaProgresso.className = 'trilha-progresso';

    const barraPreenchimento = document.createElement('div');
    barraPreenchimento.className = `barra-preenchimento ${barraClasse}`;
    // Limita largura máxima a 100% na barra para não quebrar o layout
    barraPreenchimento.style.width = `${Math.min(100, Math.max(0, percentual))}%`;

    trilhaProgresso.append(barraPreenchimento);

    // Rodapé com Ação para Editar Limite
    const rodape = document.createElement('div');
    rodape.className = 'rodape-limite';

    const btnEditar = document.createElement('button');
    btnEditar.type = 'button';
    btnEditar.className = 'btn-secundario btn-sm';
    btnEditar.textContent = 'Ajustar Limite';
    btnEditar.addEventListener('click', () => {
      const novoLimiteStr = window.prompt(`Defina o novo limite mensal para "${item.categoria}" (em R$):`, item.limite);
      if (novoLimiteStr !== null) {
        const novoLimiteNum = parseFloat(novoLimiteStr.replace(',', '.'));
        if (!isNaN(novoLimiteNum) && novoLimiteNum >= 0) {
          atualizarOrcamento(item.categoria, novoLimiteNum);
          if (typeof window.mostrarToast === 'function') {
            window.mostrarToast('sucesso', `Limite de ${item.categoria} atualizado para ${formatarMoeda(novoLimiteNum)}!`);
          }
        } else {
          if (typeof window.mostrarToast === 'function') {
            window.mostrarToast('erro', 'Por favor, informe um valor numérico válido.');
          }
        }
      }
    });

    rodape.append(btnEditar);

    card.append(cabecalho, corpoValores, trilhaProgresso, rodape);
    containerCards.append(card);
  });
}

/**
 * Inicializa a tela de planejamento
 * @param {Object} elementosDOM 
 */
export function inicializarPlanejamento(elementosDOM) {
  const { containerResumoPlanejamento, containerCardsPlanejamento } = elementosDOM;

  const atualizarVisao = () => {
    renderizarResumoPlanejamento(containerResumoPlanejamento);
    renderizarCardsPlanejamento(containerCardsPlanejamento);
  };

  inscreverAtualizacao(atualizarVisao);
  atualizarVisao();
}
