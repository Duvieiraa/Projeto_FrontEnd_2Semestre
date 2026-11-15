// Categorias padrão de Receitas e Despesas
const CATEGORIAS_RECEITA = [
  'Salário',
  'Renda extra',
  'Investimentos',
  'Outros'
];

const CATEGORIAS_DESPESA = [
  'Alimentação',
  'Moradia',
  'Transporte',
  'Saúde',
  'Educação',
  'Lazer',
  'Compras',
  'Outros'
];

// Dados iniciais de demonstração em memória
const DADOS_INICIAIS = [
  { id: 1, descricao: 'Salário Mensal', valor: 3000.00, tipo: 'receita', categoria: 'Salário', data: '2026-11-05' },
  { id: 2, descricao: 'Renda extra - Projeto Freelance', valor: 500.00, tipo: 'receita', categoria: 'Renda extra', data: '2026-11-08' },
  { id: 3, descricao: 'Rendimentos de Investimentos', valor: 180.00, tipo: 'receita', categoria: 'Investimentos', data: '2026-11-02' },
  { id: 4, descricao: 'Aluguel do Apartamento', valor: 1000.00, tipo: 'despesa', categoria: 'Moradia', data: '2026-11-03' },
  { id: 5, descricao: 'Supermercado Mensal', valor: 450.00, tipo: 'despesa', categoria: 'Alimentação', data: '2026-11-04' },
  { id: 6, descricao: 'Combustível e Metrô', valor: 200.00, tipo: 'despesa', categoria: 'Transporte', data: '2026-11-06' },
  { id: 7, descricao: 'Internet Fibra Óptica', valor: 100.00, tipo: 'despesa', categoria: 'Moradia', data: '2026-11-07' },
  { id: 8, descricao: 'Cinema e Jantar com Amigos', valor: 150.00, tipo: 'despesa', categoria: 'Lazer', data: '2026-11-09' },
  { id: 9, descricao: 'Farmácia e Medicamentos', valor: 85.00, tipo: 'despesa', categoria: 'Saúde', data: '2026-11-10' },
  { id: 10, descricao: 'Mensalidade Curso de Idiomas', valor: 160.00, tipo: 'despesa', categoria: 'Educação', data: '2026-11-01' }
];

// Orçamentos e limites padrão por categoria em memória
const ORCAMENTOS_INICIAIS = [
  { categoria: 'Alimentação', limite: 700.00 },
  { categoria: 'Moradia', limite: 1300.00 },
  { categoria: 'Transporte', limite: 350.00 },
  { categoria: 'Saúde', limite: 250.00 },
  { categoria: 'Educação', limite: 300.00 },
  { categoria: 'Lazer', limite: 250.00 },
  { categoria: 'Compras', limite: 400.00 },
  { categoria: 'Outros', limite: 200.00 }
];

// Arrays principais da aplicação mantidos exclusivamente na memória da página (Sem localStorage)
let movimentacoes = [];
let orcamentos = [];

/**
 * Semana 13: Inicializa os dados na memória da sessão
 */
function inicializarDadosEmMemoria() {
  movimentacoes = [];
  for (let i = 0; i < DADOS_INICIAIS.length; i++) {
    movimentacoes.push(DADOS_INICIAIS[i]);
  }

  orcamentos = [];
  for (let i = 0; i < ORCAMENTOS_INICIAIS.length; i++) {
    orcamentos.push(ORCAMENTOS_INICIAIS[i]);
  }
}

/**
 * Retorna a lista atual de movimentações em memória
 */
function obterMovimentacoes() {
  return movimentacoes;
}

/**
 * Retorna a lista atual de limites de orçamento em memória
 */
function obterOrcamentos() {
  return orcamentos;
}

/**
 * Semana 11 e 13: Adiciona uma nova movimentação ao array em memória, gera ID e atualiza a interface
 */
function adicionarMovimentacao(novaMov) {
  let maiorId = 0;
  for (let i = 0; i < movimentacoes.length; i++) {
    if (movimentacoes[i].id > maiorId) {
      maiorId = movimentacoes[i].id;
    }
  }

  const objetoMovimentacao = {
    id: maiorId + 1,
    descricao: novaMov.descricao.trim(),
    valor: parseFloat(novaMov.valor),
    tipo: novaMov.tipo,
    categoria: novaMov.categoria,
    data: novaMov.data
  };

  movimentacoes.push(objetoMovimentacao);

  // Atualiza todas as telas da aplicação
  atualizarTodasAsTelas();
  return objetoMovimentacao;
}

