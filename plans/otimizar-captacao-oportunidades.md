# Plano — Otimização do JMATTOS.DEV como canal de captação de oportunidades

> Objetivo: transformar o portfólio linear atual em um site de **duplo caminho (dual-path)** que
> orienta cada visitante — **recrutador/empresa (vaga)** ou **cliente (contratar serviço)** — pelo
> fluxo mais curto até o próximo passo, com um **estado de disponibilidade** fácil de alternar.
>
> Direção confirmada pelo dono: os dois caminhos claros + estado de disponibilidade alternável.

> **Direção de entrada aprovada — Alternativa C** (ver
> [`plans/experiencia-entrada-duplo-caminho.md`](plans/experiencia-entrada-duplo-caminho.md:1)):
> hero enxuto com badge de status + 2 CTAs priorizados (vaga primário, projeto secundário);
> hub `#caminhos` logo após o hero com 2 cards (VAGA x PROJETO); adaptação leve via
> `?assunto=vaga|projeto` que pré-seleciona o assunto do formulário — **sem ocultar conteúdo**
> (preserva SEO e o visitante híbrido).

---

## 1. Contexto / estado atual

O site é uma single page ([`index.html`](index.html:1)) com ordem de seções:
Hero → Sobre → Stack → Projetos → Processo → Serviços → Presença → Contato.

Pontos que hoje **limitam a captação**:

- **Tratamento único de público**: o Hero tem CTAs genéricos ("Ver projetos", "Entrar em contato")
  em [`index.html`](index.html:149), sem separar o visitante que quer oferecer vaga do que quer contratar.
- **Sem estado de disponibilidade**: nada comunica "estou aberto a vaga" ou "estou aceitando projetos",
  o que reduz urgência e decisão de conversão.
- **Contato genérico**: o formulário ([`index.html`](index.html:652)) tem um select "Tipo de projeto"
  ([`src/js/data/contato.js`](src/js/data/contato.js:31)) com apenas tipos de projeto (site, sistema web, automação, outro) — não existe a opção "proposta de vaga" nem a triagem por público.
- **Navegação sem CTA**: a navbar ([`index.html`](index.html:65)) lista 6 âncoras, mas nenhum botão
  primário apontando para o próximo passo de conversão.
- **Hierarquia desfavorável ao cliente**: a seção de Serviços fica depois de Processo, ou seja, o
  visitante-cliente percorre muita navegação antes de ver "o que você entrega e quanto custa começar".

---

## 2. Objetivo da otimização

- **Bifurcar a experiência logo na entrada** em dois fluxos explícitos (VAGA x PROJETO), sem confundir
  quem já entrou por um deles.
- **Comunicar disponibilidade** de forma visível e alternável (arquivo de dados = fonte única).
- **Encurtar o caminho até a conversão** para cada público (menos cliques, microcopy com próximo passo).
- **Triagem automática** no contato (assunto/select) para o dono receber mensagens já categorizadas.
- **Manter as diretrizes do projeto**: dados ≠ HTML, sem dependências novas, sem inventar conteúdo,
  acessibilidade WCAG, amarelo apenas como micro-acento ([`AI_GUIDELINES.md`](AI_GUIDELINES.md:96)).

---

## 3. Arquitetura da experiência (dual-path)

```
Visitante
   │
   ▼
HUB DE CONVERSÃO (logo após o Hero: 2 cards)
   │
   ├──► CAMINHO VAGA (recrutador/empresa)
   │      Badge: aberto para vaga
   │      Evidências: Sobre → Stack → Projetos
   │      Conversão: LinkedIn / GitHub / E-mail / Enviar proposta
   │
   └──► CAMINHO PROJETO (cliente)
          Badge: aceitando projetos
          Oferta: Serviços → Processo → Projetos (casos)
          Conversão: WhatsApp / Formulário / Solicitar orçamento
```

```mermaid
flowchart TD
    A ---[Visitante chega ao site] --> B{Hub de conversão após o Hero}
    B -->|Recrutador ou empresa| C[Caminho VAGA]
    B -->|Cliente ou empresa| D[Caminho PROJETO]

    C --> C1[Badge aberto para vaga]
    C1 --> C2[Sobre + Stack + Projetos como evidências]
    C2 --> C3[LinkedIn / GitHub / E-mail]
    C3 --> C4[Enviar proposta - assunto Vaga]

    D --> D1[Badge aceitando projetos]
    D1 --> D2[Serviços + Processo + Projetos como casos]
    D2 --> D3[WhatsApp / Formulário de orçamento]
    D3 --> D4[Solicitar orçamento - assunto Projeto]

    C4 --> E[Contato segmentado por público]
    D4 --> E
    E --> F[Resposta em até 24h úteis]
```

