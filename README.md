# JMATTOS.DEV

Portfólio profissional de **Julio Mattos** — desenvolvimento de software, tecnologia e soluções digitais.

![JMATTOS.DEV](public/jmattos.jpg)

## 📋 Projeto

Site pessoal/portfólio **estático** construído com **Vite + Tailwind CSS v4**, com tema escuro (dark), tipografia _Space Grotesk / Inter / JetBrains Mono_ e micro-interações (reveal on scroll, menu mobile, ícones Lucide). Todas as seções são montadas a partir de arquivos de dados em `src/js/data/`, o que facilita a manutenção sem tocar no HTML.

Seções atuais:

- **Hero** — apresentação com terminal decorativo
- **Sobre** — texto + foto de perfil com moldura em gradiente azul
- **Stack** — tecnologias com indicador de nível
- **Projetos** — cards gerados dinamicamente
- **Processo** — etapas de trabalho
- **Serviços** — cards gerados dinamicamente
- **Presença profissional** — redes/links externos
- **Contato** — canal de comunicação

## 🎯 Objetivo

Apresentar a trajetória, a stack e os serviços de forma clara e profissional, servindo como vitrine para oportunidades de trabalho e novos projetos. O foco é **simplicidade, performance e atenção aos detalhes**, com código organizado e de fácil manutenção.

## 🧰 Stack (Tecnologias)

| Camada    | Tecnologias                                             |
| --------- | ------------------------------------------------------- |
| Frontend  | HTML5, CSS3, JavaScript (ES Modules)                    |
| Estilos   | Tailwind CSS v4 (configuração _CSS-first_)              |
| Build     | Vite                                                    |
| Ícones    | Lucide (via tree-shaking no bundle)                     |
| Fontes    | Space Grotesk, Inter, JetBrains Mono (Google Fonts)     |
| Deploy    | Nginx / VPS (futuro)                                    |

## 🚀 Como executar localmente

Requisitos: **Node.js 20+** e **npm**.

```bash
# 1. Instale as dependências
npm install

# 2. Inicie o servidor de desenvolvimento
npm run dev
```

O projeto estará disponível em **http://localhost:5173/** (com _hot reload_).

> **Nota (WSL/Windows):** se `npm run dev` falhar por roteamento ao `CMD.EXE`, execute diretamente:
> `node node_modules/vite/bin/vite.js`

## 🛠️ Como fazer o build

```bash
# Gera os arquivos otimizados de produção em /dist
npm run build

# Pré-visualiza o build de produção localmente
npm run preview
```

## 📁 Estrutura básica

```
jmattosdev/
├── index.html              # HTML principal (todas as seções)
├── package.json            # Dependências e scripts
├── vite.config.js          # Config do Vite (plugin Tailwind v4)
├── .gitignore              # Arquivos ignorados pelo Git
├── public/                 # Arquivos estáticos servidos na raiz
│   ├── favicon.svg
│   ├── jmattos.jpg
│   ├── robots.txt
│   └── sitemap.xml
└── src/
    ├── css/
    │   └── style.css       # Design tokens + Tailwind CSS v4 (CSS-first)
    └── js/
        ├── main.js         # Ponto de entrada (ícones + renderização)
        ├── projects.js     # Renderiza a seção Projetos
        ├── servicos.js     # Renderiza a seção Serviços
        ├── presenca.js     # Renderiza a seção Presença profissional
        ├── contato.js      # Inicializa a seção Contato
        ├── reveal.js       # Animação reveal on scroll
        └── data/           # Fontes únicas de verdade (dados)
            ├── projects.js
            ├── servicos.js
            ├── presenca.js
            └── contato.js
```

## 🚢 Deploy futuro

Por ser um site estático, o build em `dist/` pode ser hospedado em qualquer plataforma:

- **Nginx + VPS** — copiar `dist/` para o servidor e configurar o `server_root`
- **Vercel / Netlify** — conectar o repositório, com `build command: npm run build` e `publish directory: dist`
- **GitHub Pages** — publicar o conteúdo de `dist/` na branch `gh-pages`

O `robots.txt` e o `sitemap.xml` já estão prontos em `public/` para o SEO.

---

_© JMATTOS.DEV — Julio Mattos_
