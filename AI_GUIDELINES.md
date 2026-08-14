# AI_GUIDELINES — JMATTOS.DEV

> **Documentação permanente para qualquer IA que trabalhar neste projeto.**
> Sempre que houver novas alterações solicitadas, considere este arquivo como **fonte de orientação**.
> Valores e regras abaixo foram extraídos do código real (`index.html`, `src/css/style.css`, `src/js/*`, `package.json`).

---

## 🎯 Objetivo do projeto

Site pessoal/portfólio profissional do **JMATTOS.DEV** (Julio Mattos) — apresentar trajetória, stack e serviços de forma clara e profissional, servindo como vitrine para oportunidades de trabalho e novos projetos.

- Site **estático** (sem backend, sem banco de dados).
- Foco em **simplicidade, performance e atenção aos detalhes**.
- Código organizado, de fácil manutenção e com **dados separados do HTML** (arquivos `data/` como fonte única de verdade).
- Todas as seções dinâmicas são renderizadas via JavaScript a partir de arquivos de dados.

Seções do site (ordem atual no `index.html`):

1. **Hero** — apresentação + terminal decorativo
2. **Sobre** — texto + foto de perfil com moldura gradiente azul e aura
3. **Stack** — cards de tecnologias com indicador de nível
4. **Projetos** — cards gerados dinamicamente (estudo de caso)
5. **Processo** — etapas de trabalho (Entender → Planejar → Desenvolver → Entregar)
6. **Serviços** — cards gerados dinamicamente
7. **Presença profissional** — redes/links externos
8. **Contato** — e-mail direto + formulário (mailto, sem backend)

---

## 🧰 Stack

| Camada    | Tecnologia                                                                 |
| --------- | -------------------------------------------------------------------------- |
| Frontend  | HTML5, CSS3, JavaScript (ES Modules)                                       |
| Estilos   | Tailwind CSS **v4** (configuração **CSS-first**, tokens no `@theme`)       |
| Build     | Vite                                                                       |
| Ícones    | **Lucide** (via tree-shaking no bundle, importando apenas os usados)       |
| Fontes    | Space Grotesk, Inter, JetBrains Mono (Google Fonts, com `preconnect`)      |
| Deploy    | Nginx / VPS (futuro) — site estático, `dist/` pronto para qualquer host    |

Scripts disponíveis (`package.json`): `npm run dev` · `npm run build` · `npm run preview`.

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
- **Feedback honesto**: o formulário **não finge envio** — monta um `mailto` e informa isso claramente.
- **Links externos** abrem em nova aba com `rel="noopener noreferrer"`.
- **Layout responsivo** em todos os breakpoints (mobile → desktop), com menu mobile próprio.

---

## ♿ Princípios de acessibilidade

- **HTML semântico**: `header`, `main`, `section` com `aria-labelledby`, `footer`, listas corretas (`ul`/`ol`).
- **Skip link** ("Pular para o conteúdo") visível apenas no foco.
- **Formulário**: `label` associado a todo campo, `autocomplete`, validação nativa (`required`, `type="email"`), `role="status"` para o aviso de status.
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
- **Site estático**: sem chamadas de rede desnecessárias; nada de bibliotecas grandes só para um efeito pequeno.
- **Reveal on scroll** para de observar após o primeiro gatilho (`unobserve`).
- **SEO** já configurado: `robots.txt`, `sitemap.xml`, meta tags, Open Graph e Twitter Card no `index.html`.

---

## 📁 Estrutura prevista

```
jmattosdev/
├── index.html              # HTML principal (todas as seções; dinâmicas = container vazio)
├── package.json            # Dependências e scripts
├── vite.config.js          # Config do Vite (plugin Tailwind v4)
├── .gitignore
├── AI_GUIDELINES.md        # Este arquivo
├── public/                 # Estáticos servidos na raiz
│   ├── favicon.svg
│   ├── jmattos.webp
│   ├── robots.txt
│   ├── sitemap.xml
│   └── screenshots/        # Imagens/screenshots dos projetos (ex.: projeto-1.png)
└── src/
    ├── css/
    │   └── style.css       # Design tokens (@theme) + Tailwind v4 (CSS-first)
    └── js/
        ├── main.js         # Ponto de entrada (ícones + renderização + menu + contato + reveal)
        ├── projects.js     # Renderiza a seção Projetos
        ├── servicos.js     # Renderiza a seção Serviços
        ├── presenca.js     # Renderiza a seção Presença profissional
        ├── contato.js      # Inicializa a seção Contato (mailto)
        ├── reveal.js       # Animação reveal on scroll
        └── data/           # Fontes ÚNICAS de verdade (dados)
            ├── projects.js
            ├── servicos.js
            ├── presenca.js
            └── contato.js
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

- **Runtime**: `lucide` (ícones).
- **Dev**: `vite`, `tailwindcss`, `@tailwindcss/vite`.

Regras:

- **NÃO adicionar** frameworks de frontend (React, Vue, etc.) ou bibliotecas de UI sem solicitação explícita.
- **NÃO adicionar** dependências apenas para efeitos cosméticos que podem ser resolvidos com CSS/JS puro.
- **NÃO adicionar** backend/database nesta fase — o projeto é **estático** e o contato usa `mailto`.
- Qualquer nova dependência deve ter justificativa clara e ser aprovada pelo dono do projeto.

---

## 🚫 Regra de não inventar conteúdo profissional

- **NÃO inventar** projetos, serviços, URLs, e-mails, links, números de experiência, certificações ou clientes.
- Manter `null` ou placeholders `[...]` até que os dados reais sejam fornecidos.
- `src/js/data/projects.js`: não criar projetos fictícios; manter a estrutura de placeholder até haver dados reais.
- `src/js/data/servicos.js`: array deve permanecer **vazio** até os serviços serem confirmados (a seção mostra placeholders "a confirmar").
- `src/js/data/presenca.js`: `url` permanece `null` até o link real ser fornecido (o card mostra "[Link pendente]").
- `src/js/data/contato.js`: e-mail permanece placeholder até o endereço real ser fornecido (links desabilitados + aviso via `role="status"`).
- **Regra de ouro:** se um dado não foi fornecido, **não o crie** — mostre o estado de placeholder existente.

---

## 🧹 Regra de não criar complexidade sem necessidade

- **YAGNI / KISS**: implementar apenas o que foi solicitado; evitar abstrações, configurações e componentes desnecessários.
- Manter o projeto **estático e simples**; não introduzir backend, banco, SSR ou frameworks extras sem motivo real.
- **Não refatorar** código funcional sem solicitação.
- **Não adicionar** features não pedidas, mesmo que pareçam úteis — propor antes, implementar depois de aprovação.
- Preferir a solução mais simples que atenda ao requisito, mantendo consistência com o padrão existente do projeto.

---

© JMATTOS.DEV — Julio Mattos
