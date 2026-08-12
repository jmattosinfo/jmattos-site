// ============================================================
// RENDERIZAÇÃO DA SEÇÃO DE PRESENÇA PROFISSIONAL
// ------------------------------------------------------------
// Lê os dados de src/js/data/presenca.js e transforma cada canal
// em um card. Enquanto o campo url for null (link não fornecido),
// o card exibe "[Link pendente]" no lugar do link — nenhuma URL é
// inventada e nenhum link quebrado é gerado.
//
// LINKS EXTERNOS:
// • target="_blank" abre em nova aba (não "rouba" a página atual).
// • rel="noopener noreferrer" impede que a página aberta acesse a
//   janela de origem (window.opener) e bloqueia o envio do
//   referrer — evita tabnabbing e vazamento da origem.
// • Links internos (ex.: mailto:) NÃO usam nova aba — o protocolo
//   já delega para o aplicativo de e-mail.
//
// ACESSIBILIDADE:
// • O aria-label informa o destino do link e o comportamento
//   "abre em nova aba" para quem usa leitor de tela.
// • Os ícones são decorativos (aria-hidden="true"); o texto do
//   link já comunica a ação.
// • Os ícones são resolvidos pelo lucide via atributo data-lucide,
//   por isso main.js chama createIcons APÓS esta função.
// ============================================================
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

// ---------- Link de ação ----------
// Com url: gera <a> real. Para links externos aplica target + rel.
// Sem url: exibe placeholder "[Link pendente]" (sem âncora quebrada).
function linkAcao(canal) {
  if (canal.url) {
    const externa = canal.externa
      ? ' target="_blank" rel="noopener noreferrer"'
      : "";

    // aria-label substitui o texto visível para leitores de tela:
    // informa a ação E o comportamento de abrir em nova aba.
    const rotulo = canal.externa
      ? `${canal.rotuloAcao} em ${canal.nome} — abre em nova aba`
      : `${canal.rotuloAcao} em ${canal.nome}`;

    // A seta (indicador de link externo) só aparece em links externos
    const seta = canal.externa
      ? `<i data-lucide="arrow-up-right" class="h-4 w-4" aria-hidden="true"></i>`
      : "";

    return `
      <a
        href="${escapeHTML(canal.url)}"
        ${externa}
        class="mt-6 inline-flex items-center gap-2 text-sm font-medium text-primary-light transition-colors hover:text-foreground"
        aria-label="${escapeHTML(rotulo)}"
      >
        ${escapeHTML(canal.rotuloAcao)}
        ${seta}
      </a>`;
  }

  return `
    <p class="mt-6 font-mono text-xs uppercase tracking-widest text-muted/60">
      [Link pendente]
    </p>`;
}

// ---------- Card de um canal ----------
// Layout de "diretório profissional": ícone em caixa discreta,
// número pequeno, nome, descrição e link de ação com texto.
// Estilo uniforme (sem cores de marca) — não parece coleção de botões.
function cardCanal(canal, indice) {
  const numero = String(indice + 1).padStart(2, "0");

  return `
    <article class="flex flex-col rounded-xl border border-border bg-surface p-6 transition-[border-color,transform] duration-300 hover:-translate-y-1 hover:border-primary/40">
      <div class="flex items-center justify-between gap-3">
        <div class="flex items-center gap-3">
          <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border bg-surface-2">
            <i data-lucide="${escapeHTML(canal.icone)}" class="h-5 w-5 text-primary-light" aria-hidden="true"></i>
          </span>
          <h3 class="text-lg">${escapeHTML(canal.nome)}</h3>
        </div>
        <span class="font-mono text-xs text-accent">${numero}</span>
      </div>

      <p class="mt-4 flex-1 text-sm leading-relaxed text-muted">
        ${escapeHTML(canal.descricao)}
      </p>

      ${linkAcao(canal)}
    </article>`;
}

// ---------- Ponto de entrada ----------
// Renderiza a grade de cards dentro de <div data-presenca>.
export function renderizarPresenca() {
  const container = document.querySelector("[data-presenca]");
  if (!container) return;

  container.innerHTML = `
    <div class="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      ${canais.map(cardCanal).join("")}
    </div>`;
}
