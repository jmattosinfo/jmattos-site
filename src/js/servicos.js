// ============================================================
// RENDERIZAÇÃO DA SEÇÃO DE SERVIÇOS
// ------------------------------------------------------------
// Lê os dados de src/js/data/servicos.js e transforma cada objeto
// em um card. Enquanto o array estiver vazio (nenhum serviço
// confirmado), exibe cards placeholder "a confirmar" para que o
// layout fique visível sem inventar serviços.
//
// Os ícones são resolvidos pelo lucide via atributo data-lucide,
// por isso main.js chama createIcons NOVAMENTE após esta função.
// ============================================================
import { servicos } from "./data/servicos.js";

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

// ---------- Card de um serviço real (usado quando houver dados) ----------
function cardServico(servico, indice) {
  const numero = String(indice + 1).padStart(2, "0");
  const icone = servico.icone || "circle-dot";

  return `
    <article class="flex flex-col rounded-xl border border-border bg-surface p-6 transition-[border-color,transform] duration-300 hover:-translate-y-1 hover:border-accent/30">
      <div class="flex items-center justify-between">
        <i data-lucide="${escapeHTML(icone)}" class="h-5 w-5 text-primary-light" aria-hidden="true"></i>
        <span class="font-mono text-xs text-accent">${numero}</span>
      </div>
      <h3 class="mt-4 text-lg">${escapeHTML(servico.titulo)}</h3>
      <p class="mt-2 text-sm leading-relaxed text-muted">${escapeHTML(servico.descricao)}</p>
    </article>`;
}

// ---------- Cards placeholder (array vazio) ----------
// 4 cards genéricos, claramente marcados como "a confirmar".
// Nada aqui é um serviço real: apenas o esqueleto visual da seção.
function cardsPlaceholder() {
  return Array.from({ length: 4 }, (_, indice) => {
    const numero = String(indice + 1).padStart(2, "0");
    return `
      <article class="flex flex-col rounded-xl border border-dashed border-border bg-surface/40 p-6">
        <div class="flex items-center justify-between">
          <i data-lucide="circle-dot" class="h-5 w-5 text-muted/50" aria-hidden="true"></i>
          <span class="font-mono text-xs text-accent/70">${numero}</span>
        </div>
        <h3 class="mt-4 text-lg">[SERVIÇO ${numero}]</h3>
        <p class="mt-2 text-sm leading-relaxed text-muted">
          [NOME E DESCRIÇÃO — aguardando confirmação do serviço oferecido]
        </p>
        <p class="mt-5 border-t border-border pt-3 font-mono text-[0.65rem] uppercase tracking-widest text-muted/60">
          A confirmar
        </p>
      </article>`;
  }).join("");
}

// ---------- Ponto de entrada ----------
// Renderiza a grade de cards dentro de <div data-servicos>.
export function renderizarServicos() {
  const container = document.querySelector("[data-servicos]");
  if (!container) return;

  const cards =
    servicos.length > 0
      ? servicos.map(cardServico).join("")
      : cardsPlaceholder();

  container.innerHTML = `
    <div class="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">${cards}</div>
    <p class="mt-8 max-w-2xl text-xs leading-relaxed text-muted">
      
    </p>`;
}
