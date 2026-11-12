/**
 * data.js - Finanças Pessoais
 * Gerenciamento centralizado do estado da aplicação em memória (Arrays e Objetos).
 * Sem persistência em localStorage ou banco de dados, atendendo aos requisitos acadêmicos.
 */

// Categorias permitidas para Receitas e Despesas
export const CATEGORIAS_RECEITA = [
  'Salário',
  'Renda extra',
  'Investimentos',
  'Outros'
];

export const CATEGORIAS_DESPESA = [
  'Alimentação',
  'Moradia',
  'Transporte',
  'Saúde',
  'Educação',
  'Lazer',
  'Compras',
  'Outros'
];

// Dados iniciais de demonstração (em memória)
let movimentacoes = [
  {
    id: 1,
    descricao: 'Salário Mensal',
    valor: 3000.00,
    tipo: 'receita',
    categoria: 'Salário',
    data: '2026-11-05'
  },
  {
    id: 2,
    descricao: 'Renda extra - Projeto Freelance',
    valor: 500.00,
    tipo: 'receita',
    categoria: 'Renda extra',
    data: '2026-11-08'
  },
  {
    id: 3,
    descricao: 'Rendimentos de Investimentos',
    valor: 180.00,
    tipo: 'receita',
    categoria: 'Investimentos',
    data: '2026-11-02'
  },
  {
    id: 4,
    descricao: 'Aluguel do Apartamento',
    valor: 1000.00,
    tipo: 'despesa',
    categoria: 'Moradia',
    data: '2026-11-03'
  },
  {
    id: 5,
    descricao: 'Supermercado Mensal',
    valor: 450.00,
    tipo: 'despesa',
    categoria: 'Alimentação',
    data: '2026-11-04'
  },
  {
    id: 6,
    descricao: 'Combustível e Transporte Público',
    valor: 200.00,
    tipo: 'despesa',
    categoria: 'Transporte',
    data: '2026-11-06'
  },
  {
    id: 7,
    descricao: 'Internet Fibra Óptica',
    valor: 100.00,
    tipo: 'despesa',
    categoria: 'Moradia',
    data: '2026-11-07'
  },
  {
    id: 8,
    descricao: 'Cinema e Jantar com Amigos',
    valor: 150.00,
    tipo: 'despesa',
    categoria: 'Lazer',
    data: '2026-11-09'
  },
  {
    id: 9,
    descricao: 'Farmácia e Medicamentos',
    valor: 85.00,
    tipo: 'despesa',
    categoria: 'Saúde',
    data: '2026-11-10'
  },
  {
    id: 10,
    descricao: 'Mensalidade Curso de Idiomas',
    valor: 160.00,
    tipo: 'despesa',
    categoria: 'Educação',
    data: '2026-11-01'
  }
];

// Limites mensais pré-configurados para o Planejamento de Gastos
let orcamentos = [
  { categoria: 'Alimentação', limite: 700.00, icone: 'utensils' },
  { categoria: 'Moradia', limite: 1300.00, icone: 'home' },
  { categoria: 'Transporte', limite: 350.00, icone: 'car' },
  { categoria: 'Saúde', limite: 250.00, icone: 'heart-pulse' },
  { categoria: 'Educação', limite: 300.00, icone: 'book' },
  { categoria: 'Lazer', limite: 250.00, icone: 'smile' },
  { categoria: 'Compras', limite: 400.00, icone: 'shopping-bag' },
  { categoria: 'Outros', limite: 200.00, icone: 'tag' }
];

// Lista de funções ouvintes para atualizar a interface quando os dados mudam
const ouvintesAtualizacao = [];

/**
 * Registra uma função para ser chamada sempre que houver alteração nos dados
 * @param {Function} callback 
 */
export function inscreverAtualizacao(callback) {
  if (typeof callback === 'function') {
    ouvintesAtualizacao.push(callback);
  }
}

/**
 * Notifica todos os ouvintes inscritos sobre alterações nos dados
 */
function notificarOuvintes() {
  ouvintesAtualizacao.forEach(callback => callback());
}

/**
 * Retorna uma cópia do array de movimentações em memória
 * @returns {Array}
 */
export function obterMovimentacoes() {
  return [...movimentacoes];
}

