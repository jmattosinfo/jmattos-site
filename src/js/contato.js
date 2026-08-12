// ============================================================
// LÓGICA DA SEÇÃO DE CONTATO — SEM BACKEND (v1)
// ------------------------------------------------------------
// Solução honesta e funcional: o formulário NÃO envia para um
// servidor e NÃO finge envio. Ao submeter, ele MONTRA um link
// mailto com nome, e-mail e mensagem pré-preenchidos e abre no
// cliente de e-mail do visitante.
//
// O e-mail de destino fica em src/js/data/contato.js. Enquanto
// for placeholder ("[SEU-EMAIL@EXEMPLO.com]"), o link direto fica
// desabilitado e o formulário mostra um aviso — nada de mailto
// quebrado nem de "mensagem enviada" falsa.
// ============================================================
import { contato } from "./data/contato.js";

// E-mail válido = tem "@", não é o placeholder "[...]"
function emailValido(email) {
  return typeof email === "string" && email.includes("@") && !email.includes("[");
}

// Monta o mailto com subject e body codificados (encodeURIComponent
// impede que caracteres especiais quebrem a URL — segurança).
function montarUrlMailto({ nome, email, mensagem }) {
  const assunto = encodeURIComponent(contato.assunto);
  const corpo = encodeURIComponent(
    `Olá!\n\nMeu nome é ${nome}.\n\n${mensagem}\n\n—\n${nome}\nE-mail: ${email}`,
  );
  return `mailto:${contato.email}?subject=${assunto}&body=${corpo}`;
}

// Abre o mailto por um <a> temporário (mais confiável entre navegadores).
function abrirMailto(url) {
  const ancora = document.createElement("a");
  ancora.href = url;
  document.body.appendChild(ancora);
  ancora.click();
  ancora.remove();
}

export function initContato() {
  const form = document.querySelector("[data-contato-form]");
  const linkEmail = document.querySelector("[data-contato-email]");
  const textoEmail = document.querySelector("[data-contato-email-text]");
  const status = document.querySelector("[data-contato-status]");

  // ---------- Link direto de e-mail ----------
  if (linkEmail) {
    const destino = textoEmail || linkEmail;
    destino.textContent = contato.email;

    if (emailValido(contato.email)) {
      linkEmail.href = `mailto:${contato.email}`;
      linkEmail.setAttribute("aria-label", `Enviar e-mail para ${contato.email}`);
      linkEmail.removeAttribute("aria-disabled");
      linkEmail.removeAttribute("title");
    } else {
      // Placeholder: não gera um mailto quebrado.
      linkEmail.setAttribute("aria-disabled", "true");
      linkEmail.setAttribute(
        "title",
        "E-mail de destino ainda não configurado — edite src/js/data/contato.js",
      );
      linkEmail.addEventListener("click", (evento) => evento.preventDefault());
    }
  }

  if (!form) return;

  // ---------- Formulário (monta mailto — sem envio real) ----------
  form.addEventListener("submit", (evento) => {
    evento.preventDefault();

    // Sem e-mail de destino configurado, apenas avisa (honesto).
    if (!emailValido(contato.email)) {
      if (status) {
        status.textContent =
          "E-mail de destino ainda não configurado. Adicione o endereço em src/js/data/contato.js.";
        status.hidden = false;
      }
      return;
    }

    // A validação nativa (required + type=email) já garantiu os
    // campos preenchidos antes de este handler rodar.
    const dados = new FormData(form);
    const nome = String(dados.get("nome") || "").trim();
    const email = String(dados.get("email") || "").trim();
    const mensagem = String(dados.get("mensagem") || "").trim();

    abrirMailto(montarUrlMailto({ nome, email, mensagem }));
  });
}
