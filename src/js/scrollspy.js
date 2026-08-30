// ============================================================
// SCROLLSPY — NAVEGAÇÃO ATIVA DINÂMICA
// ------------------------------------------------------------
// Observa as seções da página via IntersectionObserver e destaca
// o link correspondente na navbar desktop e no menu mobile conforme
// o usuário rola pelo conteúdo.
//
// ACESSIBILIDADE & PERFORMANCE:
// • Atualiza aria-current="page" no link ativo.
// • Usa threshold equilibrado e rootMargin para disparo antecipado.
// • Não afeta desempenho nem colide com outros observers.
// ============================================================

export function initScrollspy() {
  const linksDesktop = document.querySelectorAll("header nav.hidden ul a[href^='#']");
  const linksMobile = document.querySelectorAll("#menu-mobile a[href^='#']");
  const todosLinks = [...linksDesktop, ...linksMobile];

  if (todosLinks.length === 0 || !("IntersectionObserver" in window)) return;

  const secoesIds = [
    "hero",
    "caminhos",
    "sobre",
    "tecnologias",
    "projetos",
    "servicos",
    "processo",
    "contato",
  ];

  const secoes = secoesIds
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  if (secoes.length === 0) return;

  function ativarLink(idAtivo) {
    todosLinks.forEach((link) => {
      const href = link.getAttribute("href");
      const corresponde = href === `#${idAtivo}`;

      if (corresponde) {
        link.classList.add("nav-link-ativo");
        link.setAttribute("aria-current", "page");
      } else {
        link.classList.remove("nav-link-ativo");
        link.removeAttribute("aria-current");
      }
    });
  }

  // Mapa de visibilidade das seções
  const visibilidade = new Map();

  const observador = new IntersectionObserver(
    (entradas) => {
      entradas.forEach((entrada) => {
        visibilidade.set(entrada.target.id, entrada.isIntersecting ? entrada.intersectionRatio : 0);
      });

      // Identifica a seção com maior taxa de visibilidade na viewport
      let maiorRatio = 0;
      let secaoMaisVisivel = null;

      visibilidade.forEach((ratio, id) => {
        if (ratio > maiorRatio) {
          maiorRatio = ratio;
          secaoMaisVisivel = id;
        }
      });

      if (secaoMaisVisivel) {
        ativarLink(secaoMaisVisivel);
      }
    },
    {
      rootMargin: "-20% 0px -40% 0px",
      threshold: [0, 0.1, 0.25, 0.5, 0.75, 1],
    },
  );

  secoes.forEach((secao) => observador.observe(secao));
}

