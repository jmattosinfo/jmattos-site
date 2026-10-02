# AI_GUIDELINES — JMATTOS.DEV

> **Documentação permanente para qualquer IA que trabalhar neste projeto.**
> Sempre que houver novas alterações solicitadas, considere este arquivo como **fonte de orientação**.
> Valores e regras abaixo foram extraídos do código real (`index.html`, `src/css/style.css`, `src/js/*`, `package.json`).

---

## 🎯 Objetivo do projeto

Site pessoal/portfólio profissional do **JMATTOS.DEV** (Julio Mattos) — apresentar trajetória, stack e serviços de forma clara e profissional, servindo como vitrine para oportunidades de trabalho e novos projetos.

- **Frontend estático** (sem banco de dados), servido por um **Express** mínimo ([`server.js`](server.js)) que entrega o build e expõe a **API de contato** (`POST /api/contato`) — valida e **envia o e-mail real via SMTP** (Nodemailer + Gmail App Password).
- Foco em **simplicidade, performance e atenção aos detalhes**.
- Código organizado, de fácil manutenção e com **dados separados do HTML** (arquivos `data/` como fonte única de verdade).
- Todas as seções dinâmicas são renderizadas via JavaScript a partir de arquivos de dados.

Seções do site (ordem atual no `index.html`):

1. **Hero** — apresentação + badge de disponibilidade + terminal decorativo + 2 CTAs priorizados (vaga / projeto)
2. **Caminhos** — hub de conversão com 2 cards (VAGA x PROJETO), gerados por `data/disponibilidade.js`
3. **Sobre** — texto + foto de perfil com moldura gradiente azul e aura
4. **Stack** — cards de tecnologias com indicador de nível
5. **Projetos** — cards gerados dinamicamente (estudo de caso)
6. **Serviços** — cards gerados dinamicamente
7. **Processo** — etapas de trabalho (Entender → Planejar → Desenvolver → Entregar)
8. **Presença profissional** — redes/links externos
9. **Contato** — cards de canal (e-mail com copiar, WhatsApp e tempo de resposta) + formulário que envia via `POST /api/contato` (Express), o qual entrega o e-mail real via SMTP — sem abrir o app de e-mail do visitante; em falha, mostra erro honesto (sem `mailto`)
10. **Botão flutuante de WhatsApp** — link fixo no canto inferior direito (fonte única de dados: `data/presenca.js`)

---

## 🧰 Stack

| Camada    | Tecnologia                                                                 |
| --------- | -------------------------------------------------------------------------- |
| Frontend  | HTML5, CSS3, JavaScript (ES Modules)                                       |
| Estilos   | Tailwind CSS **v4** (configuração **CSS-first**, tokens no `@theme`)       |
| Build     | Vite                                                                       |
| Ícones    | **Lucide** (via tree-shaking no bundle, importando apenas os usados)       |
| Fontes    | Space Grotesk, Inter, JetBrains Mono (Google Fonts, com `preconnect`)      |
| Backend   | Express (porta 3001) servindo `dist/` + `POST /api/contato` (envio de e-mail via Nodemailer + Gmail SMTP) |
| Runtime   | **Docker + Docker Compose** (Node.js 22 Alpine) — container único       |
| Deploy    | VPS (Linux/Ubuntu) + Docker Compose (`docker compose up -d --build`)     |

Scripts disponíveis (`package.json`): `npm run dev` · `npm run build` · `npm run preview` · `npm start` (Express: serve `dist/` + `POST /api/contato` — envia o e-mail real via SMTP). No fluxo atual, esses scripts são executados **dentro do container** (o Compose invoca `npm run dev` no ambiente de desenvolvimento e o [`Dockerfile`](Dockerfile:1) invoca `npm run build` no estágio *builder*).

---

## 🐳 Arquitetura e Infraestrutura

> **O projeto é 100% conteinerizado.** Não há execução da aplicação diretamente no sistema operativo (sem `node server.js` no host, sem PM2, sem upload por FTP/SFTP). Toda a execução, instalação de dependências e gestão de processo acontece via **Docker/Docker Compose**.

### Componentes

