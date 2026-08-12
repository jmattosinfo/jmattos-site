// Arquivo de configuração do Vite.
// Ele é lido pelo Vite para saber quais plugins usar e como buildar o projeto.
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [tailwindcss()],
});
