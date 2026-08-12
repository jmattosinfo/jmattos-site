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
}
