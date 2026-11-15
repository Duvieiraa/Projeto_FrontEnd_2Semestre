# Finanças Pessoais — Controle Financeiro

Aplicação web simples e intuitiva para controle financeiro pessoal, desenvolvida para o trabalho integrador do curso de Análise e Desenvolvimento de Sistemas (ADS).

O sistema permite registrar entradas e saídas, acompanhar o saldo disponível, definir metas de gastos por categoria e visualizar o resumo das movimentações em tempo real.

---

##  Principais Funcionalidades

- **Visão Geral:** Acompanhe o saldo atual, total de receitas e despesas, além de um comparativo visual do seu orçamento.
- **Movimentações:** Cadastre receitas e despesas, faça buscas por texto, filtre por tipo ou categoria e ordene por data ou valor.
- **Planejamento:** Defina limites de gastos para cada categoria e acompanhe alertas visuais conforme o consumo (verde para dentro da meta, amarelo para atenção e vermelho para limite ultrapassado).
- **Relatórios:** Visualize o resumo financeiro filtrado por período e descubra onde você mais gastou.
- **Perfil do Usuário:** Interface personalizada com foto e saudação automática de acordo com o horário do dia.

---

## 🛠️ Tecnologias Utilizadas

- **HTML5:** Estrutura das páginas e formulários.
- **CSS3:** Visual moderno, cores e adaptação para celulares e computadores (responsivo).
- **JavaScript:** Cálculos automáticos, filtros e atualização da tela sem precisar recarregar.

> **Nota:** Os dados são mantidos na memória enquanto a página estiver aberta e não utilizam banco de dados nem armazenamento permanente. Ao atualizar a página (F5), os registros reiniciam com valores de exemplo.

---

##  Estrutura de Arquivos

```text
Projeto_A2/
│
├── index.html          # Página principal do sistema
│
├── css/                # Arquivos de estilo visual e responsividade
│   ├── style.css
│   ├── dashboard.css
│   └── responsive.css
│
├── js/                 # Lógica e funcionalidades do sistema
│   ├── main.js
│   ├── data.js
│   ├── validacoes.js
│   ├── movimentacoes.js
│   ├── dashboard.js
│   ├── planejamento.js
│   └── relatorios.js
│
├── assets/             # Imagens e ícones
│   └── img/
│       ├── arnaldo.svg
│       └── logo.svg
│
└── README.md           # Apresentação do projeto
```

---

##  Como Usar

Você pode abrir o projeto de duas formas simples:

1. **Direto no Navegador:** Dê dois cliques no arquivo `index.html`.
2. **No VS Code:** Abra a pasta no Visual Studio Code, clique com o botão direito no `index.html` e escolha **"Open with Live Server"**.

---

## Responsável pelo Projeto

| Nome | Função Principal |
| **Arnaldo** | Estrutura HTML e Telas |
