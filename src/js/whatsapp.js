// ============================================================
// BOTÃO FLUTUANTE — WHATSAPP
// ------------------------------------------------------------
// Link fixo no canto inferior esquerdo que leva o visitante a
// uma conversa no WhatsApp (wa.me) com mensagem pré-preenchida.
//
// FONTE ÚNICA DE VERDADE:
// O número e o texto da mensagem NÃO ficam duplicados aqui — são
// reutilizados do canal "WhatsApp" em src/js/data/presenca.js.
// Basta editar a URL lá que o botão (e o card da seção Presença)
// passam a apontar para o novo destino automaticamente.
//
// COMPORTAMENTO SEGURO:
// • Sem URL configurada, o botão não vira um link quebrado: fica
//   com aria-disabled + title explicativo e o clique é bloqueado
//   (mesmo padrão honesto já usado em src/js/contato.js).
// • Link externo com target="_blank" + rel="noopener noreferrer"
//   (protege contra tabnabbing e evita vazamento da origem).
// ============================================================
import { canais } from "./data/presenca.js";

export function initWhatsApp() {
  const botao = document.querySelector("[data-whatsapp]");
  if (!botao) return;

  // Busca o canal "WhatsApp" na fonte única de verdade (presenca.js).
  const canal = canais.find((c) => c.nome === "WhatsApp");

  if (canal && canal.url) {
    botao.href = canal.url;
    botao.setAttribute("aria-label", "Conversar comigo no WhatsApp — abre em nova aba");
    botao.removeAttribute("aria-disabled");
    botao.removeAttribute("title");
  } else {
    // Sem URL: não gera um link quebrado nem abre página indevida.
    botao.setAttribute("aria-disabled", "true");
    botao.setAttribute(
      "title",
      "Link do WhatsApp ainda não configurado — edite src/js/data/presenca.js",
    );
    botao.addEventListener("click", (evento) => evento.preventDefault());
  }
}
