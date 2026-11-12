/**
 * validacoes.js - Finanças Pessoais
 * Módulo responsável pela validação dos formulários com JavaScript nativo.
 * Apresenta mensagens de erro claras e amigáveis diretamente abaixo dos campos com problemas.
 */

import { CATEGORIAS_RECEITA, CATEGORIAS_DESPESA } from './data.js';

/**
 * Exibe uma mensagem de erro abaixo do campo informado
 * @param {HTMLInputElement|HTMLSelectElement} inputElement 
 * @param {string} mensagem 
 */
export function exibirErro(inputElement, mensagem) {
  if (!inputElement) return;

  // Adiciona a classe de destaque de erro no input
  inputElement.classList.add('input-erro');
  inputElement.setAttribute('aria-invalid', 'true');

  // Encontra ou cria o container da mensagem de erro
  const container = inputElement.closest('.form-grupo') || inputElement.parentElement;
  if (!container) return;

  let mensagemElemento = container.querySelector('.mensagem-erro');
  if (!mensagemElemento) {
    mensagemElemento = document.createElement('span');
    mensagemElemento.className = 'mensagem-erro';
    container.append(mensagemElemento);
  }

  mensagemElemento.textContent = mensagem;
  mensagemElemento.style.display = 'block';
}

/**
 * Remove o erro visual de um campo específico
 * @param {HTMLInputElement|HTMLSelectElement} inputElement 
 */
export function limparErro(inputElement) {
  if (!inputElement) return;

  inputElement.classList.remove('input-erro');
  inputElement.removeAttribute('aria-invalid');

  const container = inputElement.closest('.form-grupo') || inputElement.parentElement;
  if (container) {
    const mensagemElemento = container.querySelector('.mensagem-erro');
    if (mensagemElemento) {
      mensagemElemento.textContent = '';
      mensagemElemento.style.display = 'none';
    }
  }
}

/**
 * Remove todas as mensagens e estilos de erro de um formulário
 * @param {HTMLFormElement} formElement 
 */
export function limparTodosErros(formElement) {
  if (!formElement) return;

  const camposComErro = formElement.querySelectorAll('.input-erro');
  camposComErro.forEach(campo => {
    campo.classList.remove('input-erro');
    campo.removeAttribute('aria-invalid');
  });

  const mensagens = formElement.querySelectorAll('.mensagem-erro');
  mensagens.forEach(msg => {
    msg.textContent = '';
    msg.style.display = 'none';
  });
}

/**
 * Valida os dados de cadastro de uma nova movimentação
 * @param {Object} dados - Objeto contendo { descricao, valor, tipo, categoria, data }
 * @param {HTMLFormElement} formElement - Elemento do formulário no DOM para exibir os erros
 * @returns {boolean} Retorna true se todos os campos forem válidos
 */
export function validarFormularioMovimentacao(dados, formElement) {
  let formularioValido = true;
  limparTodosErros(formElement);

  // 1. Validação da Descrição
  const inputDescricao = formElement.querySelector('[name="descricao"]');
  if (!dados.descricao || dados.descricao.trim().length === 0) {
    exibirErro(inputDescricao, 'A descrição é obrigatória.');
    formularioValido = false;
  } else if (dados.descricao.trim().length < 3) {
    exibirErro(inputDescricao, 'A descrição deve ter pelo menos 3 caracteres.');
    formularioValido = false;
  }

  // 2. Validação do Valor
  const inputValor = formElement.querySelector('[name="valor"]');
  const valorNumerico = Number(dados.valor);
  if (!dados.valor || isNaN(valorNumerico)) {
    exibirErro(inputValor, 'Informe um valor numérico válido.');
    formularioValido = false;
  } else if (valorNumerico <= 0) {
    exibirErro(inputValor, 'O valor deve ser maior do que zero (R$ 0,00).');
    formularioValido = false;
  }

  // 3. Validação do Tipo
  const selectTipo = formElement.querySelector('[name="tipo"]');
  if (!dados.tipo || (dados.tipo !== 'receita' && dados.tipo !== 'despesa')) {
    exibirErro(selectTipo, 'Selecione o tipo da movimentação (Receita ou Despesa).');
    formularioValido = false;
  }

  // 4. Validação da Categoria
  const selectCategoria = formElement.querySelector('[name="categoria"]');
  const categoriasPermitidas = dados.tipo === 'receita' ? CATEGORIAS_RECEITA : CATEGORIAS_DESPESA;
  if (!dados.categoria || dados.categoria.trim() === '') {
    exibirErro(selectCategoria, 'Selecione uma categoria válida.');
    formularioValido = false;
  } else if (!categoriasPermitidas.includes(dados.categoria)) {
    exibirErro(selectCategoria, 'Categoria inválida para o tipo selecionado.');
    formularioValido = false;
  }

  // 5. Validação da Data
  const inputData = formElement.querySelector('[name="data"]');
  if (!dados.data || dados.data.trim() === '') {
    exibirErro(inputData, 'A data da movimentação é obrigatória.');
    formularioValido = false;
  } else {
    const dataObj = new Date(dados.data);
    if (isNaN(dataObj.getTime())) {
      exibirErro(inputData, 'Informe uma data válida.');
      formularioValido = false;
    }
  }

  return formularioValido;
}

/**
 * Atribui ouvintes de evento 'input' e 'change' para limpar os erros em tempo real
 * @param {HTMLFormElement} formElement 
 */
export function configurarLimpezaErrosEmTempoReal(formElement) {
  if (!formElement) return;

  const inputs = formElement.querySelectorAll('input, select, textarea');
  inputs.forEach(input => {
    input.addEventListener('input', () => limparErro(input));
    input.addEventListener('change', () => limparErro(input));
  });
}
