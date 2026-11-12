/**
 * main.js - Finanças Pessoais
 * Módulo principal e orquestrador do sistema:
 * - Navegação SPA entre as 4 telas (Visão Geral, Movimentações, Planejamento, Relatórios)
 * - Cabeçalho dinâmico (Saudação por horário e Data atual por extenso)
 * - Controle do Modal Global de Nova Movimentação
 * - Sistema centralizado de Notificações Toast
 * - Responsividade do menu lateral mobile
 */

import { inicializarDashboard } from './dashboard.js';
import { inicializarMovimentacoes } from './movimentacoes.js';
import { inicializarPlanejamento } from './planejamento.js';
import { inicializarRelatorios } from './relatorios.js';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Configuração da Data Atual e Saudação Dinâmica
  atualizarCabecalhoDinamico();

  // 2. Sistema de Notificações Toast Global
  configurarSistemaToast();

  // 3. Gerenciamento do Modal de Nova Movimentação
  configurarModalMovimentacao();

  // 4. Navegação SPA entre Abas / Seções
  configurarNavegacaoSPA();

  // 5. Menu Responsivo Mobile (Hambúrguer)
  configurarMenuMobile();

  // 6. Inicialização dos Módulos Específicos
  inicializarModulos();
});

/**
 * Atualiza a saudação ("Bom dia", "Boa tarde", "Boa noite") e a data atual formatada
 */
function atualizarCabecalhoDinamico() {
  const elementoSaudacao = document.getElementById('texto-saudacao');
  const elementoData = document.getElementById('data-atual');

  const agora = new Date();
  const hora = agora.getHours();

  let saudacao = 'Olá, Alex!';
  if (hora >= 5 && hora < 12) {
    saudacao = 'Bom dia, Alex!';
  } else if (hora >= 12 && hora < 18) {
    saudacao = 'Boa tarde, Alex!';
  } else {
    saudacao = 'Boa noite, Alex!';
  }

  if (elementoSaudacao) {
    elementoSaudacao.textContent = saudacao;
  }

  if (elementoData) {
    const opcoes = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    const dataFormatada = agora.toLocaleDateString('pt-BR', opcoes);
    // Capitaliza primeira letra
    elementoData.textContent = dataFormatada.charAt(0).toUpperCase() + dataFormatada.slice(1);
  }
}

/**
 * Cria o sistema global de toasts (mensagens flutuantes de sucesso/erro)
 */
function configurarSistemaToast() {
  const containerToast = document.getElementById('container-toast');
  if (!containerToast) return;

  window.mostrarToast = function(tipo, mensagem) {
    const toast = document.createElement('div');
    toast.className = `toast toast-${tipo}`;

    const icone = document.createElement('span');
    icone.className = 'toast-icone';
    icone.textContent = tipo === 'sucesso' ? '✓' : '⚠️';

    const texto = document.createElement('span');
    texto.className = 'toast-mensagem';
    texto.textContent = mensagem;

    toast.append(icone, texto);
    containerToast.append(toast);

    // Animação de entrada
    setTimeout(() => {
      toast.classList.add('visivel');
    }, 10);

    // Remove após 3.5 segundos
    setTimeout(() => {
      toast.classList.remove('visivel');
      setTimeout(() => {
        toast.remove();
      }, 300);
    }, 3500);
  };
}

/**
 * Controla abertura, fechamento e tecla ESC do modal de cadastro
 */
function configurarModalMovimentacao() {
  const modal = document.getElementById('modal-movimentacao');
  const btnAbrirModal = document.getElementById('btn-abrir-modal');
  const btnFecharModal = document.getElementById('btn-fechar-modal');
  const btnCancelarModal = document.getElementById('btn-cancelar-modal');
  const inputDataModal = document.getElementById('modal-data');

  const abrirModal = () => {
    if (!modal) return;
    modal.classList.add('aberto');
    modal.setAttribute('aria-hidden', 'false');
    // Preenche data padrão como hoje se vazio
    if (inputDataModal && !inputDataModal.value) {
      inputDataModal.value = new Date().toISOString().split('T')[0];
    }
    // Foco no primeiro input
    const primeiroInput = modal.querySelector('input[name="descricao"]');
    if (primeiroInput) primeiroInput.focus();
  };

  const fecharModal = () => {
    if (!modal) return;
    modal.classList.remove('aberto');
    modal.setAttribute('aria-hidden', 'true');
  };

  window.abrirModalNovaMovimentacao = abrirModal;
  window.fecharModalNovaMovimentacao = fecharModal;

  if (btnAbrirModal) btnAbrirModal.addEventListener('click', abrirModal);
  if (btnFecharModal) btnFecharModal.addEventListener('click', fecharModal);
  if (btnCancelarModal) btnCancelarModal.addEventListener('click', fecharModal);

  // Fecha clicando no backdrop
  if (modal) {
    modal.addEventListener('click', (evento) => {
      if (evento.target === modal) {
        fecharModal();
      }
    });
  }

  // Tecla ESC para fechar
  document.addEventListener('keydown', (evento) => {
    if (evento.key === 'Escape' && modal && modal.classList.contains('aberto')) {
      fecharModal();
    }
  });
}

