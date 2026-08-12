// ============================================================
// RENDERIZAÇÃO DA SEÇÃO DE PROJETOS
// ------------------------------------------------------------
// Lê os dados de src/js/data/projects.js e transforma cada objeto
// em um card HTML (estudo de caso). A seção #projetos do HTML tem
// apenas um container vazio (<div data-projetos>); todo o conteúdo
// é gerado aqui.
//
// Os ícones são resolvidos pelo lucide via atributo data-lucide,
// por isso main.js chama createIcons NOVAMENTE após esta função.
// ============================================================
import { projetos } from "./data/projects.js";

// ---------- Utilitário de segurança ----------
// Escapa caracteres especiais antes de inserir no HTML via innerHTML.
// Os dados são controlados pelo dono do site, mas essa defesa evita
// quebra de layout (ex.: um "&" ou "<" acidental no texto) e injeção.
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

// ---------- Blocos menores do card ----------

// Screenshot: imagem real OU placeholder identificável enquanto
// não houver captura de tela. O overlay de hover só aparece quando
// existe link de demonstração.
function blocoScreenshot(projeto) {
  const numero = escapeHTML(projeto.id);
  const temImagem = Boolean(projeto.screenshot);

  const midia = temImagem
    ? `<img
         src="${escapeHTML(projeto.screenshot)}"
         alt="Screenshot do projeto ${escapeHTML(projeto.titulo)}"
         class="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
       />`
    : `<div
         class="flex h-full w-full flex-col items-center justify-center gap-2 bg-grid"
         aria-label="Screenshot ainda não disponível"
       >
         <i data-lucide="folder-open" class="h-8 w-8 text-muted/50" aria-hidden="true"></i>
         <span class="font-mono text-xs uppercase tracking-widest text-muted/60">
           [Screenshot ${numero} — adicionar imagem]
         </span>
       </div>`;

  // Overlay que aparece no hover (apenas se houver demonstração para abrir)
  const overlay = projeto.linkDemo
    ? `<a
         href="${escapeHTML(projeto.linkDemo)}"
         target="_blank"
         rel="noopener noreferrer"
         class="absolute inset-0 flex items-center justify-center gap-2 bg-background/60 opacity-0 backdrop-blur-[2px] transition-opacity duration-300 group-hover:opacity-100"
         aria-label="Abrir demonstração de ${escapeHTML(projeto.titulo)}"
       >
         <span class="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-foreground">
           <i data-lucide="external-link" class="h-4 w-4" aria-hidden="true"></i>
           Ver demonstração
         </span>
       </a>`
    : "";

  return `
    <div class="relative aspect-video overflow-hidden border-b border-border bg-surface-2">
      ${midia}
      ${overlay}
    </div>`;
}

// Botão "Ver demonstração" (renderizado apenas se houver link)
function botaoDemo(projeto) {
  if (!projeto.linkDemo) return "";
  return `
    <a
      href="${escapeHTML(projeto.linkDemo)}"
      target="_blank"
      rel="noopener noreferrer"
      class="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-primary/90"
    >
      <i data-lucide="external-link" class="h-4 w-4" aria-hidden="true"></i>
      Ver demonstração
    </a>`;
}

// Botão "Código no GitHub" (renderizado apenas se houver link)
function botaoGitHub(projeto) {
  if (!projeto.linkGitHub) return "";
  return `
    <a
      href="${escapeHTML(projeto.linkGitHub)}"
      target="_blank"
      rel="noopener noreferrer"
      class="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-surface-2"
    >
      <i data-lucide="folder-git-2" class="h-4 w-4" aria-hidden="true"></i>
      Código no GitHub
    </a>`;
}

// Lista de tecnologias (chips em fonte mono)
function blocoTecnologias(tecnologias) {
  const chips = tecnologias
    .map(
      (tec) => `
        <li class="rounded-md border border-border bg-background/40 px-2.5 py-1 font-mono text-xs text-foreground">
          ${escapeHTML(tec)}
        </li>`,
    )
    .join("");

  return `
    <div class="mt-6">
      <p class="font-mono text-xs uppercase tracking-widest text-muted">Tecnologias</p>
      <ul class="mt-3 flex flex-wrap gap-2">${chips}</ul>
    </div>`;
}

// ---------- Card completo (estudo de caso) ----------
function cardProjeto(projeto, indice) {
  const numero = String(indice + 1).padStart(2, "0");

  return `
    <article
      class="group relative overflow-hidden rounded-2xl border border-border bg-surface transition-all duration-300 ease-out hover:-translate-y-1.5 hover:border-primary/40 hover:shadow-glow"
    >
      <!-- Selo do estudo de caso (amarelo = micro-acento) -->
      <p class="absolute left-4 top-4 z-10 rounded-md bg-background/80 px-2 py-1 font-mono text-xs text-accent backdrop-blur-sm">
        ${numero} — Estudo de caso
      </p>

      ${blocoScreenshot(projeto)}

      <div class="p-6 sm:p-8">
        <h3 class="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
          ${escapeHTML(projeto.titulo)}
        </h3>
        <p class="mt-3 text-sm leading-relaxed text-muted">
          ${escapeHTML(projeto.descricaoCurta)}
        </p>

        <!-- Problema / Objetivo (diferencial do "estudo de caso") -->
        <div class="mt-6 rounded-xl border border-border bg-surface-2/60 p-4">
          <p class="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-primary-light">
            <i data-lucide="target" class="h-3.5 w-3.5" aria-hidden="true"></i>
            Problema / Objetivo
          </p>
          <p class="mt-2 text-sm leading-relaxed text-muted">
            ${escapeHTML(projeto.problema)}
          </p>
        </div>

        ${blocoTecnologias(projeto.tecnologias)}

        <div class="mt-8 flex flex-wrap items-center gap-3">
          ${botaoDemo(projeto)}
          ${botaoGitHub(projeto)}
        </div>
      </div>
    </article>`;
}

// ---------- Ponto de entrada ----------
// Renderiza os cards dentro de <div data-projetos>.
// Se o array estiver vazio, mostra um estado vazio claro
// (a seção não "quebra" antes de existirem dados reais).
export function renderizarProjetos() {
  const container = document.querySelector("[data-projetos]");
  if (!container) return;

  if (projetos.length === 0) {
    container.innerHTML = `
      <div class="rounded-2xl border border-dashed border-border bg-surface p-10 text-center">
        <p class="font-mono text-xs uppercase tracking-widest text-accent">Em construção</p>
        <p class="mt-3 text-muted">
          [Seus projetos aparecerão aqui. Adicione os objetos no arquivo
          <code class="font-mono text-primary-light">src/js/data/projects.js</code>.]
        </p>
      </div>`;
    return;
  }

  container.innerHTML = projetos.map(cardProjeto).join("");
}
