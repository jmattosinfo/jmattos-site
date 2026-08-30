// Ponto de entrada do JavaScript.
import {
  createIcons,
  Menu,
  X,
  ArrowRight,
  Mail,
  Server,
  Code2,
  Wrench,
  ExternalLink,
  Target,
  FolderOpen,
  FolderGit2,
  CircleDot,
  Briefcase,
  Camera,
  MessageCircle,
  ArrowUpRight,
  Workflow,
  Headset,
  ChartColumn,
  Check,
  Clock,
  Copy,
  Send,
  ZoomIn,
} from "lucide";
import "../css/style.css";
import { renderizarProjetos } from "./projects.js";
import { renderizarServicos } from "./servicos.js";
import { renderizarPresenca } from "./presenca.js";
import { initDisponibilidade } from "./disponibilidade.js";
import { initContato } from "./contato.js";
import { initReveal } from "./reveal.js";
import { initRevealEstrutural } from "./reveal-estrutural.js";
import { initWhatsApp } from "./whatsapp.js";
import { initScrollspy } from "./scrollspy.js";
import { initLightbox } from "./lightbox.js";

// ---------- Renderização inicial de componentes dinâmicos ----------
renderizarProjetos();
renderizarServicos();
renderizarPresenca();
initDisponibilidade();

// ---------- Ícones Lucide (conversão unificada de SVGs) ----------
createIcons({
  icons: {
    Menu,
    X,
    ArrowRight,
    Mail,
    Server,
    Code2,
    Wrench,
    ExternalLink,
    Target,
    FolderOpen,
    FolderGit2,
    CircleDot,
    Briefcase,
    Camera,
    MessageCircle,
    ArrowUpRight,
    Workflow,
    Headset,
    ChartColumn,
    Check,
    Clock,
    Copy,
    Send,
    ZoomIn,
  },
});

// ---------- Menu mobile (hamburger + Focus Trap acessível) ----------
const menuToggle = document.querySelector("[data-menu-toggle]");
const mobileMenu = document.querySelector("[data-menu]");
const iconOpen = document.querySelector(".menu-icon-open");
const iconClose = document.querySelector(".menu-icon-close");

if (menuToggle && mobileMenu && iconOpen && iconClose) {
  const focusableSelectors = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

  const open = () => {
    mobileMenu.classList.remove("hidden");
    iconOpen.classList.add("hidden");
    iconClose.classList.remove("hidden");
    menuToggle.setAttribute("aria-expanded", "true");
    menuToggle.setAttribute("aria-label", "Fechar menu");

    // Move o foco para o primeiro link do menu
    const primeiroLink = mobileMenu.querySelector("a");
    if (primeiroLink) primeiroLink.focus();
  };

  const close = () => {
    const focoEstavaNoMenu = mobileMenu.contains(document.activeElement);

    mobileMenu.classList.add("hidden");
    iconOpen.classList.remove("hidden");
    iconClose.classList.add("hidden");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Abrir menu");

    // Acessibilidade: devolve o foco ao botão do menu ao fechar
    if (focoEstavaNoMenu) menuToggle.focus();
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

  // Focus trap e tecla Escape no menu mobile
  document.addEventListener("keydown", (event) => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    if (!isOpen) return;

    if (event.key === "Escape") {
      event.preventDefault();
      close();
      return;
    }

    if (event.key === "Tab") {
      const focusables = Array.from(mobileMenu.querySelectorAll(focusableSelectors));
      if (focusables.length === 0) return;

      const primeiro = focusables[0];
      const ultimo = focusables[focusables.length - 1];

      if (event.shiftKey) {
        if (document.activeElement === primeiro) {
          event.preventDefault();
          menuToggle.focus();
        } else if (document.activeElement === menuToggle) {
          event.preventDefault();
          ultimo.focus();
        }
      } else {
        if (document.activeElement === menuToggle) {
          event.preventDefault();
          primeiro.focus();
        } else if (document.activeElement === ultimo) {
          event.preventDefault();
          menuToggle.focus();
        }
      }
    }
  });
}

// ---------- Seção Contato (API + SMTP) ----------
initContato();

// ---------- Botão flutuante WhatsApp ----------
initWhatsApp();

// ---------- Scrollspy (navegação ativa conforme scroll) ----------
initScrollspy();

// ---------- Modal Lightbox (screenshots ampliadas) ----------
initLightbox();

// ---------- Reveal estrutural direcional ----------
initRevealEstrutural();

// ---------- Microinterações: reveal on scroll ----------
initReveal();
