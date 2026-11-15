/**
 * movimentacoes.js - Finanças Pessoais
 * Módulo de Gerenciamento de Movimentações: Cadastro, Listagem, Filtros e Exclusão
 * 
 * Conteúdos aplicados do semestre:
 * - Semana 9: Variáveis e tipos de dados.
 * - Semana 11: Manipulação do DOM (createElement, appendChild, textContent, addEventListener).
 * - Semana 12: Operadores lógicos (&&, ||, ===) e estruturas condicionais (if / else).
 * - Semana 13: Estruturas de repetição (for), Arrays de objetos e persistência.
 */

// Objeto de estado dos filtros ativos
const estadoFiltros = {
  busca: '',
  tipo: 'todos',
  categoria: 'todas',
  ordenacao: 'data-desc'
};

/**
 * Semana 11: Atualiza dinamicamente as opções do select de categorias de acordo com o tipo escolhido
 */
function atualizarSelectCategorias(selectElement, tipo) {
  if (!selectElement) return;

  selectElement.innerHTML = '';

  const opcaoPadrao = document.createElement('option');
  opcaoPadrao.value = '';
  opcaoPadrao.textContent = 'Selecione uma categoria';
  selectElement.appendChild(opcaoPadrao);

  const categorias = (tipo === 'receita') ? CATEGORIAS_RECEITA : CATEGORIAS_DESPESA;

  for (let i = 0; i < categorias.length; i++) {
    const opt = document.createElement('option');
    opt.value = categorias[i];
    opt.textContent = categorias[i];
    selectElement.appendChild(opt);
  }
}

/**
 * Semana 11 e 13: Preenche o select do filtro de categorias com todas as categorias disponíveis
 */
function popularFiltroCategorias(selectFiltro) {
  if (!selectFiltro) return;

  const valorSelecionado = selectFiltro.value;
  selectFiltro.innerHTML = '';

  const optTodas = document.createElement('option');
  optTodas.value = 'todas';
  optTodas.textContent = 'Todas as categorias';
  selectFiltro.appendChild(optTodas);

  // Une as categorias sem repetição
  const todasCategorias = [];
  for (let i = 0; i < CATEGORIAS_RECEITA.length; i++) {
    todasCategorias.push(CATEGORIAS_RECEITA[i]);
  }
  for (let i = 0; i < CATEGORIAS_DESPESA.length; i++) {
    let jaExiste = false;
    for (let j = 0; j < todasCategorias.length; j++) {
      if (todasCategorias[j] === CATEGORIAS_DESPESA[i]) {
        jaExiste = true;
        break;
      }
    }
    if (!jaExiste) {
      todasCategorias.push(CATEGORIAS_DESPESA[i]);
    }
  }

  // Ordena alfabeticamente
  todasCategorias.sort();

  for (let i = 0; i < todasCategorias.length; i++) {
    const opt = document.createElement('option');
    opt.value = todasCategorias[i];
    opt.textContent = todasCategorias[i];
    selectFiltro.appendChild(opt);
  }

  selectFiltro.value = valorSelecionado || 'todas';
}

/**
 * Semana 12 e 13: Aplica os filtros e ordenação usando loops e operadores lógicos
 */
function filtrarEOrdenarMovimentacoes() {
  const todas = obterMovimentacoes();
  const resultado = [];

  const buscaMinuscula = estadoFiltros.busca.trim().toLowerCase();

  for (let i = 0; i < todas.length; i++) {
    const item = todas[i];
    let passaFiltro = true;

    // 1. Filtro por Busca na Descrição (Semana 12: operadores lógicos)
    if (buscaMinuscula.length > 0) {
      if (item.descricao.toLowerCase().indexOf(buscaMinuscula) === -1) {
        passaFiltro = false;
      }
    }

    // 2. Filtro por Tipo (Receita / Despesa)
    if (passaFiltro && estadoFiltros.tipo !== 'todos') {
      if (item.tipo !== estadoFiltros.tipo) {
        passaFiltro = false;
      }
    }

    // 3. Filtro por Categoria
    if (passaFiltro && estadoFiltros.categoria !== 'todas') {
      if (item.categoria !== estadoFiltros.categoria) {
        passaFiltro = false;
      }
    }

    if (passaFiltro) {
      resultado.push(item);
    }
  }

  // 4. Ordenação
  resultado.sort(function(a, b) {
    if (estadoFiltros.ordenacao === 'data-desc') {
      return new Date(b.data) - new Date(a.data);
    } else if (estadoFiltros.ordenacao === 'data-asc') {
      return new Date(a.data) - new Date(b.data);
    } else if (estadoFiltros.ordenacao === 'valor-desc') {
      return b.valor - a.valor;
    } else if (estadoFiltros.ordenacao === 'valor-asc') {
      return a.valor - b.valor;
    }
    return 0;
  });

  return resultado;
}

