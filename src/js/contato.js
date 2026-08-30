// ============================================================
// LÓGICA DA SEÇÃO DE CONTATO — ENVIO REAL VIA API (SMTP)
// ------------------------------------------------------------
// O formulário NÃO depende do app de e-mail do visitante:
// ao submeter, envia via fetch para POST /api/contato (server.js),
// que valida os dados e ENVIA o e-mail real via SMTP (Nodemailer
// + Gmail App Password) direto para o e-mail do dono.
//
// Comportamento honesto: se o envio falhar, mostra erro no status —
// NUNCA abre o app de e-mail do host nem "finge" o envio.
//
// Também cuida de:
//  • Link direto de e-mail + botão "copiar e-mail" (Clipboard API)
//  • Preenchimento dos CTAs de WhatsApp (fonte única: data/presenca.js)
//  • Validação com feedback inline (aria-invalid + aria-describedby)
//  • Honeypot anti-spam (campo escondido que só bots preenchem)
//
// Dados em src/js/data/contato.js (e-mail, assunto, tipos, resposta).
// ============================================================
import { contato } from "./data/contato.js";
import { canais } from "./data/presenca.js";

// Verifica se o e-mail de destino está configurado em data/contato.js (não é placeholder "[...]")
function isEmailConfigurado(email) {
  return typeof email === "string" && email.includes("@") && !email.includes("[");
}

// Regex de validação estrita para o e-mail digitado pelo visitante (idêntica ao backend)
function emailValido(email) {
  return typeof email === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

// URL do WhatsApp — FONTE ÚNICA no canal "WhatsApp" de data/presenca.js.
// Reutilizada pelos CTAs da seção de contato (mesmo destino do botão flutuante).
function urlWhatsApp() {
  const canal = canais.find((c) => c.nome === "WhatsApp");
  return canal && typeof canal.url === "string" ? canal.url : null;
}

// Monta o assunto do contato: assunto padrão + rótulo legível do tipo
// escolhido (ex.: "Contato pelo portfólio — Site"). O servidor usa como
// subject do e-mail. Mantém data/contato.js como fonte única do texto.
function montarAssunto(tipo) {
  const rotuloTipo = contato.tiposProjeto.find((t) => t.valor === tipo)?.rotulo || "";
  return rotuloTipo ? `${contato.assunto} — ${rotuloTipo}` : contato.assunto;
}

// Envia o formulário para a API do Express (POST /api/contato).
// Em erro, lança Error com a mensagem honesta retornada pelo servidor
// (ex.: validação, rate limit ou falha no SMTP) para exibir no status.
async function enviarViaApi(dados) {
  const resposta = await fetch("/api/contato", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dados),
  });
  const corpo = await resposta.json().catch(() => ({}));
  if (!resposta.ok) {
    throw new Error(corpo.erro || "Falha no envio pela API");
  }
  return corpo;
}

