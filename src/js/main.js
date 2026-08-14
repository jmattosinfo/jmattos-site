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
} from "lucide";
import "../css/style.css";
import { renderizarProjetos } from "./projects.js";
import { renderizarServicos } from "./servicos.js";
import { renderizarPresenca } from "./presenca.js";
import { initContato } from "./contato.js";
import { initReveal } from "./reveal.js";

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

// ---------- Seção Projetos (dados em data/projects.js) ----------
// Os cards são montados dinamicamente por projects.js dentro de
// <div data-projetos>. Como o HTML dos cards é inserido DEPOIS do
// createIcons acima, chamamos createIcons novamente para converter
// os novos <i data-lucide> (dos cards) em SVGs.
renderizarProjetos();

// ---------- Seção Serviços (dados em data/servicos.js) ----------
// Os cards são montados dinamicamente por servicos.js dentro de
// <div data-servicos>. Mesmo processo do createIcons acima.
// Enquanto o array estiver vazio, exibe cards placeholder "a confirmar".
renderizarServicos();

// ---------- Seção Presença profissional (dados em data/presenca.js) ----------
// Os cards são montados dinamicamente por presenca.js dentro de
// <div data-presenca>. Enquanto a url for null, exibe "[Link pendente]".
renderizarPresenca();

// Depois de inserir o HTML dinâmico (projetos, serviços, presença),
// convertemos todos os <i data-lucide> pendentes em SVGs de uma vez.
createIcons({
  icons: {
    ExternalLink,
    Target,
    FolderOpen,
    FolderGit2,
    CircleDot,
    Briefcase,
    Camera,
    Mail,
    MessageCircle,
    ArrowUpRight,
    Code2,
    Workflow,
    Headset,
    ChartColumn,
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
    // Guarda se o foco estava dentro do menu (navegação por teclado)
    const focoEstavaNoMenu = mobileMenu.contains(document.activeElement);

    mobileMenu.classList.add("hidden");
    iconOpen.classList.remove("hidden");
    iconClose.classList.add("hidden");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Abrir menu");

    // Acessibilidade: devolve o foco ao botão do menu ao fechar,
    // para o usuário de teclado continuar de onde estava.
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

  // Fecha com a tecla Escape
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") close();
  });
}

// ---------- Seção Contato (sem backend) ----------
// Preenche o link direto de e-mail e liga o formulário: ao submeter,
// monta um mailto com a mensagem pronta (abre no cliente de e-mail).
// Não envia dados a servidor e não finge envio (ver contato.js).
initContato();

// ---------- Microinterações: reveal on scroll ----------
// Adiciona .is-revealed aos elementos [data-reveal] quando entram na
// viewport. Respeita prefers-reduced-motion (ver reveal.js + style.css).
initReveal();