/**
 * Controla a navegação SPA entre as 4 seções principais
 */
function configurarNavegacaoSPA() {
  const linksNavegacao = document.querySelectorAll('.nav-link, .nav-item-mobile');
  const secoes = document.querySelectorAll('.secao-conteudo');

  linksNavegacao.forEach(link => {
    link.addEventListener('click', (evento) => {
      evento.preventDefault();
      const secaoAlvo = link.getAttribute('data-secao');
      if (!secaoAlvo) return;

      // Atualiza abas ativas
      secoes.forEach(secao => {
        if (secao.id === secaoAlvo) {
          secao.classList.add('ativa');
        } else {
          secao.classList.remove('ativa');
        }
      });

      // Atualiza estilo dos links
      linksNavegacao.forEach(l => {
        if (l.getAttribute('data-secao') === secaoAlvo) {
          l.classList.add('ativo');
        } else {
          l.classList.remove('ativo');
        }
      });

      // Fecha gaveta mobile se estiver aberta
      const sidebar = document.querySelector('.sidebar');
      if (sidebar && sidebar.classList.contains('aberta-mobile')) {
        sidebar.classList.remove('aberta-mobile');
      }

      // Rola para o topo do conteúdo suavemente
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });
}

/**
 * Configura o botão hambúrguer do menu mobile
 */
function configurarMenuMobile() {
  const btnHamburguer = document.getElementById('btn-hamburguer');
  const sidebar = document.querySelector('.sidebar');
  const overlay = document.getElementById('overlay-sidebar');

  if (btnHamburguer && sidebar) {
    btnHamburguer.addEventListener('click', () => {
      sidebar.classList.toggle('aberta-mobile');
      if (overlay) overlay.classList.toggle('ativo');
    });
  }

  if (overlay && sidebar) {
    overlay.addEventListener('click', () => {
      sidebar.classList.remove('aberta-mobile');
      overlay.classList.remove('ativo');
    });
  }
}

/**
 * Inicializa todos os módulos com as referências corretas aos elementos do DOM
 */
function inicializarModulos() {
  // 1. Dashboard
  inicializarDashboard({
    kpiSaldo: document.getElementById('kpi-saldo-valor'),
    kpiReceitas: document.getElementById('kpi-receitas-valor'),
    kpiDespesas: document.getElementById('kpi-despesas-valor'),
    kpiResultado: document.getElementById('kpi-resultado-valor'),
    kpiTaxaPoupanca: document.getElementById('kpi-taxa-poupanca'),
    canvasComparativo: document.getElementById('grafico-comparativo'),
    canvasCategorias: document.getElementById('grafico-categorias'),
    legendaCategorias: document.getElementById('legenda-grafico-categorias'),
    canvasEvolucao: document.getElementById('grafico-evolucao'),
    containerRecentes: document.getElementById('lista-recentes-dashboard')
  });

  // 2. Movimentações
  inicializarMovimentacoes({
    formCadastro: document.getElementById('form-cadastro-inline'),
    formModalCadastro: document.getElementById('form-modal-movimentacao'),
    selectTipoForm: document.getElementById('inline-tipo'),
    selectCategoriaForm: document.getElementById('inline-categoria'),
    selectTipoModal: document.getElementById('modal-tipo'),
    selectCategoriaModal: document.getElementById('modal-categoria'),
    tbodyTabela: document.getElementById('tbody-movimentacoes'),
    contadorRegistros: document.getElementById('contador-registros'),
    inputBusca: document.getElementById('busca-movimentacoes'),
    selectFiltroTipo: document.getElementById('filtro-tipo'),
    selectFiltroCategoria: document.getElementById('filtro-categoria'),
    selectOrdenacao: document.getElementById('ordenacao-movimentacoes'),
    btnLimparFiltros: document.getElementById('btn-limpar-filtros')
  });

  // 3. Planejamento
  inicializarPlanejamento({
    containerResumoPlanejamento: document.getElementById('resumo-planejamento'),
    containerCardsPlanejamento: document.getElementById('grid-planejamento')
  });

  // 4. Relatórios
  inicializarRelatorios({
    selectFiltroPeriodo: document.getElementById('filtro-periodo-relatorio'),
    containerMetricasRelatorio: document.getElementById('metricas-relatorio'),
    containerRankingGastos: document.getElementById('ranking-gastos-relatorio'),
    tbodyAnaliticoRelatorios: document.getElementById('tbody-relatorios-analitico')
  });
}