/**
 * Semana 11: Renderiza as movimentações na tabela do DOM com createElement e textContent
 */
function renderizarTabelaMovimentacoes() {
  const tbody = document.getElementById('tbody-movimentacoes');
  const contador = document.getElementById('contador-registros');
  if (!tbody) return;

  const lista = filtrarEOrdenarMovimentacoes();

  if (contador) {
    contador.textContent = lista.length + (lista.length === 1 ? ' registro' : ' registros');
  }

  tbody.innerHTML = '';

  // Caso não existam itens
  if (lista.length === 0) {
    const trVazia = document.createElement('tr');
    trVazia.className = 'linha-vazia';

    const tdVazia = document.createElement('td');
    tdVazia.colSpan = 6;
    tdVazia.className = 'td-vazio';

    const estadoVazio = document.createElement('div');
    estadoVazio.className = 'estado-vazio';

    const icone = document.createElement('span');
    icone.className = 'estado-vazio-icone';
    icone.textContent = '🔍';

    const texto = document.createElement('p');
    texto.textContent = 'Nenhuma movimentação encontrada com os filtros selecionados.';

    estadoVazio.appendChild(icone);
    estadoVazio.appendChild(texto);
    tdVazia.appendChild(estadoVazio);
    trVazia.appendChild(tdVazia);
    tbody.appendChild(trVazia);
    return;
  }

  // Renderiza cada item da lista (Semana 11 e 13: manipulação do DOM e objetos)
  for (let i = 0; i < lista.length; i++) {
    const item = lista[i];
    const tr = document.createElement('tr');
    tr.className = 'linha-movimentacao';

    // Coluna 1: Data
    const tdData = document.createElement('td');
    tdData.textContent = formatarData(item.data);

    // Coluna 2: Descrição (uso estrito de textContent contra XSS)
    const tdDesc = document.createElement('td');
    const strongDesc = document.createElement('strong');
    strongDesc.textContent = item.descricao;
    tdDesc.appendChild(strongDesc);

    // Coluna 3: Categoria
    const tdCat = document.createElement('td');
    const badgeCat = document.createElement('span');
    badgeCat.className = 'badge-categoria';
    badgeCat.textContent = item.categoria;
    tdCat.appendChild(badgeCat);

    // Coluna 4: Tipo (Badge visual)
    const tdTipo = document.createElement('td');
    const badgeTipo = document.createElement('span');
    badgeTipo.className = 'badge-tipo ' + (item.tipo === 'receita' ? 'badge-receita' : 'badge-despesa');
    badgeTipo.textContent = item.tipo === 'receita' ? 'Receita' : 'Despesa';
    tdTipo.appendChild(badgeTipo);

    // Coluna 5: Valor
    const tdValor = document.createElement('td');
    tdValor.className = 'col-valor ' + (item.tipo === 'receita' ? 'valor-positivo' : 'valor-negativo');
    const prefixo = item.tipo === 'receita' ? '+ ' : '- ';
    tdValor.textContent = prefixo + formatarMoeda(item.valor);

    // Coluna 6: Ações (Botão Excluir)
    const tdAcoes = document.createElement('td');
    tdAcoes.style.textAlign = 'right';

    const btnExcluir = document.createElement('button');
    btnExcluir.type = 'button';
    btnExcluir.className = 'btn-acao btn-excluir';
    btnExcluir.title = 'Excluir movimentação';
    btnExcluir.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M3 6h18"></path>
        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
      </svg>
    `;

    // Semana 11: Evento de clique para exclusão
    btnExcluir.addEventListener('click', function() {
      const confirmou = window.confirm('Deseja realmente excluir "' + item.descricao + '" no valor de ' + formatarMoeda(item.valor) + '?');
      if (confirmou) {
        removerMovimentacao(item.id);
        if (typeof exibirToast === 'function') {
          exibirToast('sucesso', 'Movimentação excluída com sucesso!');
        }
      }
    });

    tdAcoes.appendChild(btnExcluir);

    // Adiciona as colunas na linha
    tr.appendChild(tdData);
    tr.appendChild(tdDesc);
    tr.appendChild(tdCat);
    tr.appendChild(tdTipo);
    tr.appendChild(tdValor);
    tr.appendChild(tdAcoes);

    tbody.appendChild(tr);
  }
}

/**
 * Semana 11: Configura o envio de um formulário de cadastro (inline ou modal)
 */
function configurarFormularioCadastro(formElement) {
  if (!formElement) return;

  const selectTipo = formElement.querySelector('[name="tipo"]');
  const selectCat = formElement.querySelector('[name="categoria"]');

  if (selectTipo && selectCat) {
    atualizarSelectCategorias(selectCat, selectTipo.value || 'receita');
    selectTipo.addEventListener('change', function() {
      atualizarSelectCategorias(selectCat, selectTipo.value);
    });
  }

  // Preenche a data de hoje por padrão
  const inputData = formElement.querySelector('[name="data"]');
  if (inputData && !inputData.value) {
    inputData.value = new Date().toISOString().split('T')[0];
  }

  // Configura limpeza dos erros em tempo real
  configurarLimpezaErrosEmTempoReal(formElement);

  // Evento submit do formulário
  formElement.addEventListener('submit', function(evento) {
    evento.preventDefault();

    const dados = {
      descricao: formElement.querySelector('[name="descricao"]').value,
      valor: formElement.querySelector('[name="valor"]').value,
      tipo: formElement.querySelector('[name="tipo"]').value,
      categoria: formElement.querySelector('[name="categoria"]').value,
      data: formElement.querySelector('[name="data"]').value
    };

    // Valida os dados antes de cadastrar
    const valido = validarFormularioMovimentacao(dados, formElement);
    if (!valido) {
      if (typeof exibirToast === 'function') {
        exibirToast('erro', 'Por favor, preencha os campos obrigatórios corretamente.');
      }
      return;
    }

    // Adiciona a movimentação em memória
    adicionarMovimentacao(dados);

    // Limpa o formulário
    formElement.reset();
    limparTodosOsErros(formElement);

    if (selectTipo && selectCat) {
      atualizarSelectCategorias(selectCat, selectTipo.value || 'receita');
    }
    if (inputData) {
      inputData.value = new Date().toISOString().split('T')[0];
    }

    // Se for o formulário do modal, fecha o modal
    if (typeof fecharModalNovaMovimentacao === 'function') {
      fecharModalNovaMovimentacao();
    }

    if (typeof exibirToast === 'function') {
      exibirToast('sucesso', 'Movimentação cadastrada com sucesso!');
    }
  });
}

/**
 * Semana 11: Inicializa todos os ouvintes de eventos da tela de movimentações
 */
function inicializarMovimentacoes() {
  const formInline = document.getElementById('form-cadastro-inline');
  const formModal = document.getElementById('form-modal-movimentacao');
  const inputBusca = document.getElementById('busca-movimentacoes');
  const selectFiltroTipo = document.getElementById('filtro-tipo');
  const selectFiltroCat = document.getElementById('filtro-categoria');
  const selectOrdenacao = document.getElementById('ordenacao-movimentacoes');
  const btnLimparFiltros = document.getElementById('btn-limpar-filtros');

  configurarFormularioCadastro(formInline);
  configurarFormularioCadastro(formModal);

  popularFiltroCategorias(selectFiltroCat);

  // Eventos de Filtro e Busca em tempo real
  if (inputBusca) {
    inputBusca.addEventListener('input', function() {
      estadoFiltros.busca = inputBusca.value;
      renderizarTabelaMovimentacoes();
    });
  }

  if (selectFiltroTipo) {
    selectFiltroTipo.addEventListener('change', function() {
      estadoFiltros.tipo = selectFiltroTipo.value;
      renderizarTabelaMovimentacoes();
    });
  }

  if (selectFiltroCat) {
    selectFiltroCat.addEventListener('change', function() {
      estadoFiltros.categoria = selectFiltroCat.value;
      renderizarTabelaMovimentacoes();
    });
  }

  if (selectOrdenacao) {
    selectOrdenacao.addEventListener('change', function() {
      estadoFiltros.ordenacao = selectOrdenacao.value;
      renderizarTabelaMovimentacoes();
    });
  }

  if (btnLimparFiltros) {
    btnLimparFiltros.addEventListener('click', function() {
      estadoFiltros.busca = '';
      estadoFiltros.tipo = 'todos';
      estadoFiltros.categoria = 'todas';
      estadoFiltros.ordenacao = 'data-desc';

      if (inputBusca) inputBusca.value = '';
      if (selectFiltroTipo) selectFiltroTipo.value = 'todos';
      if (selectFiltroCat) selectFiltroCat.value = 'todas';
      if (selectOrdenacao) selectOrdenacao.value = 'data-desc';

      renderizarTabelaMovimentacoes();
    });
  }

  // Render inicial
  renderizarTabelaMovimentacoes();
}
