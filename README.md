# Finanças Pessoais — Dashboard de Controle Financeiro

Aplicação web interativa para gestão de receitas, despesas e planejamento orçamentário pessoal, desenvolvida para o **Trabalho Integrador Acadêmico do 2º Semestre do curso de Análise e Desenvolvimento de Sistemas (ADS)** na disciplina de **Front-End**.

---

## 📌 1. Visão Geral do Projeto

O **Finanças Pessoais** é um sistema web moderno do tipo Single Page Application (SPA), concebido com foco na facilidade de uso, clareza visual e independência tecnológica. Inspirado nas melhores interfaces de fintechs e dashboards SaaS atuais, a aplicação permite o gerenciamento completo de fluxos monetários com atualização dinâmica e em tempo real.

### 🎯 Objetivo Acadêmico
Demonstrar o domínio prático dos fundamentos essenciais de desenvolvimento Front-End:
- Estruturação semântica com **HTML5**.
- Estilização moderna e layout responsivo Mobile-First com **CSS3**.
- Programação orientada a eventos, funções modulares, arrays e manipulação direta do **DOM** com **JavaScript ES6+**.
- Construção de gráficos estatísticos nativos em **HTML5 Canvas**, dispensando o uso de bibliotecas de terceiros (como Chart.js).
- Gerenciamento de estado volátil em memória (sem persistência em `localStorage` ou banco de dados).

---

## 🚀 2. Tecnologias Utilizadas

- **HTML5**: Estrutura semântica (`<header>`, `<main>`, `<section>`, `<aside>`, `<nav>`, `<table>`, `<canvas>`), formulários acessíveis e modais.
- **CSS3 Moderno**:
  - CSS Custom Properties (Variáveis CSS para temas, espaçamentos e cores semânticas).
  - Flexbox e CSS Grid para layouts complexos e alinhamentos precisos.
  - Design Responsivo Mobile-First com breakpoints para Celulares (`< 768px`), Tablets (`768px - 1023px`) e Desktops (`>= 1024px`).
  - Animações suaves, transições e sombras refinadas.
- **JavaScript (ES6+) Nativo e Modular**:
  - Módulos ES6 com `import` e `export`.
  - Manipulação do DOM (`document.querySelector`, `getElementById`, `createElement`, `append`, `classList`).
  - Segurança contra Cross-Site Scripting (XSS) com uso preferencial de `textContent` para renderização de dados de entrada.
  - Event Listeners (`submit`, `input`, `change`, `click`, `keydown`, `resize`).
  - Métodos funcionais de Arrays (`filter`, `map`, `reduce`, `find`, `sort`, `slice`, `splice`).
  - Gráficos desenhados via Canvas API 2D nativa com suporte a High-DPI/Retina Display.

### 🚫 Restrições Acadêmicas Respeitadas
- ❌ Nenhum framework JavaScript (React, Vue, Angular, etc.).
- ❌ Nenhum framework CSS (Bootstrap, Tailwind CSS, etc.).
- ❌ Nenhuma biblioteca gráfica externa (Chart.js, ApexCharts, etc.).
- ❌ Nenhuma persistência em navegador (`localStorage`, `sessionStorage`, `IndexedDB` ou Cookies).
- ❌ Nenhum backend ou banco de dados externo.

---

## 💼 3. Funcionalidades da Aplicação

### 3.1 Visão Geral (Dashboard)
- **4 Cartões KPIs Dinâmicos**:
  - **Saldo Disponível**: Diferença em tempo real entre receitas e despesas com indicativo visual de positivo/negativo.
  - **Total de Receitas**: Soma de todas as entradas cadastradas.
  - **Total de Despesas**: Soma de todas as saídas registradas.
  - **Resultado Financeiro do Mês**: Saldo líquido do período com cálculo percentual da taxa de economia.
- **Gráficos em HTML5 Canvas Nativo**:
  - **Comparativo Receitas vs Despesas**: Gráfico de barras verticais com identificação de cores e valores monetários.
  - **Distribuição de Despesas por Categoria**: Gráfico de rosca/donut interativo com cálculo proporcional e legenda analítica.
  - **Evolução Mensal**: Histórico comparativo das movimentações ao longo dos meses.
- **Painel de Transações Recentes**: As últimas 5 movimentações com data, categoria e valor formatado.

### 3.2 Movimentações (Entradas e Saídas)
- **Cadastro Completo**: Campos para Descrição, Valor, Tipo (Receita/Despesa), Categoria dinâmica e Data.
- **Categorias Pré-configuradas**:
  - *Receitas*: Salário, Renda extra, Investimentos, Outros.
  - *Despesas*: Alimentação, Moradia, Transporte, Saúde, Educação, Lazer, Compras, Outros.
- **Filtros Combinados Simultâneos**:
  - Busca textual em tempo real por descrição.
  - Filtro por Tipo (Todas, Receitas, Despesas).
  - Filtro por Categoria.
  - Ordenação por Data (mais recentes / mais antigas) e por Valor (maior / menor).
