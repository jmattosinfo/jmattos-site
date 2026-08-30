// ============================================================
// REVEAL ESTRUTURAL — DATA-REVEAL DIRECIONAL EM ELEMENTOS ESTRUTURAIS
// ------------------------------------------------------------
// Adiciona data-reveal="left"/"right" a elementos estruturais das
// seções (contêineres, cards, blocos de layout) que AINDA NÃO possuem
// reveal. A direção é decidida pela posição visual:
//
//   • Elemento na metade esquerda  → data-reveal="left"
//     (entra vindo da ESQUERDA — translateX(-50px) → 0).
//   • Elemento na metade direita   → data-reveal="right"
//     (entra vindo da DIREITA — translateX(+50px) → 0).
//   • Blocos de largura quase total (ex.: projetos em coluna única,
//     rodapé, colunas empilhadas no mobile) entram vindo da esquerda
//     — leitura LTR natural.
//
// REGRAS IMPORTANTES:
//   • NÃO toca em elementos que já possuem data-reveal (textos,
//     cabeçalhos com reveal-forte, cards de Caminhos/Contato etc.).
//   • A animação em si é feita pelo initReveal() (reveal.js), que já
//     usa IntersectionObserver, fallback seguro e prefers-reduced-motion.
//     Por isso esta função deve rodar ANTES do initReveal() no main.js.
//   • Com prefers-reduced-motion: reduce, nada é adicionado — o bloco
//     reduce do style.css mantém o conteúdo visível sem animação.
// ============================================================
export function initRevealEstrutural() {
  // Usuário pediu menos movimento: não adiciona nada (CSS já cobre).
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  // Elementos estruturais-alvo, por seletor. Cada um que já tiver
  // data-reveal é ignorado (nunca sobrescrevemos reveals existentes).
  const seletores = [
    "#sobre .max-w-3xl", // coluna de texto do Sobre (esquerda no desktop)
    "#tecnologias .grid > article", // cards da Stack
    "[data-projetos] article", // cards de projetos (coluna única)
    "[data-servicos] article", // cards de serviços
    "[data-presenca] article", // cards de presença
    "#formulario-contato", // formulário de contato (direita no desktop)
    "footer .grid", // colunas do rodapé
  ];

  const centroViewport = window.innerWidth / 2;
  const alvos = [];

  seletores.forEach((seletor) => {
    document.querySelectorAll(seletor).forEach((el) => {
      if (el.hasAttribute("data-reveal")) return;
      alvos.push(el);
    });
  });

  alvos.forEach((el) => {
    const rect = el.getBoundingClientRect();
    const centroElemento = rect.left + rect.width / 2;

    // Bloco largo (≥60% da viewport) entra vindo da esquerda (leitura LTR).
    // Caso contrário, a direção segue a posição horizontal do centro.
    const eBlocoLargo = rect.width > window.innerWidth * 0.6;
    const direcao =
      eBlocoLargo || centroElemento < centroViewport ? "left" : "right";

    el.setAttribute("data-reveal", direcao);
  });
}