| Ficheiro | Função |
| --- | --- |
| [`Dockerfile`](Dockerfile:1) | Build **multi-stage**: estágio `builder` (Node 22 Alpine + `npm ci` completo + `npm run build` → gera `dist/`) e estágio `runtime` (Node 22 Alpine + `npm ci --omit=dev` + [`server.js`](server.js) + `dist/`). Roda como usuário **não-root** (`USER node`), expõe a porta **3001** e tem `HEALTHCHECK` apontando para `GET /status`. |
| [`docker-compose.yml`](docker-compose.yml:1) | **Produção** (VPS): faz `build` da imagem, publica `3001:3001`, carrega as variáveis via `env_file: .env` e usa `restart: always`. |
| [`docker-compose.dev.yml`](docker-compose.dev.yml:1) | **Desenvolvimento**: usa `node:22-alpine`, monta o projeto como volume (`.:/app`) e roda `npm install && npm run dev` (Vite com hot-reload em `5173`). |
| [`.dockerignore`](.dockerignore:1) | Exclui do contexto de build o que não pertence à imagem (`node_modules`, `dist`, `.git`, `.env`, `ecosystem.config.*`, docs `.md`). |
| [`.env.example`](.env.example:1) | Modelo versionado das variáveis de ambiente. O `.env` real (com as credenciais SMTP) **não é versionado**. |

### Regras de infraestrutura

- **Comandos de execução/gestão devem usar o ecossistema Docker/Compose** — nunca `npm run dev`, `npm start` ou `pm2 ...` diretamente no host.
  - Dev local: `docker compose -f docker-compose.dev.yml up -d`
  - Produção/teste da imagem: `docker compose up -d --build` · logs: `docker compose logs -f` · parar: `docker compose down`
- **Dependências**: instaladas dentro da imagem pelo `npm ci` do [`Dockerfile`](Dockerfile:1). Não executar `npm install` no host como parte do fluxo de execução/deploy.
- **Porta**: a aplicação escuta sempre a **3001** (`process.env.PORT || 3001`) e o Compose mapeia `3001:3001`.
- **Variáveis de ambiente**: injetadas pelo Compose via `env_file: .env`; **nunca** embutidas no `Dockerfile` nem versionadas.
- **Deploy**: manual via Git + Compose na VPS — `git pull` e `docker compose up -d --build`. Detalhes em [DEPLOY.md](DEPLOY.md).
- **Persistência**: a aplicação é **stateless** (sem banco de dados e sem volumes de dados); não adicionar volumes para estado.

---

## 🎨 Identidade visual

- **Tema escuro (dark)** em todo o site.
- **Cards** com borda sutil (`border-border`), fundo `bg-surface`, cantos `rounded-xl`/`rounded-2xl` e glow azul sutil no hover (`hover:shadow-glow`).
- **Foto de perfil** circular com moldura em gradiente azul (`from-primary via-primary/20 to-primary-light/60`), `shadow-glow` e aura desfocada ao fundo.
- **Hero** com fundo em grid (`bg-grid`, máscara radial) e terminal decorativo.
- **Micro-interações discretas**: reveal on scroll (fade + translateY 14px), zoom suave em imagens no hover, menu mobile animado.
- **Micro-acento amarelo** como assinatura visual (ver "Regra de uso do amarelo").
- Classes de utilidade custom: `container-main`, `bg-grid` (definidas em `src/css/style.css`).

---

## 🎨 Paleta (design tokens — `src/css/style.css`)

| Token              | Valor      | Uso                                              |
| ------------------ | ---------- | ------------------------------------------------ |
| `background`       | `#05070d`  | Fundo da página / inputs                         |
| `surface`          | `#0a1020`  | Cards, painéis                                   |
| `surface-2`        | `#101a30`  | Superfícies elevadas, áreas internas dos cards   |
| `primary`          | `#2563eb`  | **Azul escuro** — ações, acentos, "Experiência"  |
| `primary-light`    | `#38bdf8`  | **Azul claro** — destaques secundários, "Estudo" |
| `accent`           | `#eab308`  | **Amarelo** — APENAS micro-acento (ver regra)    |
| `foreground`       | `#f8fafc`  | Texto principal                                  |
| `muted`            | `#94a3b8`  | Texto secundário / "Conhecimento"                |
| `border`           | `rgb(248 250 252 / 0.08)` | Bordas sutis                          |
| `success`          | `#22c55e`  | Feedback de sucesso (formulário de contato)      |
| `danger`           | `#f87171`  | Feedback de erro (validação do formulário)       |

