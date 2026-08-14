/**
 * Servidor minimalista (Express) para servir o build estático do JMATTOS.DEV.
 *
 * - Serve os arquivos da pasta `dist/` (gerada por `npm run build`).
 * - Health check em `GET /status` (usado para validar o deploy no CloudPanel).
 * - Escuta na porta definida em `process.env.PORT` ou 3001 por padrão.
 *
 * Nota: o projeto usa ES Modules ("type": "module"), por isso `import`/`export`.
 */
import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = process.env.PORT || 3001;

// Força HTTPS no navegador (HSTS): após a 1ª visita via HTTPS, o navegador
// passa a usar SOMENTE HTTPS, eliminando o aviso "Não seguro" em visitas
// futuras (inclusive quando o usuário digita http:// na barra de endereço).
app.use((req, res, next) => {
  res.setHeader("Strict-Transport-Security", "max-age=31536000");
  next();
});

// __dirname equivalente em ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve os arquivos estáticos da pasta dist/
app.use(express.static(path.join(__dirname, "dist")));

// Rota de health check
app.get("/status", (req, res) => {
  res.status(200).send("OK");
});

// Fallback: qualquer outra rota serve o index.html (SPA-friendly)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

app.listen(PORT, () => {
  console.log(`JMATTOS.DEV server rodando na porta ${PORT}`);
});
