// ============================================================
// LIGHTBOX / MODAL DE SCREENSHOTS ACESSÍVEL
// ------------------------------------------------------------
// Exibe imagens de projetos ampliadas em uma camada modal.
//
// ACESSIBILIDADE & UX:
// • Suporte nativo ao elemento <dialog> com fallback seguro.
// • Fechamento via tecla Escape, clique no backdrop ou botão Fechar.
// • Bloqueio de rolagem do body enquanto aberto.
// • Devolve o foco ao botão/elemento que disparou a abertura.
// • Trap de foco automático para leitores de tela e navegação por Tab.
// ============================================================

let elementoDisparador = null;

export function abrirLightbox(src, alt = "", titulo = "") {
  const dialog = document.querySelector("[data-lightbox]");
  const img = document.querySelector("[data-lightbox-img]");
  const titleEl = document.querySelector("[data-lightbox-title]");
  const closeBtn = document.querySelector("[data-lightbox-close]");

  if (!dialog || !img) return;

  // Guarda o elemento com foco atual para devolver ao fechar
  elementoDisparador = document.activeElement;

  img.src = src;
  img.alt = alt || "Visualização ampliada do projeto";
  if (titleEl) {
    titleEl.textContent = titulo || "Visualização do projeto";
  }

  // Remove classe hidden e exibe com animação
  dialog.classList.remove("hidden");
  dialog.classList.add("flex");
  document.body.style.overflow = "hidden";

  // Se o navegador suportar showModal
  if (typeof dialog.showModal === "function") {
    try {
      if (!dialog.open) dialog.showModal();
    } catch {
      // Ignora se já estiver aberto
    }
  }

  // Coloca o foco no botão de fechar para acessibilidade
  setTimeout(() => {
    if (closeBtn) closeBtn.focus();
  }, 50);
}

export function fecharLightbox() {
  const dialog = document.querySelector("[data-lightbox]");
  const img = document.querySelector("[data-lightbox-img]");

  if (!dialog) return;

  dialog.classList.add("hidden");
  dialog.classList.remove("flex");
  document.body.style.overflow = "";

  if (typeof dialog.close === "function" && dialog.open) {
    dialog.close();
  }

  if (img) {
    img.src = "";
    img.alt = "";
  }

  // Devolve o foco para o elemento original
  if (elementoDisparador && typeof elementoDisparador.focus === "function") {
    elementoDisparador.focus();
    elementoDisparador = null;
  }
}

export function initLightbox() {
  const dialog = document.querySelector("[data-lightbox]");
  const closeBtn = document.querySelector("[data-lightbox-close]");

  if (!dialog) return;

  // Fechar ao clicar no botão
  if (closeBtn) {
    closeBtn.addEventListener("click", fecharLightbox);
  }

  // Fechar ao clicar no backdrop (fora da caixa de conteúdo)
  dialog.addEventListener("click", (evento) => {
    if (evento.target === dialog) {
      fecharLightbox();
    }
  });

  // Fechar ao pressionar Escape
  document.addEventListener("keydown", (evento) => {
    if (evento.key === "Escape" && !dialog.classList.contains("hidden")) {
      evento.preventDefault();
      fecharLightbox();
    }
  });

  // Ouvinte global para elementos com [data-abrir-lightbox]
  document.addEventListener("click", (evento) => {
    const botao = evento.target.closest("[data-abrir-lightbox]");
    if (!botao) return;

    evento.preventDefault();
    const src = botao.getAttribute("data-lightbox-src");
    const alt = botao.getAttribute("data-lightbox-alt") || "";
    const titulo = botao.getAttribute("data-lightbox-title") || "";

    if (src) {
      abrirLightbox(src, alt, titulo);
    }
  });
}

