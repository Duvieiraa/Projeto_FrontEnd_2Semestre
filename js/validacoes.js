/**
 * validacoes.js - Finanças Pessoais
 * Módulo de Validação de Formulários com Tratamento de Eventos e Manipulação do DOM
 * 
 * Conteúdos aplicados do semestre:
 * - Semana 9: Variáveis e tipos de dados.
 * - Semana 11: Manipulação do DOM (querySelector, classList.add, classList.remove, textContent).
 * - Semana 12: Operadores lógicos (&&, ||, !, >, <, ===) e estruturas condicionais (if / else).
 */

/**
 * Semana 11: Exibe a mensagem de erro no elemento visual abaixo do campo inválido
 */
function exibirMensagemErro(inputElement, mensagem) {
  if (!inputElement) return;

  // Destaca a borda do input com a classe de erro
  inputElement.classList.add('input-erro');
  inputElement.setAttribute('aria-invalid', 'true');

  // Encontra o container do grupo do formulário (.form-grupo)
  const container = inputElement.closest('.form-grupo') || inputElement.parentElement;
  if (!container) return;

  let elementoErro = container.querySelector('.mensagem-erro');
  if (!elementoErro) {
    elementoErro = document.createElement('span');
    elementoErro.className = 'mensagem-erro';
    container.appendChild(elementoErro);
  }

  elementoErro.textContent = mensagem;
  elementoErro.style.display = 'block';
}

/**
 * Semana 11: Limpa o erro visual de um campo específico quando o usuário digita
 */
function limparMensagemErro(inputElement) {
  if (!inputElement) return;

  inputElement.classList.remove('input-erro');
  inputElement.removeAttribute('aria-invalid');

  const container = inputElement.closest('.form-grupo') || inputElement.parentElement;
  if (container) {
    const elementoErro = container.querySelector('.mensagem-erro');
    if (elementoErro) {
      elementoErro.textContent = '';
      elementoErro.style.display = 'none';
    }
  }
}

/**
 * Limpa todos os erros de um formulário
 */
function limparTodosOsErros(formElement) {
  if (!formElement) return;

  const camposComErro = formElement.querySelectorAll('.input-erro');
  for (let i = 0; i < camposComErro.length; i++) {
    camposComErro[i].classList.remove('input-erro');
    camposComErro[i].removeAttribute('aria-invalid');
  }

  const mensagens = formElement.querySelectorAll('.mensagem-erro');
  for (let i = 0; i < mensagens.length; i++) {
    mensagens[i].textContent = '';
    mensagens[i].style.display = 'none';
  }
}

/**
 * Semana 12: Valida todos os campos do formulário de movimentação
 * Verifica campos obrigatórios, valor numérico > 0, categoria e data válida
 */
function validarFormularioMovimentacao(dados, formElement) {
  let formularioValido = true;
  limparTodosOsErros(formElement);

  const inputDescricao = formElement.querySelector('[name="descricao"]');
  const inputValor = formElement.querySelector('[name="valor"]');
  const selectTipo = formElement.querySelector('[name="tipo"]');
  const selectCategoria = formElement.querySelector('[name="categoria"]');
  const inputData = formElement.querySelector('[name="data"]');

  // 1. Validação da Descrição (Semana 12: operadores lógicos e if)
  if (!dados.descricao || dados.descricao.trim().length === 0) {
    exibirMensagemErro(inputDescricao, 'A descrição é obrigatória.');
    formularioValido = false;
  } else if (dados.descricao.trim().length < 3) {
    exibirMensagemErro(inputDescricao, 'A descrição deve ter pelo menos 3 caracteres.');
    formularioValido = false;
  }

  // 2. Validação do Valor
  const valorNumerico = parseFloat(dados.valor);
  if (!dados.valor || isNaN(valorNumerico)) {
    exibirMensagemErro(inputValor, 'Informe um valor numérico válido.');
    formularioValido = false;
  } else if (valorNumerico <= 0) {
    exibirMensagemErro(inputValor, 'O valor deve ser maior do que zero (R$ 0,00).');
    formularioValido = false;
  }

  // 3. Validação do Tipo
  if (!dados.tipo || (dados.tipo !== 'receita' && dados.tipo !== 'despesa')) {
    exibirMensagemErro(selectTipo, 'Selecione o tipo (Receita ou Despesa).');
    formularioValido = false;
  }

  // 4. Validação da Categoria
  if (!dados.categoria || dados.categoria.trim() === '') {
    exibirMensagemErro(selectCategoria, 'Selecione uma categoria.');
    formularioValido = false;
  } else {
    // Verifica se a categoria pertence à lista permitida
    const categoriasPermitidas = dados.tipo === 'receita' ? CATEGORIAS_RECEITA : CATEGORIAS_DESPESA;
    let categoriaExiste = false;
    for (let i = 0; i < categoriasPermitidas.length; i++) {
      if (categoriasPermitidas[i] === dados.categoria) {
        categoriaExiste = true;
        break;
      }
    }
    if (!categoriaExiste) {
      exibirMensagemErro(selectCategoria, 'Categoria inválida para este tipo.');
      formularioValido = false;
    }
  }

  // 5. Validação da Data
  if (!dados.data || dados.data.trim() === '') {
    exibirMensagemErro(inputData, 'A data é obrigatória.');
    formularioValido = false;
  }

  return formularioValido;
}

/**
 * Semana 11: Adiciona eventos de input e change para remover mensagens de erro assim que o usuário corrige o campo
 */
function configurarLimpezaErrosEmTempoReal(formElement) {
  if (!formElement) return;

  const inputs = formElement.querySelectorAll('input, select');
  for (let i = 0; i < inputs.length; i++) {
    inputs[i].addEventListener('input', function() {
      limparMensagemErro(inputs[i]);
    });
    inputs[i].addEventListener('change', function() {
      limparMensagemErro(inputs[i]);
    });
  }
}
