/**
 * movimentacoes.js - Finanças Pessoais
 * Módulo de gerenciamento de movimentações: cadastro, listagem, exclusão,
 * filtros múltiplos combinados, busca em tempo real e ordenação.
 */

import {
  obterMovimentacoes,
  adicionarMovimentacao,
  removerMovimentacao,
  formatarMoeda,
  formatarData,
  CATEGORIAS_RECEITA,
  CATEGORIAS_DESPESA,
  inscreverAtualizacao
} from './data.js';

import {
  validarFormularioMovimentacao,
  limparTodosErros,
  configurarLimpezaErrosEmTempoReal
} from './validacoes.js';

// Estado local dos filtros e ordenação
const filtros = {
  busca: '',
  tipo: 'todos',
  categoria: 'todas',
  ordenacao: 'data-desc'
};

/**
 * Atualiza o <select> de categorias com base no tipo selecionado (Receita ou Despesa)
 * @param {HTMLSelectElement} selectElement 
 * @param {string} tipo 
 */
export function atualizarCategoriasSelect(selectElement, tipo) {
  if (!selectElement) return;

  selectElement.innerHTML = '';
  
  const opcaoPadrao = document.createElement('option');
  opcaoPadrao.value = '';
  opcaoPadrao.textContent = 'Selecione uma categoria';
  selectElement.append(opcaoPadrao);

  const categorias = tipo === 'receita' ? CATEGORIAS_RECEITA : CATEGORIAS_DESPESA;

  categorias.forEach(cat => {
    const option = document.createElement('option');
    option.value = cat;
    option.textContent = cat;
    selectElement.append(option);
  });
}

/**
 * Atualiza as opções do filtro de categorias da tela de movimentações
 * @param {HTMLSelectElement} selectFiltro 
 */
export function atualizarFiltroCategorias(selectFiltro) {
  if (!selectFiltro) return;

  const valorAtual = selectFiltro.value;
  selectFiltro.innerHTML = '';

  const opcaoTodas = document.createElement('option');
  opcaoTodas.value = 'todas';
  opcaoTodas.textContent = 'Todas as categorias';
  selectFiltro.append(opcaoTodas);

  // Reúne todas as categorias únicas de receita e despesa
  const todasCategorias = [...new Set([...CATEGORIAS_RECEITA, ...CATEGORIAS_DESPESA])].sort();

  todasCategorias.forEach(cat => {
    const opt = document.createElement('option');
    opt.value = cat;
    opt.textContent = cat;
    selectFiltro.append(opt);
  });

  if (todasCategorias.includes(valorAtual) || valorAtual === 'todas') {
    selectFiltro.value = valorAtual;
  }
}

/**
 * Aplica os filtros de busca, tipo, categoria e ordenação aos dados
 * @returns {Array} Array filtrado e ordenado de movimentações
 */
export function filtrarMovimentacoes() {
  let resultado = obterMovimentacoes();

  // 1. Filtro por Busca na Descrição
  if (filtros.busca.trim() !== '') {
    const termo = filtros.busca.toLowerCase().trim();
    resultado = resultado.filter(item => 
      item.descricao.toLowerCase().includes(termo)
    );
  }

  // 2. Filtro por Tipo (Receita / Despesa)
  if (filtros.tipo !== 'todos') {
    resultado = resultado.filter(item => item.tipo === filtros.tipo);
  }

  // 3. Filtro por Categoria
  if (filtros.categoria !== 'todas') {
    resultado = resultado.filter(item => item.categoria === filtros.categoria);
  }

  // 4. Ordenação
  resultado.sort((a, b) => {
    if (filtros.ordenacao === 'data-desc') {
      return new Date(b.data) - new Date(a.data);
    }
    if (filtros.ordenacao === 'data-asc') {
      return new Date(a.data) - new Date(b.data);
    }
    if (filtros.ordenacao === 'valor-desc') {
      return b.valor - a.valor;
    }
    if (filtros.ordenacao === 'valor-asc') {
      return a.valor - b.valor;
    }
    return 0;
  });

  return resultado;
}

/**
 * Renderiza a lista de movimentações no elemento tbody da tabela com DOM seguro
 * @param {HTMLElement} tbodyElement 
 * @param {HTMLElement} contadorElement 
 */
