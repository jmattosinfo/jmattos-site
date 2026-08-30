/**
 * Servidor minimalista (Express) para servir o build estático do JMATTOS.DEV.
 *
 * - Serve os arquivos da pasta `dist/` (gerada por `npm run build`) com Cache-Control inteligente.
 * - Headers de segurança HTTP (HSTS, nosniff, frame-options, referrer-policy).
 * - Health check em `GET /status` (usado para validar o deploy no CloudPanel).
 * - `POST /api/contato` — recebe o formulário de contato e ENVIA o e-mail real
 *   via SMTP (Nodemailer + Gmail App Password), sem depender do app de e-mail
 *   do visitante.
 * - Proteção contra DoS (limite de body 15kb), Rate-Limit e Honeypot anti-spam.
 * - Logs sanitizados (sem PII) em conformidade com boas práticas de privacidade.
 * - Graceful shutdown para reinícios limpos no PM2 / CloudPanel.
 *
 * Variáveis de ambiente (configuradas no CloudPanel/PM2, NUNCA no código):
 *   SMTP_USER  — conta Gmail remetente (ex.: jmattosinfo@gmail.com)
 *   SMTP_PASS  — App Password do Gmail (requer 2FA ativada na conta)
 *   SMTP_TO    — destinatário das mensagens (opcional; padrão = SMTP_USER)
 *
 * Nota: o projeto usa ES Modules ("type": "module"), por isso `import`/`export`.
 */
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import nodemailer from "nodemailer";
import rateLimit from "express-rate-limit";

const app = express();
const PORT = process.env.PORT || 3001;

// Atrás do proxy Nginx do CloudPanel, o IP real do visitante chega no header
// X-Forwarded-For. O "trust proxy" faz o rate limit contar por IP real do
// cliente (e não pelo IP do próprio Nginx).
app.set("trust proxy", 1);

// ---------- Headers de Segurança HTTP ----------
app.use((req, res, next) => {
  res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  next();
});

// __dirname equivalente em ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ---------- Servir arquivos estáticos com Cache-Control inteligente ----------
// • Assets com hash (ex.: dist/assets/*.js e *.css) recebem cache imutável de 1 ano.
// • index.html sempre revalida (no-cache) para que novas publicações reflitam imediatamente.
app.use(
  express.static(path.join(__dirname, "dist"), {
    maxAge: "1d",
    setHeaders: (res, filePath) => {
      if (filePath.includes("/assets/")) {
        res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
      } else if (filePath.endsWith("index.html")) {
        res.setHeader("Cache-Control", "no-cache, must-revalidate");
      }
    },
  }),
);

// Rota de health check
app.get("/status", (req, res) => {
  res.status(200).send("OK");
});

// ---------- API de contato (formulário do site) ----------
// Limite estrito de 15kb para proteção contra DoS via payload excessivo
app.use(express.json({ limit: "15kb" }));

// ---------- Configuração do SMTP (Gmail App Password) ----------
const SMTP_USER = process.env.SMTP_USER || "";
const SMTP_PASS = process.env.SMTP_PASS || "";
const SMTP_TO = process.env.SMTP_TO || SMTP_USER;

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // STARTTLS (o Gmail exige TLS/STARTTLS)
  auth: { user: SMTP_USER, pass: SMTP_PASS },
});

// Rate limit: no máximo 10 submissões por IP a cada 15 minutos.
const contatoLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    ok: false,
    erro: "Muitas tentativas em pouco tempo. Tente novamente em alguns minutos.",
  },
});

// Monta o corpo do e-mail em texto puro (formato simples e legível).
function montarCorpoEmail({ nome, email, assunto, mensagem, recebidoEm }) {
  return [
    "Nova mensagem do formulário de contato — JMATTOS.DEV",
    "================================================",
    "",
    `Nome: ${nome}`,
    `E-mail do remetente: ${email}`,
    `Assunto: ${assunto}`,
    "",
    "Mensagem:",
    mensagem,
    "",
    `Recebido em: ${recebidoEm}`,
  ].join("\n");
}