---

## 4. Recomendações priorizadas

| Prioridade | Ação | Justificativa | Exemplo de aplicação | Arquivos afetados |
|---|---|---|---|---|
| **P0** | Criar **estado de disponibilidade** em fonte única de dados (novo `disponibilidade.js`): `abertoParaVaga`, `aceitandoProjetos`, textos/rótulos dos CTAs. | Comunicar abertura reduz fricção e cria urgência; alternar vira edição de 1 arquivo, sem tocar HTML. | Badge no Hero: "Disponível para novas oportunidades" / "Aceitando novos projetos". Se `aceitandoProjetos=false`, o CTA de orçamento mostra rótulo alternativo ("Agendar conversa"). | novo `src/js/data/disponibilidade.js`, novo `src/js/disponibilidade.js` |
| **P0** | **Hub de conversão** logo após o Hero: dois cards/CTAs segmentados (VAGA x PROJETO) com âncoras para o fluxo correspondente. | O visitante decide em segundos qual caminho seguir; reduz a taxa de abandono por ambiguidade. | Card A: "Oferecer uma vaga → Ver como me candidatei / Enviar proposta". Card B: "Quero um projeto ou site → Ver serviços / Solicitar orçamento". | [`index.html`](index.html:201) (nova seção após o Hero) |
| **P0** | Ajustar **CTAs do Hero** com microcopy de próximo passo e âncoras para o hub. | CTA genérico não orienta; microcopy explica o que acontece ao clicar. | Primário: "Quero um projeto/site" → `#caminhos`; secundário: "Oferecer uma vaga" → `#caminhos-vaga` (ou LinkedIn). | [`index.html`](index.html:149) |
| **P0** | Adicionar **CTA primário na navbar** (desktop + menu mobile) apontando para a conversão principal. | Navegação por âncora não converte sozinha; um botão visível guia o próximo passo em qualquer ponto do scroll. | Botão "Solicitar orçamento" à direita da navbar (desktop) e destaque no topo do menu mobile. | [`index.html`](index.html:64), [`index.html`](index.html:90) |
| **P1** | **Reordenar hierarquia**: subir a seção Serviços para antes de Processo. | Para o público-cliente, "o que você entrega" vem antes de "como você trabalha"; encurta o caminho até o orçamento. | Ordem: Hero → Hub → Sobre → Stack → Projetos → **Serviços** → Processo → Presença → Contato. | [`index.html`](index.html:403) (mover bloco Serviços) |
| **P1** | **Segmentar o contato**: ampliar o select para "Assunto do contato" incluindo "Proposta de vaga" e "Contratar serviço/projeto"; ajustar assuntos do e-mail/API. | Triagem automática: mensagens chegam categorizadas (vaga x projeto) no e-mail e no log do servidor. | Opções: Site / Sistema web / Automação-RPA / Proposta de vaga / Outro. Assunto: "Vaga — contato pelo portfólio" ou "Projeto — contato pelo portfólio". | [`src/js/data/contato.js`](src/js/data/contato.js:31), [`src/js/contato.js`](src/js/contato.js:34), [`server.js`](server.js:49) |
| **P1** | **Rodapé com dois blocos de caminho** (Para recrutadores / Para clientes) com links diretos. | Garante conversão em scrolls longos, sem depender de voltar ao topo. | Bloco recrutador: LinkedIn, GitHub, "Enviar proposta". Bloco cliente: Serviços, Processo, WhatsApp, "Solicitar orçamento". | [`index.html`](index.html:746) |
| **P1** | **Microcopy nos CTAs de conversão** em toda a página (hero, hub, serviços, contato). | Textos orientados ao próximo passo aumentam cliques e reduzem mensagens vagas. | Botões: "Enviar proposta de vaga", "Solicitar orçamento", "Chamar no WhatsApp", "Ver casos de uso". | [`index.html`](index.html:149), [`index.html`](index.html:536), [`src/js/servicos.js`](src/js/servicos.js:29) |
| **P2** | **Badge/link de CV** (se o dono fornecer URL) no caminho recrutador. | Recrutadores procuram currículo; um link direto reduz atrito. | CTA "Baixar CV" no hub de recrutador apontando para URL em `data/` (mantém `null`/pendente enquanto não houver URL — regra de não inventar). | novo `data/`, [`src/js/presenca.js`](src/js/presenca.js:29) ou novo data |
| **P2** | **Mensuração leve (opcional, sem dependência)**: usar UTMs/parâmetros no link do WhatsApp e, se o dono aprovar, um script de analytics externo. | Medir cliques por caminho permite iterar o que converte. Respeita a regra de não adicionar dependência npm. | Links WhatsApp com `?text=...Vaga` e `?text=...Projeto`; rastrear cliques nos CTAs via analytics aprovado. | [`src/js/data/presenca.js`](src/js/data/presenca.js:71), [`index.html`](index.html:758) |
| **P2** | **SEO/copy**: ajustar meta description e `og:title` para comunicar os dois públicos. | O título/descrição aparecem no Google e no compartilhamento; deixar claro "disponível para vaga e projetos". | `meta description`: "Desenvolvedor Full Stack disponível para novas oportunidades e projetos de sites/sistemas web." | [`index.html`](index.html:9) |

