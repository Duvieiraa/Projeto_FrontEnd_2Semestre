/**
 * main.js - Finanças Pessoais
 * Módulo Orquestrador da Aplicação e Controle da Navegação SPA
 * 
 * Conteúdos aplicados do semestre:
 * - Semana 9: Variáveis (let, const), tipos de dados.
 * - Semana 11: Manipulação do DOM (getElementById, querySelectorAll, classList, addEventListener).
 * - Semana 12: Operadores lógicos e estruturas condicionais (if / else).
 * - Semana 13: Estruturas de repetição (for) e integração de módulos.
 */

// Executa a inicialização assim que o HTML for completamente carregado no navegador
document.addEventListener('DOMContentLoaded', function() {
  // 1. Configura a saudação dinâmica (Arnaldo) e data atual
  atualizarCabecalhoDinamico();

  // 2. Configura a navegação SPA entre as 4 seções
  configurarNavegacaoSPA();

  // 3. Configura o modal de nova movimentação
  configurarModal();

  // 4. Configura o menu hambúrguer para celular
  configurarMenuMobile();

  // 5. Inicializa os módulos e renderiza as telas com dados em memória
  inicializarMovimentacoes();
  inicializarRelatorios();
  renderizarDashboard();
  renderizarPlanejamento();
});

/**
 * Semana 11 e 12: Atualiza a saudação ("Bom dia, Arnaldo!", etc.) e a data atual formatada
 */
function atualizarCabecalhoDinamico() {
  const elSaudacao = document.getElementById('texto-saudacao');
  const elData = document.getElementById('data-atual');

  const agora = new Date();
  const hora = agora.getHours();

  // Semana 12: Condicionais if / else if / else
  let saudacao = 'Olá, Arnaldo!';
  if (hora >= 5 && hora < 12) {
    saudacao = 'Bom dia, Arnaldo!';
  } else if (hora >= 12 && hora < 18) {
    saudacao = 'Boa tarde, Arnaldo!';
  } else {
    saudacao = 'Boa noite, Arnaldo!';
  }

  if (elSaudacao) {
    elSaudacao.textContent = saudacao;
  }

  if (elData) {
    const opcoes = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    const dataFormatada = agora.toLocaleDateString('pt-BR', opcoes);
    elData.textContent = dataFormatada.charAt(0).toUpperCase() + dataFormatada.slice(1);
  }
}

/**
 * Semana 11 e 13: Controle da navegação SPA (alterna classes .ativa e .ativo sem recarregar a página)
 */
function configurarNavegacaoSPA() {
  const links = document.querySelectorAll('.nav-link');
  const secoes = document.querySelectorAll('.secao-conteudo');

  for (let i = 0; i < links.length; i++) {
    links[i].addEventListener('click', function(evento) {
      evento.preventDefault();
      const secaoAlvo = links[i].getAttribute('data-secao');
      if (!secaoAlvo) return;

      // 1. Atualiza as seções visíveis
      for (let j = 0; j < secoes.length; j++) {
        if (secoes[j].id === secaoAlvo) {
          secoes[j].classList.add('ativa');
        } else {
          secoes[j].classList.remove('ativa');
        }
      }

      // 2. Atualiza o destaque no link da sidebar
      for (let k = 0; k < links.length; k++) {
        if (links[k].getAttribute('data-secao') === secaoAlvo) {
          links[k].classList.add('ativo');
        } else {
          links[k].classList.remove('ativo');
        }
      }

      // 3. Fecha a sidebar no mobile se estiver aberta
      const sidebar = document.querySelector('.sidebar');
      const overlay = document.getElementById('overlay-sidebar');
      if (sidebar && sidebar.classList.contains('aberta-mobile')) {
        sidebar.classList.remove('aberta-mobile');
        if (overlay) overlay.classList.remove('ativo');
      }

      // 4. Rola suavemente para o topo da tela
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}

/**
 * Semana 11: Controla a abertura, fechamento e tecla ESC do modal de cadastro
 */
function configurarModal() {
  const modal = document.getElementById('modal-movimentacao');
  const btnAbrir = document.getElementById('btn-abrir-modal');
  const btnFechar = document.getElementById('btn-fechar-modal');
  const btnCancelar = document.getElementById('btn-cancelar-modal');
  const inputDataModal = document.getElementById('modal-data');

  function abrirModal() {
    if (!modal) return;
    modal.classList.add('aberto');
    modal.setAttribute('aria-hidden', 'false');

    if (inputDataModal && !inputDataModal.value) {
      inputDataModal.value = new Date().toISOString().split('T')[0];
    }

    const primeiroInput = modal.querySelector('input[name="descricao"]');
    if (primeiroInput) {
      primeiroInput.focus();
    }
  }

  function fecharModal() {
    if (!modal) return;
    modal.classList.remove('aberto');
    modal.setAttribute('aria-hidden', 'true');
  }

  // Torna acessível globalmente
  window.abrirModalNovaMovimentacao = abrirModal;
  window.fecharModalNovaMovimentacao = fecharModal;

  if (btnAbrir) btnAbrir.addEventListener('click', abrirModal);
  if (btnFechar) btnFechar.addEventListener('click', fecharModal);
  if (btnCancelar) btnCancelar.addEventListener('click', fecharModal);

  // Fecha clicando no fundo escuro (backdrop)
  if (modal) {
    modal.addEventListener('click', function(evento) {
      if (evento.target === modal) {
        fecharModal();
      }
    });
  }

  // Fecha ao pressionar a tecla Escape
  document.addEventListener('keydown', function(evento) {
    if (evento.key === 'Escape' && modal && modal.classList.contains('aberto')) {
      fecharModal();
    }
  });
}

/**
 * Semana 11: Abre e fecha a gaveta lateral em dispositivos móveis
 */
function configurarMenuMobile() {
  const btnHamburguer = document.getElementById('btn-hamburguer');
  const sidebar = document.querySelector('.sidebar');
  const overlay = document.getElementById('overlay-sidebar');

  if (btnHamburguer && sidebar) {
    btnHamburguer.addEventListener('click', function() {
      sidebar.classList.toggle('aberta-mobile');
      if (overlay) overlay.classList.toggle('ativo');
    });
  }

  if (overlay && sidebar) {
    overlay.addEventListener('click', function() {
      sidebar.classList.remove('aberta-mobile');
      overlay.classList.remove('ativo');
    });
  }
}

/**
 * Semana 11: Sistema de notificações flutuantes (Toasts) para feedback ao usuário
 */
function exibirToast(tipo, mensagem) {
  const container = document.getElementById('container-toast');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast toast-' + tipo;

  const icone = document.createElement('span');
  icone.className = 'toast-icone';
  icone.textContent = (tipo === 'sucesso') ? '✓' : '⚠️';

  const texto = document.createElement('span');
  texto.className = 'toast-mensagem';
  texto.textContent = mensagem;

  toast.appendChild(icone);
  toast.appendChild(texto);
  container.appendChild(toast);

  // Mostra com transição
  setTimeout(function() {
    toast.classList.add('visivel');
  }, 10);

  // Remove automaticamente após 3 segundos
  setTimeout(function() {
    toast.classList.remove('visivel');
    setTimeout(function() {
      toast.remove();
    }, 300);
  }, 3000);
}

// Compatibilidade global
window.mostrarToast = exibirToast;