/**
 * Semana 11, 12 e 13: Remove uma movimentação do array em memória pelo ID e atualiza a interface
 */
function removerMovimentacao(id) {
  const idParaRemover = parseInt(id, 10);
  for (let i = 0; i < movimentacoes.length; i++) {
    if (movimentacoes[i].id === idParaRemover) {
      movimentacoes.splice(i, 1);
      atualizarTodasAsTelas();
      return true;
    }
  }
  return false;
}

/**
 * Semana 13: Atualiza o limite de uma categoria no array em memória
 */
function atualizarOrcamento(categoria, novoLimite) {
  let encontrou = false;
  for (let i = 0; i < orcamentos.length; i++) {
    if (orcamentos[i].categoria.toLowerCase() === categoria.toLowerCase()) {
      orcamentos[i].limite = parseFloat(novoLimite);
      encontrou = true;
      break;
    }
  }

  if (!encontrou) {
    orcamentos.push({
      categoria: categoria,
      limite: parseFloat(novoLimite)
    });
  }

  atualizarTodasAsTelas();
}

/**
 * Semana 12 e 13: Calcula os totais de receitas, despesas, saldo e taxa de economia
 * Utiliza estrutura for tradicional e operadores condicionais
 */
function calcularTotais(lista) {
  const listaParaCalcular = lista ? lista : movimentacoes;
  let totalReceitas = 0;
  let totalDespesas = 0;

  for (let i = 0; i < listaParaCalcular.length; i++) {
    const item = listaParaCalcular[i];
    const valor = parseFloat(item.valor) || 0;

    if (item.tipo === 'receita') {
      totalReceitas += valor;
    } else if (item.tipo === 'despesa') {
      totalDespesas += valor;
    }
  }

  const saldoDisponivel = totalReceitas - totalDespesas;
  let taxaEconomia = 0;
  if (totalReceitas > 0) {
    taxaEconomia = ((totalReceitas - totalDespesas) / totalReceitas) * 100;
    if (taxaEconomia < 0) {
      taxaEconomia = 0;
    }
  }

  return {
    totalReceitas: totalReceitas,
    totalDespesas: totalDespesas,
    saldoDisponivel: saldoDisponivel,
    resultadoMes: saldoDisponivel,
    taxaEconomia: taxaEconomia
  };
}

/**
 * Semana 13: Calcula o total de despesas agrupado por categoria
 * Retorna um objeto com { 'Alimentação': 450, 'Moradia': 1100, ... }
 */
function calcularGastosPorCategoria(lista) {
  const listaParaCalcular = lista ? lista : movimentacoes;
  const totais = {};

  // Inicializa cada categoria com 0
  for (let i = 0; i < CATEGORIAS_DESPESA.length; i++) {
    const cat = CATEGORIAS_DESPESA[i];
    totais[cat] = 0;
  }

  // Soma os valores das despesas
  for (let i = 0; i < listaParaCalcular.length; i++) {
    const item = listaParaCalcular[i];
    if (item.tipo === 'despesa') {
      if (!totais[item.categoria]) {
        totais[item.categoria] = 0;
      }
      totais[item.categoria] += parseFloat(item.valor) || 0;
    }
  }

  return totais;
}

/**
 * Formata um número para moeda brasileira (R$ 0,00)
 */
function formatarMoeda(valor) {
  const numero = parseFloat(valor) || 0;
  return numero.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });
}

/**
 * Formata data de 'AAAA-MM-DD' para 'DD/MM/AAAA'
 */
function formatarData(dataIso) {
  if (!dataIso) return '-';
  const partes = dataIso.split('-');
  if (partes.length === 3) {
    return partes[2] + '/' + partes[1] + '/' + partes[0];
  }
  return dataIso;
}

/**
 * Função central que notifica e atualiza a interface visual em todos os módulos
 */
function atualizarTodasAsTelas() {
  if (typeof renderizarDashboard === 'function') {
    renderizarDashboard();
  }
  if (typeof renderizarTabelaMovimentacoes === 'function') {
    renderizarTabelaMovimentacoes();
  }
  if (typeof renderizarPlanejamento === 'function') {
    renderizarPlanejamento();
  }
  if (typeof renderizarRelatorios === 'function') {
    renderizarRelatorios();
  }
}

// Inicializa os dados em memória ao carregar o script
inicializarDadosEmMemoria();
