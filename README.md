# JMATTOS.DEV

Portfólio profissional de **Julio Mattos** — Full Stack Developer & Automação de Processos (RPA).

![JMATTOS.DEV](public/jmattos.webp)

## 📚 Documentação

- [**DEPLOY.md**](DEPLOY.md) — guia completo de deploy no domínio (SFTP + Nginx + deploy automático/hot-reload)
- [**AI_GUIDELINES.md**](AI_GUIDELINES.md) — padrões, regras e orientações para IAs que trabalharem neste projeto

## 📋 Projeto

Site pessoal/portfólio com **frontend estático** construído com **Vite + Tailwind CSS v4**, servido por um **Express** mínimo ([`server.js`](server.js)) que entrega o build e expõe a **API de contato** (`POST /api/contato`) — a rota valida e **envia o e-mail real via SMTP** (Nodemailer + Gmail App Password), sem depender do app de e-mail do visitante. Tema escuro (dark), tipografia _Space Grotesk / Inter / JetBrains Mono_ e micro-interações (reveal on scroll, menu mobile, ícones Lucide, botão flutuante de WhatsApp). Todas as seções são montadas a partir de arquivos de dados em `src/js/data/`, o que facilita a manutenção sem tocar no HTML.

Seções atuais:

- **Hero** — apresentação com badge de disponibilidade + terminal decorativo (exemplo Django/Python) + 2 CTAs priorizados (vaga / projeto)
- **Caminhos** — hub de conversão com 2 cards (VAGA x PROJETO), gerados por `data/disponibilidade.js`
- **Sobre** — texto da trajetória + foto de perfil com moldura em gradiente azul e aura
- **Stack** — tecnologias com indicador de nível (frontend, backend e infra/tools)
- **Projetos** — cards gerados dinamicamente (estudo de caso com screenshots e links)
- **Serviços** — cards gerados dinamicamente
- **Processo** — etapas de trabalho (Entender → Planejar → Desenvolver → Entregar)
- **Presença profissional** — redes/links externos
- **Contato** — cards de canal (e-mail com copiar, WhatsApp e tempo de resposta) + formulário com envio real via API (`POST /api/contato` → SMTP/Gmail), sem abrir o app de e-mail do visitante
- **Botão flutuante de WhatsApp** — link fixo no canto inferior direito (mesma fonte de dados da seção Contato)

## 🎯 Objetivo

Apresentar a trajetória, a stack e os serviços de forma clara e profissional, servindo como vitrine para oportunidades de trabalho e novos projetos. O foco é **simplicidade, performance e atenção aos detalhes**, com código organizado e de fácil manutenção — dados separados do HTML (arquivos `data/` como fonte única de verdade).

## 🧰 Stack (Tecnologias)

| Camada    | Tecnologias                                             |
| --------- | ------------------------------------------------------- |
| Frontend  | HTML5, CSS3, JavaScript (ES Modules)                    |
| Estilos   | Tailwind CSS v4 (configuração _CSS-first_)              |
| Backend   | Express + Nodemailer (SMTP/Gmail) — `POST /api/contato` |
| Build     | Vite                                                     |
| Ícones    | Lucide (via tree-shaking no bundle)                     |
| Fontes    | Space Grotesk, Inter, JetBrains Mono (Google Fonts)     |
| Deploy    | CloudPanel / VPS (Nginx + extensão SFTP + deploy automático) |

> O site usa um **Express** mínimo ([`server.js`](server.js)) apenas para servir o build e receber o formulário de contato (`POST /api/contato` — valida e envia o e-mail real via SMTP com `nodemailer`; credenciais em variáveis de ambiente `SMTP_USER`/`SMTP_PASS`/`SMTP_TO`, ver [DEPLOY.md](DEPLOY.md)). Backend das aplicações em destaque: Python/Django e Node.js/Express (ver `src/js/data/projects.js`).

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

# Gera o build e recompila automaticamente a cada alteração no código (usado no deploy com hot-reload)
npm run build -- --watch

# Pré-visualiza o build de produção localmente
npm run preview
```

## 🚢 Deploy

O site é **estático** e publicado no domínio via **CloudPanel (VPS) + extensão SFTP do VSCode**, com deploy automático a cada alteração salva (hot-reload). O guia completo está em **[DEPLOY.md](DEPLOY.md)** e cobre:

- Estrutura de sites do CloudPanel (web root em `/home/<site>/htdocs/<dominio>/`)
- Criação do site no CloudPanel (Runtime: **Static**) e emissão do SSL (Let's Encrypt)
- Configuração do `sftp.json` apontando para o web root (upload automático ao salvar)
- DNS apontando para a VPS (registro A sem proxy)
- Atualizações futuras e solução de problemas

## 📁 Estrutura básica

```
jmattosdev/
├── index.html              # HTML principal (todas as seções)
├── server.js               # Servidor Express: serve dist/ + API de contato (envia e-mail real via SMTP)
├── package.json            # Dependências e scripts
├── vite.config.js          # Config do Vite (plugin Tailwind v4)
├── .gitignore              # Arquivos ignorados pelo Git
├── DEPLOY.md               # Guia de deploy (CloudPanel + Express + SFTP)
├── AI_GUIDELINES.md        # Regras e padrões para IAs do projeto
├── plans/                  # Planos/arquitetura (ex.: modernizar-secao-contato.md)
├── public/                 # Arquivos estáticos servidos na raiz
│   ├── favicon.svg
│   ├── jmattos.webp
│   ├── og-image.svg        # Card Open Graph (1200x630) para compartilhamento
│   ├── robots.txt
│   ├── sitemap.xml
│   ├── icons/              # Ícones customizados (ex.: whatsapp.svg)
│   └── screenshots/        # Screenshots dos projetos (projeto-1.gif, projeto-2.png)
└── src/
    ├── css/
    │   └── style.css       # Design tokens + Tailwind CSS v4 (CSS-first)
    └── js/
        ├── main.js         # Ponto de entrada (ícones + renderização + menu)
        ├── projects.js     # Renderiza a seção Projetos (com zoom Lightbox)
        ├── servicos.js     # Renderiza a seção Serviços
        ├── presenca.js     # Renderiza a seção Presença profissional
        ├── disponibilidade.js # Badge de disponibilidade + hub de caminhos (VAGA x PROJETO)
        ├── contato.js      # Seção Contato: envio via API + feedback de status
        ├── whatsapp.js     # Botão flutuante de WhatsApp (canto inferior direito)
        ├── scrollspy.js    # Destaca o link da seção ativa na navbar
        ├── lightbox.js     # Modal acessível para visualização ampliada de screenshots
        ├── reveal.js       # Animação reveal on scroll
        ├── reveal-estrutural.js # Reveal direcional para blocos estruturais
        └── data/           # Fontes únicas de verdade (dados)
            ├── projects.js
            ├── servicos.js
            ├── presenca.js
            ├── contato.js
            └── disponibilidade.js
```

---

_© JMATTOS.DEV — Julio Mattos_