---

## 5. Detalhamento das mudanças por área

### 5.1 Estado de disponibilidade (P0)

**Fonte única:** novo arquivo `src/js/data/disponibilidade.js`:

```js
export const disponibilidade = {
  // Altere apenas estes dois valores para ligar/desligar cada público.
  abertoParaVaga: true,
  aceitandoProjetos: true,

  // Textos exibidos nas badges e nos CTAs (alternados automaticamente).
  rotuloVaga: "Aberto a novas oportunidades",
  rotuloProjeto: "Aceitando novos projetos",
  rotuloVagaOff: "Vaga: sob análise",
  rotuloProjetoOff: "Projetos: sob demanda / lista de espera",
  ctaProjeto: "Solicitar orçamento",
  ctaProjetoOff: "Agendar conversa",
};
```

**Renderização:** novo `src/js/disponibilidade.js` exporta `initDisponibilidade()` que:

- Injeta a badge no Hero (próximo ao rótulo `JMATTOS.DEV`) com o micro-acento amarelo/verde do design system.
- Ajusta o rótulo dos CTAs (ex.: CTA de orçamento vira "Agendar conversa" quando `aceitandoProjetos=false`).
- Alimenta o rodapé com os dois blocos de caminho.

> Regra: não inventar estado — os valores iniciais (true/false) são decisão do dono ao revisar o plano.
> O mecanismo já fica pronto para alternar com uma linha.

### 5.2 Hub de conversão (P0)

Nova seção `#caminhos` logo após o Hero, com **2 cards** no padrão visual atual
(`rounded-xl border border-border bg-surface p-6 hover:-translate-y-1`):

| Card | Público | Título sugerido | Conteúdo | CTA |
|---|---|---|---|---|
| A | Recrutador/empresa | "Procurando um desenvolvedor?" | Curto resumo do perfil + link para evidências (Sobre/Stack/Projetos) | "Ver meu perfil" (LinkedIn) + "Enviar proposta" (formulário com assunto Vaga) |
| B | Cliente | "Precisa de um site ou sistema?" | Oferta resumida (Serviços + Processo) | "Ver serviços" (âncora `#servicos`) + "Solicitar orçamento" (âncora `#contato`) |

Acessibilidade: `aria-labelledby` por card, links com rótulos claros e alvos de toque ≥ 44px.

### 5.3 Navegação (P0)

- **Navbar desktop** ([`index.html`](index.html:65)): manter as âncoras atuais + **botão primário**
  "Solicitar orçamento" à direita (usa `bg-primary`, mesmo padrão do CTA do Hero).
- **Menu mobile** ([`index.html`](index.html:90)): incluir no topo um link de destaque para o caminho
  do cliente ("Quero um projeto/site") e manter o restante.

### 5.4 Hierarquia (P1)

Mover o bloco `#servicos` (linhas [`index.html`](index.html:479) a [`index.html`](index.html:491))
para **antes** da seção `#processo` (linha [`index.html`](index.html:403)). A numeração mono das seções
(`03 — Projetos`, `04 — Processo`, `05 — Serviços`...) precisa ser reajustada para refletir a nova ordem.

Nova ordem das seções:
1. Hero
2. **Caminhos** (novo — sem numeração ou `01`)
3. Sobre
4. Stack
5. Projetos
6. Serviços (movido para antes de Processo)
7. Processo
8. Presença
9. Contato

### 5.5 Contato segmentado (P1)

- [`src/js/data/contato.js`](src/js/data/contato.js:31): renomear conceito de `tiposProjeto` para
  "assuntos do contato" (ou manter nome e ampliar), adicionando `{ valor: "vaga", rotulo: "Proposta de vaga" }`
  e `{ valor: "contratar", rotulo: "Contratar serviço/projeto" }`.
