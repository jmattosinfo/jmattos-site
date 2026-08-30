// ============================================================
// ESTADO DE DISPONIBILIDADE + HUB DE CAMINHOS — JMATTOS.DEV
// ------------------------------------------------------------
// Lê os dados de src/js/data/disponibilidade.js (fonte única) e:
//   • Preenche a badge de status no Hero ([data-disponibilidade-badge])
//   • Renderiza os cards do hub de conversão #caminhos (container [data-caminhos])
//   • Preenche os links de canais do rodapé ([data-canal-*])
//   • Aplica o destaque do card escolhido ao clicar nos CTAs do Hero
//     (adaptação leve, sem ocultar conteúdo)
//
// Links externos (LinkedIn/GitHub) são reutilizados de data/presenca.js
// (fonte única — não duplicamos URLs aqui).
// ============================================================
import { disponibilidade } from "./data/disponibilidade.js";
import { canais } from "./data/presenca.js";

// ---------- Utilitário de segurança ----------
// Escapa caracteres especiais antes de inserir no HTML via innerHTML.
const ENTIDADES_HTML = {
  "&": "\u0026amp;",
  "<": "\u0026lt;",
  ">": "\u0026gt;",
  '"': "\u0026quot;",
  "'": "\u0026#39;",
};

function escapeHTML(texto) {
  return String(texto).replace(/[&<>"']/g, (char) => ENTIDADES_HTML[char]);
}

// URL de um canal de data/presenca.js (fonte única de links).
function urlCanal(nome) {
  const canal = canais.find((c) => c.nome === nome);
  return canal && typeof canal.url === "string" ? canal.url : null;
}

// Troca classes utilitárias do Tailwind (usada para reconfigurar os CTAs
// do Hero quando o estado de disponibilidade muda — ex.: vaga fechada).
function trocarClasses(el, adicionar, remover) {
  el.classList.remove(...remover.split(" "));
  el.classList.add(...adicionar.split(" "));
}

// ---------- Badges de disponibilidade (micro-acento, discretas) ----------
// Verde (success) = caminho prioritário (vaga); amarelo (accent) apenas
// como micro-acento no selo do caminho secundário (projetos).
function badgeVaga() {
  if (disponibilidade.abertoParaVaga) {
    return `<span class="inline-flex items-center gap-2 rounded-full border border-success/30 bg-success/10 px-3 py-1.5">
      <span aria-hidden="true" class="h-1.5 w-1.5 rounded-full bg-success"></span>
      <span class="text-xs font-medium text-foreground">${escapeHTML(disponibilidade.rotuloBadgeVaga)}</span>
    </span>`;
  }
  return `<span class="inline-flex items-center gap-2 rounded-full border border-border bg-surface-2 px-3 py-1.5">
    <span aria-hidden="true" class="h-1.5 w-1.5 rounded-full bg-muted"></span>
    <span class="text-xs text-muted">${escapeHTML(disponibilidade.rotuloBadgeVagaOff)}</span>
  </span>`;
}

function badgeProjeto() {
  if (disponibilidade.aceitandoProjetos) {
    return `<span class="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1.5">
      <span aria-hidden="true" class="h-1.5 w-1.5 rounded-full bg-accent"></span>
      <span class="text-xs font-medium text-foreground">${escapeHTML(disponibilidade.rotuloBadgeProjeto)}</span>
    </span>`;
  }
  return `<span class="inline-flex items-center gap-2 rounded-full border border-border bg-surface-2 px-3 py-1.5">
    <span aria-hidden="true" class="h-1.5 w-1.5 rounded-full bg-muted"></span>
    <span class="text-xs text-muted">${escapeHTML(disponibilidade.rotuloBadgeProjetoOff)}</span>
  </span>`;
}

// ---------- Cards do hub de conversão (#caminhos) ----------
function cardVaga() {
  const linkedin = urlCanal("LinkedIn");
  const github = urlCanal("GitHub");
  const ativo = disponibilidade.abertoParaVaga;
  const cta = ativo ? disponibilidade.ctaVaga : disponibilidade.ctaVagaOff;
  const texto = ativo ? disponibilidade.textoCardVaga : disponibilidade.textoCardVagaOff;
  // Fechado para vaga: o CTA principal vira "Conhecer meu perfil" (#sobre),
  // sem pré-selecionar "Proposta de vaga" no formulário.
  const ctaHref = ativo ? "#contato" : "#sobre";
  const ctaAssunto = ativo ? ' data-assunto="vaga"' : "";

  return `
    <article data-caminho-card="vaga" data-reveal="left" class="flex flex-col rounded-xl border border-border bg-surface p-6 transition-[border-color,transform] duration-300 hover:-translate-y-1">
      <div class="flex flex-wrap items-start justify-between gap-3">
        <div class="flex items-center gap-3">
          <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border bg-surface-2">
            <i data-lucide="briefcase" class="h-5 w-5 text-primary-light" aria-hidden="true"></i>
          </span>
          <h3 class="text-lg">Procurando um desenvolvedor?</h3>
        </div>
        ${badgeVaga()}
      </div>
      <p class="mt-4 flex-1 text-sm leading-relaxed text-muted">${escapeHTML(texto)}</p>
      <div class="mt-6 flex flex-wrap items-center gap-3">
        <a href="#sobre" class="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-surface-2">
          Ver perfil completo
        </a>
        <a href="${ctaHref}"${ctaAssunto} class="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-primary/90">
          ${escapeHTML(cta)}
          <i data-lucide="arrow-right" class="h-4 w-4" aria-hidden="true"></i>
        </a>
      </div>
      <div class="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-border pt-4 text-sm">
        ${linkedin ? `<a href="${escapeHTML(linkedin)}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-2 text-primary-light transition-colors hover:text-foreground">LinkedIn<i data-lucide="arrow-up-right" class="h-4 w-4" aria-hidden="true"></i></a>` : ""}
        ${github ? `<a href="${escapeHTML(github)}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-2 text-primary-light transition-colors hover:text-foreground">GitHub<i data-lucide="arrow-up-right" class="h-4 w-4" aria-hidden="true"></i></a>` : ""}
      </div>
    </article>`;
}

function cardProjeto() {
  const cta = disponibilidade.aceitandoProjetos ? disponibilidade.ctaProjeto : disponibilidade.ctaProjetoOff;

  return `
    <article data-caminho-card="projeto" data-reveal="right" class="flex flex-col rounded-xl border border-border bg-surface p-6 transition-[border-color,transform] duration-300 hover:-translate-y-1">
      <div class="flex flex-wrap items-start justify-between gap-3">
        <div class="flex items-center gap-3">
          <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border bg-surface-2">
            <i data-lucide="code-2" class="h-5 w-5 text-primary-light" aria-hidden="true"></i>
          </span>
          <h3 class="text-lg">Precisa de um site ou sistema?</h3>
        </div>
        ${badgeProjeto()}
      </div>
      <p class="mt-4 flex-1 text-sm leading-relaxed text-muted">
        Desenvolvimento web, APIs e automação de processos (RPA). Como o foco atual é oportunidades de
        emprego, aceito projetos pontuais — sempre vale uma conversa.
      </p>
      <div class="mt-6 flex flex-wrap items-center gap-3">
        <a href="#servicos" class="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-surface-2">
          Ver serviços
        </a>
        <a href="#contato" class="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-primary/90">
          ${escapeHTML(cta)}
          <i data-lucide="arrow-right" class="h-4 w-4" aria-hidden="true"></i>
        </a>
      </div>
    </article>`;
}

// ---------- Ponto de entrada ----------
// Preenche badge, hub e rodapé; registra o destaque de caminho no Hero.
export function initDisponibilidade() {
  // Badge de status no topo do Hero
  const badge = document.querySelector("[data-disponibilidade-badge]");
  if (badge) {
    badge.innerHTML = `${badgeVaga()}${badgeProjeto()}`;
  }

  // Cards do hub de conversão (#caminhos)
  const container = document.querySelector("[data-caminhos]");
  if (container) {
    container.innerHTML = `${cardVaga()}${cardProjeto()}`;
  }

  // Links de canais do rodapé (fonte única: data/presenca.js)
  const canaisRodape = [
    { seletor: "[data-canal-linkedin]", nome: "LinkedIn", externa: true },
    { seletor: "[data-canal-github]", nome: "GitHub", externa: true },
    { seletor: "[data-canal-whatsapp]", nome: "WhatsApp", externa: true },
    { seletor: "[data-canal-email]", nome: "E-mail", externa: false },
  ];
  canaisRodape.forEach(({ seletor, nome, externa }) => {
    const el = document.querySelector(seletor);
    if (!el) return;
    const url = urlCanal(nome);
    if (url) {
      el.href = url;
      if (externa) {
        el.setAttribute("target", "_blank");
        el.setAttribute("rel", "noopener noreferrer");
      }
    } else {
      el.setAttribute("aria-disabled", "true");
      el.addEventListener("click", (evento) => evento.preventDefault());
    }
  });

  // Hero: quando NÃO aberto a vaga, o caminho de projeto vira o foco
  // (promovido a CTA primário) e o de vaga vira secundário apontando ao perfil.
  const ctaVaga = document.querySelector("[data-cta-hero-vaga]");
  const ctaProjeto = document.querySelector("[data-cta-hero-projeto]");
  if (ctaVaga && ctaProjeto && !disponibilidade.abertoParaVaga) {
    const textoVaga = ctaVaga.querySelector("[data-cta-hero-vaga-texto]");
    if (textoVaga) textoVaga.textContent = disponibilidade.ctaVagaOff;
    ctaVaga.href = "#sobre";
    ctaVaga.removeAttribute("data-caminho");
    trocarClasses(ctaVaga, "border border-border hover:bg-surface-2", "bg-primary hover:bg-primary/90");

    const iconeProjeto = ctaProjeto.querySelector("i");
    if (iconeProjeto) iconeProjeto.classList.remove("text-primary-light");
    ctaProjeto.href = "#caminhos";
    ctaProjeto.setAttribute("data-caminho", "projeto");
    trocarClasses(ctaProjeto, "bg-primary hover:bg-primary/90", "border border-border hover:bg-surface-2");
  }

  // Adaptação leve: destaca o card do caminho escolhido ao clicar nos
  // CTAs do Hero ([data-caminho]), sem esconder o outro caminho.
  document.querySelectorAll("[data-caminho]").forEach((ancora) => {
    ancora.addEventListener("click", (evento) => {
      evento.preventDefault();
      const caminho = ancora.getAttribute("data-caminho");
      document.querySelectorAll("[data-caminho-card]").forEach((card) => {
        card.classList.remove("caminho-destaque");
      });
      const card = document.querySelector(`[data-caminho-card="${caminho}"]`);
      if (card) card.classList.add("caminho-destaque");
      const hub = document.querySelector("#caminhos");
      if (hub) hub.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
}