Sombras: `shadow-card` (elevação), `shadow-glow` (glow azul sutil), `shadow-glow-accent` (glow amarelo — raro).

**Regra:** use sempre os tokens do `@theme`, nunca cores "hardcoded" diferentes. Prefira `primary`/`primary-light` para tons de azul e o token correspondente do tema — evite paletas padrão do Tailwind (ex.: `slate-*`, `blue-*`).

---

## 🔤 Tipografia

| Token       | Fonte                         | Uso                              |
| ----------- | ----------------------------- | -------------------------------- |
| `font-sans` | Inter                         | Texto de corpo, UI               |
| `font-display` | Space Grotesk             | Títulos (`h1`–`h4`, automaticamente) |
| `font-mono` | JetBrains Mono                | Código, chips, rótulos técnicos  |

Regras base (`@layer base`):
- Títulos `h1–h4`: Space Grotesk, peso 600, `line-height: 1.15`, `letter-spacing: -0.02em`.
- `code`, `kbd`, `samp`, `pre`: JetBrains Mono.
- Rótulos de seção em fonte mono, caixa alta e `tracking-widest` (ex.: `01 — Sobre`).

---

## ⚠️ Regra de uso do amarelo (`accent`)

O amarelo é **SOMENTE micro-acento** (assinatura visual) e deve ser **extremamente discreto**:

- ✅ Permitido em: números de seção e do processo, ponto de "Interesse" na stack, selo "Estudo de caso", o sufixo `.DEV` da marca, detalhes de borda/linhas do processo (`accent/25`), aviso de status do formulário (`accent/30`).
- ❌ **Nunca** em grandes áreas, fundos inteiros, botões primários, cards inteiros ou textos longos.
- O glow amarelo (`shadow-glow-accent`) é raro e ultra sutil.

---

## 🧭 Princípios de UX

- **Simplicidade e clareza**: cada seção comunica uma ideia única; evitar ruído visual.
- **Conteúdo conduzido por dados**: cards de projetos/serviços/presença são gerados dos arquivos `data/` — o HTML não contém conteúdo duplicado.
- **Padrão "estudo de caso"** para projetos: contexto, problema/objetivo, tecnologias e links (demo + GitHub).
- **Cada projeto = card** com título, descrição curta, bloco "Problema / Objetivo" e chips de tecnologias.
- **Micro-interações discretas**: reveal on scroll suave, zoom sutil no hover de imagens, transições rápidas.
- **Duplo caminho de conversão**: o site bifurca o visitante em VAGA (recrutador) x PROJETO (cliente) no hub `#caminhos`, com **estado de disponibilidade** em `data/disponibilidade.js` (badges e CTAs por público, alternáveis por dados).
- **Feedback honesto**: o formulário envia via `POST /api/contato` (que entrega o e-mail real via SMTP). Se o servidor não estiver disponível, **não finge envio nem abre o app de e-mail do visitante** — mostra erro claro no `role="status"`.
- **Links externos** abrem em nova aba com `rel="noopener noreferrer"`.
- **Layout responsivo** em todos os breakpoints (mobile → desktop), com menu mobile próprio.

---

## ♿ Princípios de acessibilidade

- **HTML semântico**: `header`, `main`, `section` com `aria-labelledby`, `footer`, listas corretas (`ul`/`ol`).
- **Skip link** ("Pular para o conteúdo") visível apenas no foco.
- **Formulário**: `label` associado a todo campo, `autocomplete`, validação nativa (`required`, `type="email"`) **+ validação inline em pt-BR** (`aria-invalid` + `aria-describedby`), `inputmode`/`enterkeyhint` no mobile, alvo de toque ≥ 44px e `role="status"` para o aviso de status.
- **Menu mobile**: `aria-expanded`, `aria-label` dinâmico, fecha com `Escape`, **devolve o foco** ao botão ao fechar.
- **Foco visível consistente**: `:focus-visible` com outline `primary`.
- **`prefers-reduced-motion: reduce`**: todas as animações/transições são colapsadas; o conteúdo revelado fica sempre visível (CSS + JS em `reveal.js`).
- **Elementos decorativos** com `aria-hidden="true"` e/ou `pointer-events-none`.
- **Imagens** com `alt` descritivo.
- **Fallback seguro** em `reveal.js`: sem `IntersectionObserver`, o conteúdo é revelado imediatamente (nunca fica oculto).

