// Arquivo de configuração do Vite.
// Ele é lido pelo Vite para saber quais plugins usar e como buildar o projeto.
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [tailwindcss()],
  // Proxy APENAS em desenvolvimento: encaminha /api/* para o Express local
  // (porta 3001, `npm start`) para testar o envio do formulário no navegador
  // sem problemas de CORS. Não afeta produção (arquivo ignorado pelo SFTP —
  // ver sftp.json).
  server: {
    proxy: {
      "/api": "http://localhost:3001",
    },
  },
});