- **Ações**: Exclusão segura com diálogo de confirmação e recálculo automático instantâneo de todos os dados do sistema.

### 3.3 Planejamento e Limites de Gastos
- Definição de tetos orçamentários mensais para cada categoria de despesa.
- Exibição de Categoria, Limite, Gasto Atual, Percentual consumido e Barra de progresso visual.
- **Alertas Visuais Automáticos**:
  - 🟢 **Normal (< 80%)**: Consumo seguro com barra verde.
  - 🟡 **Atenção (80% a 99%)**: Alerta de proximidade do teto com barra âmbar/laranja.
  - 🔴 **Limite Ultrapassado (≥ 100%)**: Alerta de perigo com barra vermelha e destaque no card.
- Botão interativo para o usuário ajustar o limite de qualquer categoria a qualquer momento.

### 3.4 Relatórios Analíticos
- Filtro por período: **Todo o período**, **Mês atual**, **Últimos 3 meses** e **Últimos 6 meses**.
- Indicadores consolidados do período selecionado.
- **Ranking das Categorias com Maiores Gastos**: Top 5 das despesas com barras proporcionais de participação percentual.
- Tabela analítica com quantidade de lançamentos, total gasto e percentual do total.

### 3.5 Recursos Globais
- **Modal de Cadastro Global**: Acessível em qualquer tela pelo botão "+ Nova Movimentação" no cabeçalho.
- **Saudação Inteligente**: Personalizada de acordo com o horário atual do usuário (Bom dia, Boa tarde, Boa noite).
- **Data Atual em Tempo Real**: Formatada por extenso em português brasileiro.
- **Sistema de Notificações Toast**: Feedback flutuante em ações de sucesso e erro.

---

## 📂 4. Estrutura de Pastas e Arquivos

```
controle-financeiro/
│
├── index.html                  # Estrutura semântica SPA (Sidebar, Header, 4 Views e Modais)
│
├── css/
│   ├── style.css               # Reset, variáveis CSS, tipografia, sidebar, header e modais
│   ├── dashboard.css           # Cartões KPIs, gráficos em Canvas, tabelas, limites e alertas
│   └── responsive.css          # Regras responsivas Mobile-First (Mobile, Tablet, Desktop)
│
├── js/
│   ├── main.js                 # Orquestrador SPA, inicialização, eventos globais e toasts
│   ├── data.js                 # Armazenamento em memória (Arrays e Objetos) e helpers de cálculo
│   ├── validacoes.js           # Validação de formulários com mensagens de erro inline no DOM
│   ├── movimentacoes.js        # Cadastro, listagem, filtros combinados e exclusão
│   ├── dashboard.js            # KPIs dinâmicos e renderização de gráficos Canvas nativos
│   ├── planejamento.js         # Gerenciamento de metas, alertas (80% e 100%) e barras de progresso
│   └── relatorios.js           # Relatórios analíticos com filtros de período e ranking
│
├── assets/
│   ├── img/                    # Logotipos e elementos gráficos
│   └── icons/                  # Recursos visuais e ícones
│
└── README.md                   # Documentação acadêmica do projeto
```

---

## ⚙️ 5. Como Executar o Projeto Localmente

Por se tratar de uma aplicação que utiliza **Módulos ES6 nativos** (`import` / `export`), os navegadores modernos exigem que o projeto seja executado através de um servidor HTTP local para evitar restrições de segurança do protocolo `file://` (CORS).

### Opção 1: Via Extensão Live Server (VS Code) — Recomendado
1. Abra a pasta do projeto no **Visual Studio Code**.
2. Instale a extensão **Live Server** (caso ainda não possua).
3. Clique com o botão direito no arquivo `index.html` e selecione **"Open with Live Server"**.
4. O navegador abrirá automaticamente no endereço `http://127.0.0.1:5500/index.html`.

### Opção 2: Via Python (Terminal)
Caso tenha Python instalado em seu computador:
```bash
# Python 3
python -m http.server 3000
```
Em seguida, abra o navegador em `http://localhost:3000`.

### Opção 3: Via Node.js (npx serve)
```bash
npx serve .
```

---

## 👥 6. Integrantes do Grupo

| Nome | R.A. / Matrícula | Função Principal |
| :--- | :--- | :--- |
| **Alex Reed** (Exemplo) | 00000000 | Estrutura HTML5 & CSS3 |
| *[Nome do Aluno]* | *[Matrícula]* | Lógica JavaScript & DOM |
| *[Nome do Aluno]* | *[Matrícula]* | Gráficos Canvas & Planejamento |
| *[Nome do Aluno]* | *[Matrícula]* | Validações & Documentação |

---

## 📄 7. Licença e Considerações Acadêmicas

Projeto desenvolvido para fins estritamente educacionais como parte dos requisitos de avaliação da disciplina de Front-End no curso de Análise e Desenvolvimento de Sistemas. Todos os dados financeiros apresentados são fictícios e destinados à demonstração técnica.