// Recebe o formulário de contato enviado pelo front-end (src/js/contato.js).
app.post("/api/contato", contatoLimiter, async (req, res, next) => {
  try {
    const { nome, email, tipo, mensagem, assunto, empresa } = req.body || {};

    // Honeypot: campo escondido que só bots preenchem.
    if (typeof empresa === "string" && empresa.trim() !== "") {
      return res.status(200).json({ ok: true });
    }

    // Validação estrita de tipos e tamanhos máximos
    const nomeLimpo = typeof nome === "string" ? nome.replace(/[\r\n]/g, " ").trim() : "";
    const emailLimpo = typeof email === "string" ? email.trim() : "";
    const msgLimpa = typeof mensagem === "string" ? mensagem.trim() : "";
    const assuntoLimpo =
      typeof assunto === "string" && assunto.trim()
        ? assunto.replace(/[\r\n]/g, " ").trim()
        : "Contato pelo portfólio";

    const nomeOk = nomeLimpo.length >= 2 && nomeLimpo.length <= 100;
    const emailOk =
      emailLimpo.length >= 5 &&
      emailLimpo.length <= 254 &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailLimpo);
    const msgOk = msgLimpa.length >= 10 && msgLimpa.length <= 4000;
    const assuntoOk = assuntoLimpo.length <= 150;

    if (!nomeOk || !emailOk || !msgOk || !assuntoOk) {
      return res.status(400).json({
        ok: false,
        erro: "Dados inválidos ou excederam os limites de tamanho permitidos.",
      });
    }

    // Sem SMTP configurado não há como entregar o e-mail
    if (!SMTP_USER || !SMTP_PASS) {
      console.error(
        "[CONTATO] SMTP não configurado. Defina SMTP_USER e SMTP_PASS no CloudPanel/PM2.",
      );
      return res.status(500).json({
        ok: false,
        erro: "Não foi possível enviar o e-mail agora. Tente novamente em instantes.",
      });
    }

    const dados = {
      nome: nomeLimpo,
      email: emailLimpo,
      tipo: typeof tipo === "string" ? tipo.trim().slice(0, 50) : "",
      assunto: assuntoLimpo,
      mensagem: msgLimpa,
      recebidoEm: new Date().toISOString(),
    };

    // Log seguro (sem expor PII/corpo completo de mensagem nos logs do servidor)
    console.log(
      `[CONTATO] Nova mensagem | Tipo: "${dados.tipo || "geral"}" | Assunto: "${dados.assunto}" | Tam: ${dados.mensagem.length} chars | Data: ${dados.recebidoEm}`,
    );

    await transporter.sendMail({
      from: `"JMATTOS.DEV" <${SMTP_USER}>`,
      to: SMTP_TO,
      replyTo: dados.email,
      subject: dados.assunto,
      text: montarCorpoEmail(dados),
    });

    console.log(`[CONTATO] E-mail entregue com sucesso para ${SMTP_TO}`);
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("[CONTATO] Falha ao enviar e-mail:", err.message);
    return res.status(500).json({
      ok: false,
      erro: "Não foi possível enviar o e-mail agora. Tente novamente em instantes.",
    });
  }
});

// Fallback: qualquer outra rota serve o index.html (SPA-friendly)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

// ---------- Middleware Global de Tratamento de Erros ----------
app.use((err, req, res, next) => {
  console.error("[SERVER] Erro não tratado:", err.message);
  res.status(500).json({
    ok: false,
    erro: "Ocorreu um erro interno no servidor.",
  });
});

// Inicialização do servidor
const server = app.listen(PORT, () => {
  console.log(`JMATTOS.DEV server rodando na porta ${PORT}`);
});

// ---------- Graceful Shutdown ----------
const encerrar = (sinal) => {
  console.log(`[SERVER] Sinal ${sinal} recebido. Encerrando conexões graciosamente...`);
  server.close(() => {
    console.log("[SERVER] Servidor finalizado com sucesso.");
    process.exit(0);
  });
};

process.on("SIGTERM", () => encerrar("SIGTERM"));
process.on("SIGINT", () => encerrar("SIGINT"));
