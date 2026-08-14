// ============================================================
// REVEAL ON SCROLL — DISCRETO
// ------------------------------------------------------------
// Adiciona .is-revealed aos elementos [data-reveal] quando eles
// entram na viewport (IntersectionObserver). O CSS (style.css)
// controla o estado inicial oculto e a transição, e já respeita
// prefers-reduced-motion.
//
// DEGRADAÇÃO SEGURA:
//  • prefers-reduced-motion: reduce → não observa nada; o CSS já
//    deixa o conteúdo visível sem animação.
//  • Sem suporte a IntersectionObserver → revela tudo imediatamente
//    (o conteúdo nunca fica preso oculto).
// ============================================================
export function initReveal() {
  const elementos = document.querySelectorAll("[data-reveal]");
  if (elementos.length === 0) return;

  const reduzMovimento = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  // Fallback: reduz movimento OU navegador sem IntersectionObserver
  if (reduzMovimento || !("IntersectionObserver" in window)) {
    elementos.forEach((el) => el.classList.add("is-revealed"));
    return;
  }

  const observador = new IntersectionObserver(
    (entradas) => {
      entradas.forEach((entrada) => {
        if (entrada.isIntersecting) {
          entrada.target.classList.add("is-revealed");
          // Revela uma única vez: para de observar após o primeiro gatilho
          observador.unobserve(entrada.target);
        }
      });
    },
    {
      threshold: 0.15,
      rootMargin: "0px 0px -48px 0px", // só dispara 48px dentro da viewport
    },
  );

  elementos.forEach((el) => observador.observe(el));

  // ---------- Rede de segurança (fallback do IntersectionObserver) ----------
  // Em casos raros o IO pode não disparar (ex.: clipping de ancestral com
  // overflow, bug de navegador), deixando conteúdo com data-reveal "preso" em
  // opacity: 0 (seções invisíveis). Este fallback revela os elementos que JÁ
  // deveriam estar visíveis — no load e a cada scroll — garantindo que NADA
  // fique permanentemente oculto. É redundante quando o IO funciona, e salva
  // o layout quando ele falha.
  const revelarVisiveis = () => {
    elementos.forEach((el) => {
      if (el.classList.contains("is-revealed")) return;
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        el.classList.add("is-revealed");
        observador.unobserve(el);
      }
    });
  };

  window.addEventListener("load", revelarVisiveis);
  document.addEventListener("scroll", revelarVisiveis, { passive: true });
}