- [`src/js/contato.js`](src/js/contato.js:34): montar o assunto conforme o tipo (ex.: `[Vaga] ...` ou
  `[Projeto] ...`), já tratado em `montarUrlMailto`.
- [`index.html`](index.html:696): rótulo do select vira "Qual é o assunto?" com a primeira opção
  "Selecione o assunto".
- [`server.js`](server.js:49): já loga o `tipo`; nenhuma mudança estrutural necessária (opcional
  melhorar a mensagem do log).

### 5.6 CTAs e microcopy (P1)

Aplicar em toda a página (hero, hub, serviços, contato, rodapé) a mesma convenção:
**verbo de ação + resultado esperado**. Exemplos:

- "Solicitar orçamento" (não "Saiba mais")
- "Enviar proposta de vaga" (não "Contato")
- "Chamar no WhatsApp" (já existe)
- "Ver casos de uso" (em Projetos para o público-cliente)

Para isso, em [`src/js/servicos.js`](src/js/servicos.js:29), o `cardServico` ganha um link/CTA opcional
"Orçar este serviço" usando o `tipo` correspondente (dado controlado — sem inventar serviços).

### 5.7 Rodapé (P1)

Substituir o rodapé simples ([`index.html`](index.html:746)) por um layout com 2 blocos + e-mail:

- **Para recrutadores**: LinkedIn · GitHub · "Enviar proposta de vaga"
- **Para clientes**: Serviços · Processo · "Solicitar orçamento" · WhatsApp
- Linha final com © 2026 JMATTOS.DEV

### 5.8 Prova social / urgência (P2 — somente dados reais)

- O badge de disponibilidade já cria urgência honesta.
- Depoimentos/métricas **não serão inventados**; o plano reserva o espaço somente se o dono fornecer.

---

## 6. Arquivos afetados (resumo)

| Arquivo | Mudança |
|---|---|
| `index.html` | Hero (CTAs), nova seção `#caminhos`, navbar (CTA), reordenação de Serviços/Processo, contato (select/labels), rodapé (2 blocos), meta description |
| `src/js/data/disponibilidade.js` | **Novo** — fonte única do estado de disponibilidade e textos dos CTAs |
| `src/js/disponibilidade.js` | **Novo** — renderiza badge, controla rótulos de CTAs e blocos do rodapé |
| `src/js/data/contato.js` | Ampliar assuntos do contato (vaga, contratar serviço/projeto) |
| `src/js/contato.js` | Assunto dinâmico por público na montagem do e-mail |
| `src/js/servicos.js` | CTA opcional "Orçar este serviço" nos cards (dado controlado) |
| `src/js/main.js` | Importar/chamar `initDisponibilidade()` e registrar ícones novos (se usados) |
| `src/css/style.css` | Utilidades para a badge (se necessário) — preferir utilitários Tailwind |
| `server.js` | Apenas log opcional aprimorado (nenhuma mudança estrutural) |
| `AI_GUIDELINES.md` / `README.md` | Documentar a nova seção e o arquivo `data/disponibilidade.js` |

---

## 7. Restrições a respeitar (do AI_GUIDELINES)

- **Não inventar conteúdo**: valores de disponibilidade, CV, depoimentos e métricas permanecem
  controlados pelo dono; sem dados → estado neutro/placeholder honesto.
- **Dados ≠ HTML**: qualquer novo conteúdo (badges, CTAs, rodapé) vem de `data/`.
- **Sem dependências novas**: nada de libs de analytics/UI; tudo com JS/CSS puro (analytics externo
  só com aprovação explícita do dono).
- **Amarelo = micro-acento** apenas (badges discretas; nunca fundos/botões inteiros).
- **Acessibilidade WCAG**: labels, `aria-labelledby`, foco visível, toque ≥ 44px, `prefers-reduced-motion`.
- **YAGNI/KISS**: implementar apenas as fases P0/P1 por padrão; P2 apenas o que o dono aprovar.

---

## 8. Validação / critérios de aceite

- [ ] `npm run build` sem erros.
- [ ] Testar no mobile (menu mobile) e desktop (navbar CTA).
- [ ] Alternar `disponibilidade.js` (vaga/projetos on/off) e conferir badge + CTAs atualizando no site.
- [ ] Enviar o formulário com tipo "Proposta de vaga" e conferir assunto/triagem no e-mail/log.
- [ ] Conferir âncoras do hub de conversão (VAGA x PROJETO) rolando até a seção certa.
- [ ] Rodapé com os dois blocos funcionando em todos os links.
- [ ] Conferir contraste/leitor de tela nas novas áreas (badge, hub, rodapé).

---

© JMATTOS.DEV — plano de otimização para captação de oportunidades.
