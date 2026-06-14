# SIB Mirassol - Instrucoes para agentes

## Visao geral

- Aplicacao Next.js com App Router, React, TypeScript e CSS global.
- Nao adicionar Tailwind ou bibliotecas de UI sem necessidade clara.
- Reutilizar os componentes e tokens existentes antes de criar novos.
- Manter textos e interfaces em portugues do Brasil.

## Comandos de validacao

Execute antes de finalizar alteracoes:

```bash
npm run typecheck
npm run build
```

## Arquitetura

- Rotas ficam em `app/<rota>/page.tsx`.
- Componentes compartilhados ficam em `components/`.
- Estilos globais e tokens ficam em `app/globals.css`.
- Use `DashboardShell` em novas paginas administrativas para reutilizar:
  - Sidebar
  - Header
  - Busca
  - Comportamento mobile
  - Persistencia do estado recolhido da sidebar
- Use `AnimatedNumber` para indicadores numericos que devem animar ao carregar.

## Navegacao

- Ao criar uma pagina acessivel pelo menu, adicione uma rota real no array
  `primaryLinks` de `components/sidebar.tsx`.
- O item ativo deve ser determinado pelo pathname.
- A sidebar deve permanecer recolhida ao navegar entre paginas.
- No mobile, a sidebar deve fechar ao clicar fora.

## Design e estilos

- Preservar os tokens existentes em `:root`, especialmente cores, bordas e easing.
- Usar a fonte Fustat herdada pelo projeto em inputs, selects e botoes.
- Manter os padroes atuais:
  - Fundo: `--bg`
  - Paineis: borda `--border`, fundo branco e raio de `12px`
  - Titulos: `--heading`
  - Acoes primarias: fundo `--heading`
- Hovers e animacoes devem ser sutis e respeitar `prefers-reduced-motion`.
- Paginas administrativas devem iniciar com os mesmos paddings e cabecalhos.

## Responsividade

- Desktop: sidebar fixa e recolhivel.
- Tablet: componentes podem quebrar em multiplas linhas.
- Mobile: tabelas devem virar cartoes legiveis quando necessario.
- Evitar layouts que dependam de largura dinamica do conteudo.
- Tabelas devem usar `table-layout: fixed`, `colgroup` e larguras explicitas.
- Textos longos em colunas fixas devem usar ellipsis.

## Listas, filtros e dados mockados

- Filtros devem funcionar de verdade e recalcular a paginacao.
- Busca deve considerar nome, email e outros campos relevantes.
- Alterar filtros deve retornar para a primeira pagina.
- Incluir estado vazio quando nenhum registro for encontrado.
- Usar chaves React unicas e estaveis, nunca titulos duplicaveis isoladamente.
- Dados mockados devem ser suficientes para testar filtros e varias paginas.

## Componentes compartilhados

- Reutilizar estilos e componentes de filtros, paginacao, tags e acoes.
- Acoes padrao de registros:
  - Visualizar
  - Editar
  - Excluir
- Manter `aria-label` descritivo em botoes apenas com icone.
- Evitar duplicar logica entre paginas; extrair componente quando o mesmo
  comportamento aparecer em mais de uma rota.

## Implementacao a partir do Figma

- Adaptar o design ao stack e aos componentes existentes.
- Nao copiar Tailwind gerado pelo Figma.
- Priorizar consistencia com as paginas existentes sobre valores isolados do frame.
- Implementar interacoes esperadas, como filtros, busca, abas e paginacao.
- Validar responsividade alem da dimensao desktop apresentada no Figma.