---

## ⚡ Princípios de performance

- **Build otimizado** via Vite (bundling + minificação para `dist/`).
- **Tree-shaking de ícones**: importar SOMENTE os ícones Lucide usados, mapeados por nome PascalCase (ex.: `"code-2"` → `Code2`).
- **Fontes** com `preconnect` para `fonts.googleapis.com` e `fonts.gstatic.com`.
- **Imagens leves**: preferir PNG/WebP otimizados; **evitar GIFs pesados** (usar WebP animado ou `<video>` para demos). Screenshots em `public/screenshots/`.
- **Sem dependências pesadas**: nada de bibliotecas grandes só para um efeito pequeno. A única chamada de rede é o envio do formulário (`POST /api/contato`), feita com `fetch` nativo.
- **Reveal on scroll** para de observar após o primeiro gatilho (`unobserve`).
- **SEO** já configurado: `robots.txt`, `sitemap.xml`, meta tags, Open Graph e Twitter Card no `index.html`.

---

## 📁 Estrutura prevista

```
jmattosdev/
├── index.html              # HTML principal (todas as seções; dinâmicas = container vazio)
├── server.js               # Express: serve dist/ + POST /api/contato
├── package.json            # Dependências e scripts
├── vite.config.js          # Config do Vite (plugin Tailwind v4)
├── Dockerfile              # Build multi-stage (Vite → runtime Express, porta 3001)
├── docker-compose.yml      # Orquestração de produção (VPS)
├── docker-compose.dev.yml  # Orquestração de desenvolvimento (hot-reload)
├── .gitignore              # Arquivos ignorados pelo Git
├── .dockerignore           # Arquivos ignorados no build da imagem
├── .env.example            # Modelo das variáveis de ambiente (o .env real não é versionado)
├── DEPLOY.md               # Guia de deploy (VPS + Docker + Docker Compose)
├── AI_GUIDELINES.md        # Este arquivo
├── plans/                  # Planos/arquitetura (ex.: modernizar-secao-contato.md)
├── public/                 # Estáticos servidos na raiz
│   ├── favicon.svg
│   ├── jmattos.webp
│   ├── og-image.svg        # Imagem Open Graph (1200x630) para compartilhamento
│   ├── robots.txt
│   ├── sitemap.xml
│   ├── icons/              # Ícones customizados (ex.: whatsapp.svg)
│   └── screenshots/        # Imagens/screenshots dos projetos (ex.: projeto-1.gif, projeto-2.png)
└── src/
    ├── css/
    │   └── style.css       # Design tokens (@theme) + Tailwind v4 (CSS-first)
    └── js/
        ├── main.js         # Ponto de entrada (ícones + renderização + menu + contato + reveal)
        ├── projects.js     # Renderiza a seção Projetos (com zoom Lightbox)
        ├── servicos.js     # Renderiza a seção Serviços
        ├── presenca.js     # Renderiza a seção Presença profissional
        ├── disponibilidade.js # Badge de disponibilidade + hub de caminhos (VAGA x PROJETO)
        ├── contato.js      # Seção Contato (envio via API + feedback honesto de status)
        ├── whatsapp.js     # Botão flutuante de WhatsApp (canto inferior direito)
        ├── scrollspy.js    # Destaca o link da seção ativa na navbar
        ├── lightbox.js     # Modal acessível para visualização ampliada de screenshots
        ├── reveal.js       # Animação reveal on scroll
        ├── reveal-estrutural.js # Reveal direcional para blocos estruturais
        └── data/           # Fontes ÚNICAS de verdade (dados)
            ├── projects.js
            ├── servicos.js
            ├── presenca.js
            ├── contato.js
            └── disponibilidade.js
```

---

## 📐 Regras de código

