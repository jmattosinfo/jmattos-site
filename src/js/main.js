// Ponto de entrada do JavaScript.
import { createIcons, Menu, X, ArrowRight, Mail, Server, Code2, Wrench } from "lucide";
import "../css/style.css";

// ---------- Ícones Lucide ----------
// Substitui cada <i data-lucide="..."> pelo SVG correspondente.
// Importamos SOMENTE os ícones usados (tree-shaking) e mapeamos por nome
// PascalCase — é assim que o createIcons resolve o data-lucide (ex.: "code-2" → Code2).
// As classes dos elementos <i> são preservadas no SVG gerado.
createIcons({
  icons: {
    Menu,
    X,
    ArrowRight,
    Mail,
    Server,
    Code2,
    Wrench,
  },
});

// ---------- Menu mobile (hamburger) ----------
const menuToggle = document.querySelector("[data-menu-toggle]");
const mobileMenu = document.querySelector("[data-menu]");
const iconOpen = document.querySelector(".menu-icon-open");
const iconClose = document.querySelector(".menu-icon-close");

if (menuToggle && mobileMenu && iconOpen && iconClose) {
  const open = () => {
    mobileMenu.classList.remove("hidden");
    iconOpen.classList.add("hidden");
    iconClose.classList.remove("hidden");
    menuToggle.setAttribute("aria-expanded", "true");
    menuToggle.setAttribute("aria-label", "Fechar menu");
  };

  const close = () => {
    mobileMenu.classList.add("hidden");
    iconOpen.classList.remove("hidden");
    iconClose.classList.add("hidden");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Abrir menu");
  };

  // Abre/fecha ao clicar no botão
  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    isOpen ? close() : open();
  });

  // Fecha ao clicar em qualquer link do menu (navegação por âncora)
  mobileMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", close);
  });

  // Fecha com a tecla Escape
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") close();
  });
}