export function renderizarTabela(tbodyElement, contadorElement) {
  if (!tbodyElement) return;

  const listaFiltrada = filtrarMovimentacoes();

  if (contadorElement) {
    contadorElement.textContent = `${listaFiltrada.length} ${listaFiltrada.length === 1 ? 'registro' : 'registros'}`;
  }

  tbodyElement.innerHTML = '';

  if (listaFiltrada.length === 0) {
    const trVazio = document.createElement('tr');
    trVazio.className = 'linha-vazia';

    const tdVazio = document.createElement('td');
    tdVazio.colSpan = 6;
    tdVazio.className = 'td-vazio';

    const mensagemVazia = document.createElement('div');
    mensagemVazia.className = 'estado-vazio';

    const icone = document.createElement('span');
    icone.className = 'estado-vazio-icone';
    icone.textContent = '🔍';

    const texto = document.createElement('p');
    texto.textContent = 'Nenhuma movimentação encontrada para os filtros aplicados.';

    mensagemVazia.append(icone, texto);
    tdVazio.append(mensagemVazia);
    trVazio.append(tdVazio);
    tbodyElement.append(trVazio);
    return;
  }

  listaFiltrada.forEach(item => {
    const tr = document.createElement('tr');
    tr.className = 'linha-movimentacao';

    // Coluna 1: Data
    const tdData = document.createElement('td');
    tdData.className = 'col-data';
    tdData.textContent = formatarData(item.data);

    // Coluna 2: Descrição
    const tdDescricao = document.createElement('td');
    tdDescricao.className = 'col-descricao';
    const strongDesc = document.createElement('strong');
    strongDesc.textContent = item.descricao;
    tdDescricao.append(strongDesc);

    // Coluna 3: Categoria
    const tdCategoria = document.createElement('td');
    tdCategoria.className = 'col-categoria';
    const badgeCategoria = document.createElement('span');
    badgeCategoria.className = 'badge-categoria';
    badgeCategoria.textContent = item.categoria;
    tdCategoria.append(badgeCategoria);

    // Coluna 4: Tipo (Badge verde/coral)
    const tdTipo = document.createElement('td');
    tdTipo.className = 'col-tipo';
    const badgeTipo = document.createElement('span');
    badgeTipo.className = `badge-tipo badge-${item.tipo}`;
    badgeTipo.textContent = item.tipo === 'receita' ? 'Receita' : 'Despesa';
    tdTipo.append(badgeTipo);

    // Coluna 5: Valor
    const tdValor = document.createElement('td');
    tdValor.className = `col-valor ${item.tipo === 'receita' ? 'valor-positivo' : 'valor-negativo'}`;
    const prefixo = item.tipo === 'receita' ? '+ ' : '- ';
    tdValor.textContent = prefixo + formatarMoeda(item.valor);

    // Coluna 6: Ações (Botão Excluir)
    const tdAcoes = document.createElement('td');
    tdAcoes.className = 'col-acoes';

    const btnExcluir = document.createElement('button');
    btnExcluir.type = 'button';
    btnExcluir.className = 'btn-acao btn-excluir';
    btnExcluir.setAttribute('aria-label', `Excluir ${item.descricao}`);
    btnExcluir.title = 'Excluir movimentação';
    btnExcluir.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M3 6h18"></path>
        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
      </svg>
    `;

    btnExcluir.addEventListener('click', () => {
      const confirmacao = window.confirm(`Deseja realmente excluir a movimentação "${item.descricao}" no valor de ${formatarMoeda(item.valor)}?`);
      if (confirmacao) {
        removerMovimentacao(item.id);
        if (typeof window.mostrarToast === 'function') {
          window.mostrarToast('sucesso', 'Movimentação excluída com sucesso!');
        }
      }
    });

    tdAcoes.append(btnExcluir);

    // Monta a linha
    tr.append(tdData, tdDescricao, tdCategoria, tdTipo, tdValor, tdAcoes);
    tbodyElement.append(tr);
  });
}

/**
 * Inicializa os formulários e filtros de movimentações
 * @param {Object} elementos - Referências aos elementos do DOM
 */
export function inicializarMovimentacoes(elementos) {
  const {
    formCadastro,
    formModalCadastro,
    selectTipoForm,
    selectCategoriaForm,
    selectTipoModal,
    selectCategoriaModal,
    tbodyTabela,
    contadorRegistros,
    inputBusca,
    selectFiltroTipo,
    selectFiltroCategoria,
    selectOrdenacao,
    btnLimparFiltros
  } = elementos;

  // 1. Configurar selects dinâmicos do formulário embutido (se existir na tela)
  if (selectTipoForm && selectCategoriaForm) {
    atualizarCategoriasSelect(selectCategoriaForm, selectTipoForm.value || 'receita');
    selectTipoForm.addEventListener('change', () => {
      atualizarCategoriasSelect(selectCategoriaForm, selectTipoForm.value);
    });
  }

  // 2. Configurar selects dinâmicos do modal
  if (selectTipoModal && selectCategoriaModal) {
    atualizarCategoriasSelect(selectCategoriaModal, selectTipoModal.value || 'receita');
    selectTipoModal.addEventListener('change', () => {
      atualizarCategoriasSelect(selectCategoriaModal, selectTipoModal.value);
    });
  }

  // 3. Ouvintes de eventos nos formulários de cadastro
  const manipularEnvio = (form) => {
    form.addEventListener('submit', (evento) => {
      evento.preventDefault();

      const formData = new FormData(form);
      const dados = {
        descricao: formData.get('descricao'),
        valor: formData.get('valor'),
        tipo: formData.get('tipo'),
        categoria: formData.get('categoria'),
        data: formData.get('data')
      };

      const valido = validarFormularioMovimentacao(dados, form);
      if (!valido) {
        if (typeof window.mostrarToast === 'function') {
          window.mostrarToast('erro', 'Por favor, corrija os erros no formulário.');
        }
        return;
      }

      adicionarMovimentacao(dados);
      form.reset();
      limparTodosErros(form);

      // Reconfigura categorias para o tipo padrão
      const selectTipo = form.querySelector('[name="tipo"]');
      const selectCat = form.querySelector('[name="categoria"]');
      if (selectTipo && selectCat) {
        atualizarCategoriasSelect(selectCat, selectTipo.value || 'receita');
      }

      // Preenche data de hoje no campo data
      const inputData = form.querySelector('[name="data"]');
      if (inputData) {
        inputData.value = new Date().toISOString().split('T')[0];
      }

      // Fecha modal se o form for o modal
      if (typeof window.fecharModalNovaMovimentacao === 'function') {
        window.fecharModalNovaMovimentacao();
      }

      if (typeof window.mostrarToast === 'function') {
        window.mostrarToast('sucesso', 'Movimentação cadastrada com sucesso!');
      }
    });

    configurarLimpezaErrosEmTempoReal(form);
  };

  if (formCadastro) manipularEnvio(formCadastro);
  if (formModalCadastro) manipularEnvio(formModalCadastro);

  // 4. Filtros e Busca
  if (selectFiltroCategoria) {
    atualizarFiltroCategorias(selectFiltroCategoria);
  }

  const atualizarVisao = () => {
    renderizarTabela(tbodyTabela, contadorRegistros);
  };

  if (inputBusca) {
    inputBusca.addEventListener('input', (e) => {
      filtros.busca = e.target.value;
      atualizarVisao();
    });
  }

  if (selectFiltroTipo) {
    selectFiltroTipo.addEventListener('change', (e) => {
      filtros.tipo = e.target.value;
      atualizarVisao();
    });
  }

  if (selectFiltroCategoria) {
    selectFiltroCategoria.addEventListener('change', (e) => {
      filtros.categoria = e.target.value;
      atualizarVisao();
    });
  }

  if (selectOrdenacao) {
    selectOrdenacao.addEventListener('change', (e) => {
      filtros.ordenacao = e.target.value;
      atualizarVisao();
    });
  }

  if (btnLimparFiltros) {
    btnLimparFiltros.addEventListener('click', () => {
      filtros.busca = '';
      filtros.tipo = 'todos';
      filtros.categoria = 'todas';
      filtros.ordenacao = 'data-desc';

      if (inputBusca) inputBusca.value = '';
      if (selectFiltroTipo) selectFiltroTipo.value = 'todos';
      if (selectFiltroCategoria) selectFiltroCategoria.value = 'todas';
      if (selectOrdenacao) selectOrdenacao.value = 'data-desc';

      atualizarVisao();
    });
  }

  // Inscreve a tabela para re-renderizar caso haja alterações de dados
  inscreverAtualizacao(() => {
    atualizarVisao();
    if (selectFiltroCategoria) {
      atualizarFiltroCategorias(selectFiltroCategoria);
    }
  });

  // Render inicial
  atualizarVisao();
}