/**
 * Adiciona uma nova movimentação ao array em memória
 * @param {Object} movimentacao 
 * @returns {Object} Movimentação inserida com ID único
 */
export function adicionarMovimentacao(movimentacao) {
  const novoId = movimentacoes.length > 0 
    ? Math.max(...movimentacoes.map(m => m.id)) + 1 
    : 1;

  const novaMov = {
    id: novoId,
    descricao: movimentacao.descricao.trim(),
    valor: Number(movimentacao.valor),
    tipo: movimentacao.tipo,
    categoria: movimentacao.categoria,
    data: movimentacao.data
  };

  movimentacoes.push(novaMov);
  notificarOuvintes();
  return novaMov;
}

/**
 * Remove uma movimentação pelo seu ID
 * @param {number|string} id 
 * @returns {boolean} Retorna true se removeu com sucesso
 */
export function removerMovimentacao(id) {
  const indice = movimentacoes.findIndex(m => m.id === Number(id));
  if (indice !== -1) {
    movimentacoes.splice(indice, 1);
    notificarOuvintes();
    return true;
  }
  return false;
}

/**
 * Retorna a lista de limites de orçamento
 * @returns {Array}
 */
export function obterOrcamentos() {
  return [...orcamentos];
}

/**
 * Atualiza o limite de gastos de uma categoria específica
 * @param {string} categoria 
 * @param {number} novoLimite 
 */
export function atualizarOrcamento(categoria, novoLimite) {
  const orcamento = orcamentos.find(o => o.categoria.toLowerCase() === categoria.toLowerCase());
  if (orcamento) {
    orcamento.limite = Number(novoLimite);
  } else {
    orcamentos.push({
      categoria,
      limite: Number(novoLimite),
      icone: 'tag'
    });
  }
  notificarOuvintes();
}

/**
 * Calcula os totais de receitas, despesas, saldo e resultado
 * @param {Array} lista - Opcional. Usa todas as movimentações por padrão.
 * @returns {Object} { totalReceitas, totalDespesas, saldoDisponivel, resultadoMes, taxaEconomia }
 */
export function calcularTotais(lista = movimentacoes) {
  let totalReceitas = 0;
  let totalDespesas = 0;

  lista.forEach(item => {
    const valor = Number(item.valor) || 0;
    if (item.tipo === 'receita') {
      totalReceitas += valor;
    } else if (item.tipo === 'despesa') {
      totalDespesas += valor;
    }
  });

  const saldoDisponivel = totalReceitas - totalDespesas;
  const resultadoMes = saldoDisponivel;
  const taxaEconomia = totalReceitas > 0 
    ? Math.max(0, ((totalReceitas - totalDespesas) / totalReceitas) * 100) 
    : 0;

  return {
    totalReceitas,
    totalDespesas,
    saldoDisponivel,
    resultadoMes,
    taxaEconomia
  };
}

/**
 * Calcula o total gasto por categoria de despesa
 * @param {Array} lista - Opcional. Usa todas as movimentações por padrão.
 * @returns {Object} Mapa { 'Alimentação': 450.00, ... }
 */
export function calcularGastosPorCategoria(lista = movimentacoes) {
  const totais = {};

  CATEGORIAS_DESPESA.forEach(cat => {
    totais[cat] = 0;
  });

  lista.forEach(item => {
    if (item.tipo === 'despesa') {
      const cat = item.categoria;
      if (!totais[cat]) {
        totais[cat] = 0;
      }
      totais[cat] += Number(item.valor) || 0;
    }
  });

  return totais;
}

/**
 * Formata um número para o padrão de moeda brasileiro (R$ 0,00)
 * @param {number} valor 
 * @returns {string}
 */
export function formatarMoeda(valor) {
  const numero = Number(valor) || 0;
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(numero);
}

/**
 * Formata uma data no formato YYYY-MM-DD para DD/MM/AAAA
 * @param {string} dataIso 
 * @returns {string}
 */
export function formatarData(dataIso) {
  if (!dataIso) return '-';
  const partes = dataIso.split('-');
  if (partes.length === 3) {
    const [ano, mes, dia] = partes;
    return `${dia.padStart(2, '0')}/${mes.padStart(2, '0')}/${ano}`;
  }
  return dataIso;
}