- **Dados ≠ HTML**: todo conteúdo dinâmico (projetos, serviços, presença, contato) vive em `src/js/data/*.js`. O HTML contém apenas o cabeçalho da seção e um container vazio (ex.: `<div data-projetos>`).
- **Idioma**: código e comentários em **pt-BR**; interface do site em pt-BR.
- **ES Modules**: imports/exports nomeados (`export function`, `export const`).
- **Segurança**: antes de `innerHTML`, escapar caracteres (`&`, `<`, `>`, `"`, `'`) — ver `escapeHTML` em `projects.js`.
- **Ícones dinâmicos**: após inserir HTML via JS, chamar `createIcons` **novamente** para converter os `<i data-lucide>` adicionados.
- **Estilos**: usar tokens do `@theme` e utilitários do Tailwind; classes custom só via `@utility` quando não houver util nativo.
- **Semântica e acessibilidade** sempre (ver princípios acima).
- **Não duplicar** conteúdo: uma informação = um lugar (a fonte é o arquivo `data/`).

---

## 📦 Dependências permitidas

Dependências atuais (ver `package.json`):

- **Runtime**: `express` (servidor), `lucide` (ícones), `nodemailer` (envio de e-mail via SMTP/Gmail) e `express-rate-limit` (proteção do endpoint de contato).
- **Dev**: `vite`, `tailwindcss`, `@tailwindcss/vite`.

Regras:

- **NÃO adicionar** frameworks de frontend (React, Vue, etc.) ou bibliotecas de UI sem solicitação explícita.
- **NÃO adicionar** dependências apenas para efeitos cosméticos que podem ser resolvidos com CSS/JS puro.
- **NÃO adicionar** banco de dados, SSR ou frameworks — o frontend é estático e a única parte de servidor é o [`server.js`](server.js) (Express), que serve o build e a rota `POST /api/contato` (envia o e-mail real via `nodemailer` + Gmail SMTP, com credenciais em variáveis de ambiente `SMTP_USER`/`SMTP_PASS`/`SMTP_TO`).
- Qualquer nova dependência deve ter justificativa clara e ser aprovada pelo dono do projeto.

---

## 🚫 Regra de não inventar conteúdo profissional

- **NÃO inventar** projetos, serviços, URLs, e-mails, links, números de experiência, certificações ou clientes.
- Manter `null` ou placeholders `[...]` até que os dados reais sejam fornecidos.
- `src/js/data/projects.js`: não criar projetos fictícios; manter a estrutura de placeholder até haver dados reais.
- `src/js/data/servicos.js`: array deve permanecer **vazio** até os serviços serem confirmados (a seção mostra placeholders "a confirmar").
- `src/js/data/presenca.js`: `url` permanece `null` até o link real ser fornecido (o card mostra "[Link pendente]"). O canal "WhatsApp" aqui também é a **fonte única** do botão flutuante e dos CTAs da seção Contato.
- `src/js/data/contato.js`: e-mail permanece placeholder até o endereço real ser fornecido (links desabilitados + aviso via `role="status"`). Contém também `assunto`, `tempoResposta` e `tiposProjeto` (opções do select "Assunto do contato", incluindo "Proposta de vaga" para a triagem de recrutadores).
- `src/js/data/disponibilidade.js`: estado de disponibilidade (aberto para vaga / aceitando projetos) e textos das badges/CTAs por público — os valores booleanos são decisão do dono e alternam o que o site comunica.
- **Regra de ouro:** se um dado não foi fornecido, **não o crie** — mostre o estado de placeholder existente.

---

## 🧹 Regra de não criar complexidade sem necessidade

- **YAGNI / KISS**: implementar apenas o que foi solicitado; evitar abstrações, configurações e componentes desnecessários.
- Manter o projeto **simples**: não introduzir banco, SSR ou frameworks extras sem motivo real. O único backend é o [`server.js`](server.js) (Express) — usá-lo apenas para o que ele já faz (servir build + `POST /api/contato`).
- **Não refatorar** código funcional sem solicitação.
- **Não adicionar** features não pedidas, mesmo que pareçam úteis — propor antes, implementar depois de aprovação.
- Preferir a solução mais simples que atenda ao requisito, mantendo consistência com o padrão existente do projeto.

---

© JMATTOS.DEV — Julio Mattos