export function initContato() {
  const form = document.querySelector("[data-contato-form]");
  const linkEmail = document.querySelector("[data-contato-email]");
  const textoEmail = document.querySelector("[data-contato-email-text]");
  const status = document.querySelector("[data-contato-status]");
  const botaoCopiar = document.querySelector("[data-contato-copiar]");
  const iconeCopiar = document.querySelector("[data-copiar-icone]");
  const iconeCopiarOk = document.querySelector("[data-copiar-ok]");
  const selectTipo = document.querySelector("[data-contato-tipo]");
  const textoResposta = document.querySelector("[data-contato-resposta]");
  const botaoSubmit = form?.querySelector('button[type="submit"]');
  const textoSubmit = botaoSubmit?.querySelector("[data-contato-submit-text]");
  const iconeEnviar = botaoSubmit?.querySelector("[data-submit-icone-enviar]");
  const iconeOk = botaoSubmit?.querySelector("[data-submit-icone-ok]");

  // ---------- Preenchimento de dados (data/contato.js + presenca.js) ----------
  if (textoResposta) textoResposta.textContent = contato.tempoResposta;

  if (selectTipo) {
    selectTipo.innerHTML =
      '<option value="">Selecione o assunto (opcional)</option>' +
      contato.tiposProjeto
        .map((t) => `<option value="${t.valor}">${t.rotulo}</option>`)
        .join("");

    // Triagem por público: pré-seleciona o assunto vindo da URL
    // (?assunto=vaga|site|...), ex.: ao chegar por um link compartilhado
    // do caminho de vaga. Os valores seguem data/contato.js.
    const assuntoParam = new URLSearchParams(window.location.search).get("assunto");
    const valores = contato.tiposProjeto.map((t) => t.valor);
    if (assuntoParam && valores.includes(assuntoParam)) {
      selectTipo.value = assuntoParam;
    }
  }

  // CTAs com data-assunto (ex.: hub de caminhos) levam ao contato com o
  // assunto pré-selecionado, sem recarregar a página.
  document.querySelectorAll("[data-assunto]").forEach((ancora) => {
    ancora.addEventListener("click", (evento) => {
      evento.preventDefault();
      const valor = ancora.getAttribute("data-assunto");
      if (selectTipo && valor) selectTipo.value = valor;
      const destino = document.querySelector(ancora.getAttribute("href"));
      if (destino) destino.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  // CTAs de WhatsApp (header + card) — mesmo link do botão flutuante.
  const whatsUrl = urlWhatsApp();
  document.querySelectorAll("[data-contato-whatsapp]").forEach((ancora) => {
    if (whatsUrl) {
      ancora.href = whatsUrl;
      ancora.removeAttribute("aria-disabled");
      ancora.removeAttribute("title");
    } else {
      ancora.setAttribute("aria-disabled", "true");
      ancora.setAttribute(
        "title",
        "Link do WhatsApp ainda não configurado — edite src/js/data/presenca.js",
      );
      ancora.addEventListener("click", (evento) => evento.preventDefault());
    }
  });

  // ---------- Link direto de e-mail ----------
  if (linkEmail) {
    const destino = textoEmail || linkEmail;
    destino.textContent = contato.email;

    if (isEmailConfigurado(contato.email)) {
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

  // ---------- Copiar e-mail (Clipboard API) ----------
  if (botaoCopiar && isEmailConfigurado(contato.email)) {
    botaoCopiar.addEventListener("click", async () => {
      let copiado = false;

      try {
        if (navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(contato.email);
          copiado = true;
        }
      } catch {
        copiado = false;
      }

      if (!copiado) {
        // Fallback para ambientes sem Clipboard API (ex.: http não seguro):
        // seleciona o texto do e-mail visível no link e copia.
        try {
          const selecao = window.getSelection();
          const intervalo = document.createRange();
          intervalo.selectNodeContents(linkEmail);
          selecao.removeAllRanges();
          selecao.addRange(intervalo);
          document.execCommand("copy");
          selecao.removeAllRanges();
          copiado = true;
        } catch {
          copiado = false;
        }
      }

      // Feedback visual: ícone vira "check" por 2s.
      if (iconeCopiar && iconeCopiarOk) {
        iconeCopiar.classList.add("hidden");
        iconeCopiarOk.classList.remove("hidden");
        botaoCopiar.setAttribute("aria-label", "E-mail copiado!");
        botaoCopiar.setAttribute("title", "E-mail copiado!");
        window.setTimeout(() => {
          iconeCopiarOk.classList.add("hidden");
          iconeCopiar.classList.remove("hidden");
          botaoCopiar.setAttribute("aria-label", "Copiar e-mail para a área de transferência");
          botaoCopiar.setAttribute("title", "Copiar e-mail");
        }, 2000);
      }

      // Último recurso honesto: prompt para copiar manualmente.
      if (!copiado) {
        window.prompt("Copie o e-mail manualmente:", contato.email);
      }
    });
  }

  if (!form) return;

  // ---------- Validação com feedback inline ----------
  const campoNome = form.elements.nome;
  const campoEmail = form.elements.email;
  const campoMensagem = form.elements.mensagem;
  const campoHoneypot = form.elements.empresa;
  const erroNome = document.getElementById("erro-contato-nome");
  const erroEmail = document.getElementById("erro-contato-email");
  const erroMensagem = document.getElementById("erro-contato-mensagem");

  function limparErro(campo, erro) {
    campo.classList.remove("input-erro");
    campo.removeAttribute("aria-invalid");
    if (erro) {
      erro.textContent = "";
      erro.hidden = true;
    }
  }

  function marcarErro(campo, erro, mensagem) {
    campo.classList.add("input-erro");
    campo.setAttribute("aria-invalid", "true");
    if (erro) {
      erro.textContent = mensagem;
      erro.hidden = false;
    }
  }

  // Validação com mensagens em pt-BR (complementa a validação nativa).
  function validar() {
    let valido = true;
    limparErro(campoNome, erroNome);
    limparErro(campoEmail, erroEmail);
    limparErro(campoMensagem, erroMensagem);

    const nomeVal = campoNome.value.trim();
    const emailVal = campoEmail.value.trim();
    const msgVal = campoMensagem.value.trim();

    if (nomeVal.length < 2) {
      marcarErro(campoNome, erroNome, "Informe seu nome (mín. 2 caracteres).");
      valido = false;
    } else if (nomeVal.length > 100) {
      marcarErro(campoNome, erroNome, "Nome muito longo (máx. 100 caracteres).");
      valido = false;
    }

    if (!emailValido(emailVal)) {
      marcarErro(campoEmail, erroEmail, "Informe um e-mail válido.");
      valido = false;
    } else if (emailVal.length > 254) {
      marcarErro(campoEmail, erroEmail, "E-mail muito longo (máx. 254 caracteres).");
      valido = false;
    }

    if (msgVal.length < 10) {
      marcarErro(campoMensagem, erroMensagem, "Conte um pouco mais (mín. 10 caracteres).");
      valido = false;
    } else if (msgVal.length > 4000) {
      marcarErro(campoMensagem, erroMensagem, "Mensagem muito longa (máx. 4000 caracteres).");
      valido = false;
    }

    return valido;
  }

  // Limpa o erro assim que o usuário começa a corrigir (melhor UX).
  [campoNome, campoEmail, campoMensagem].forEach((campo) => {
    campo.addEventListener("input", () => {
      const erro =
        campo === campoNome ? erroNome : campo === campoEmail ? erroEmail : erroMensagem;
      limparErro(campo, erro);
    });
  });

  // ---------- Status com feedback visual (role="status" = aria-live polite) ----------
  function mostrarStatus(mensagem, tipo = "info") {
    if (!status) return;
    status.textContent = mensagem;
    status.hidden = false;
    status.classList.remove(
      "border-success/30",
      "bg-success/10",
      "border-danger/30",
      "bg-danger/10",
      "border-accent/30",
      "bg-accent/10",
      "text-foreground",
    );
    if (tipo === "ok") {
      status.classList.add("border-success/30", "bg-success/10", "text-foreground");
    } else if (tipo === "erro") {
      status.classList.add("border-danger/30", "bg-danger/10", "text-foreground");
    } else {
      status.classList.add("border-accent/30", "bg-accent/10", "text-foreground");
    }
  }

  // ---------- Submissão: envio real via API (sem mailto) ----------
  form.addEventListener("submit", async (evento) => {
    evento.preventDefault();

    // Honeypot anti-spam: campo escondido que só bots preenchem. Se preenchido,
    // aborta a submissão SILENCIOSAMENTE (sem status) — o robô não percebe.
    if (campoHoneypot && campoHoneypot.value.trim() !== "") return;

    if (!isEmailConfigurado(contato.email)) {
      mostrarStatus(
        "E-mail de destino ainda não configurado. Adicione o endereço em src/js/data/contato.js.",
        "erro",
      );
      return;
    }

    if (!validar()) {
      mostrarStatus("Verifique os campos destacados acima.", "erro");
      return;
    }

    const dados = {
      nome: campoNome.value.trim(),
      email: campoEmail.value.trim(),
      tipo: selectTipo ? selectTipo.value : "",
      assunto: montarAssunto(selectTipo ? selectTipo.value : ""),
      mensagem: campoMensagem.value.trim(),
    };

    // Estado de envio: desabilita o botão e mostra progresso.
    if (botaoSubmit) {
      botaoSubmit.disabled = true;
      if (textoSubmit) textoSubmit.textContent = "Enviando...";
      if (iconeEnviar && iconeOk) {
        iconeEnviar.classList.add("hidden");
        iconeOk.classList.remove("hidden");
      }
    }
    mostrarStatus("Enviando sua mensagem...", "info");

    try {
      await enviarViaApi(dados);
      form.reset();
      mostrarStatus(
        "Mensagem enviada! Obrigado pelo contato — respondo em até 24h úteis.",
        "ok",
      );
      if (textoSubmit) textoSubmit.textContent = "Enviado!";
      if (iconeEnviar && iconeOk) {
        iconeEnviar.classList.add("hidden");
        iconeOk.classList.remove("hidden");
      }
      window.setTimeout(() => {
        if (textoSubmit) textoSubmit.textContent = "Enviar mensagem";
        if (iconeEnviar && iconeOk) {
          iconeOk.classList.add("hidden");
          iconeEnviar.classList.remove("hidden");
        }
      }, 2500);
    } catch (erro) {
      // Falha no servidor ou no SMTP: mostra erro honesto no status.
      // NÃO abre o app de e-mail do visitante e não finge o envio.
      mostrarStatus(
        erro?.message || "Não foi possível enviar sua mensagem agora. Tente novamente em instantes.",
        "erro",
      );
      if (textoSubmit) textoSubmit.textContent = "Enviar mensagem";
      if (iconeEnviar && iconeOk) {
        iconeOk.classList.add("hidden");
        iconeEnviar.classList.remove("hidden");
      }
    } finally {
      if (botaoSubmit) botaoSubmit.disabled = false;
    }
  });
}
