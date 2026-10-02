# JMATTOS.DEV

Portfólio profissional de **Julio Mattos** — Full Stack Developer & Automação de Processos (RPA).

![JMATTOS.DEV](public/jmattos.webp)

## 📚 Documentação

- [**DEPLOY.md**](DEPLOY.md) — guia de deploy em produção (VPS + Docker + Docker Compose)
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
| Runtime   | Docker + Docker Compose (Node.js 22 Alpine)             |
| Deploy    | VPS (Linux/Ubuntu) + Docker Compose (`docker compose up -d --build`) |

> O site roda **100% em container**. A imagem é construída pelo [`Dockerfile`](Dockerfile:1) multi-stage (build do Vite → runtime do Express) e orquestrada pelo [`docker-compose.yml`](docker-compose.yml:1) em produção. O [`server.js`](server.js) serve o build e expõe `POST /api/contato` (valida e envia o e-mail real via SMTP com `nodemailer`; credenciais em variáveis de ambiente `SMTP_USER`/`SMTP_PASS`/`SMTP_TO`, ver [DEPLOY.md](DEPLOY.md)). Backend das aplicações em destaque: Python/Django e Node.js/Express (ver `src/js/data/projects.js`).

## 🚀 Como executar localmente (Docker)

Requisitos: **Docker** e **Docker Compose v2** instalados. Não é necessário ter Node.js/npm no sistema — tudo roda dentro do container.

```bash
# 1. Crie o seu .env a partir do modelo (contém as credenciais SMTP)
cp .env.example .env
#    Abra o .env e preencha SMTP_USER, SMTP_PASS e SMTP_TO.

# 2. Suba o ambiente de desenvolvimento (Vite com hot-reload)
docker compose -f docker-compose.dev.yml up -d
```

O ambiente de desenvolvimento ficará disponível em:

- **http://localhost:5173/** — frontend servido pelo Vite com _hot reload_ (qualquer alteração no `src/` é refletida ao guardar).
- **http://localhost:3001/** — porta reservada para o backend Express (`server.js`).

> O [`docker-compose.dev.yml`](docker-compose.dev.yml:1) usa a imagem `node:22-alpine`, monta o projeto como volume (`.:/app`) para permitir o hot-reload e executa `npm install && npm run dev`.

Para **parar** o ambiente de desenvolvimento:

```bash
docker compose -f docker-compose.dev.yml down
```

### ⚙️ Configuração do `.env`

O ficheiro `.env` **nunca é versionado** (está no `.gitignore`). O modelo [`​.env.example`](.env.example) documenta todas as variáveis necessárias:

| Variável    | Descrição                                                                 |
| ----------- | ------------------------------------------------------------------------- |
| `NODE_ENV`  | Ambiente de execução (ex.: `production`).                                 |
| `PORT`      | Porta do Express (a aplicação usa `3001`).                                |
| `SMTP_USER` | Conta Gmail remetente do formulário de contato.                           |
| `SMTP_PASS` | **App Password** do Gmail (não é a senha normal da conta).                |
| `SMTP_TO`   | Destinatário das mensagens (opcional — se ausente, usa o próprio `SMTP_USER`). |
| `IMAGE_TAG` | Tag da imagem de produção (uso futuro/CI; o Compose atual faz `build`).   |

## 🛠️ Build e teste da imagem de produção

O build é feito **dentro do Docker** pelo [`Dockerfile`](Dockerfile:1) multi-stage. Para testar localmente a mesma imagem usada em produção:

```bash
# Constrói a imagem e sobe o container de produção
docker compose up -d --build

# A aplicação fica disponível em http://localhost:3001/
# Health check: http://localhost:3001/status  →  OK
docker compose down
```

## 🚢 Deploy

O deploy é **manual e seguro (Nível 1 de DevOps)**: o código é versionado no GitHub e, na VPS, o container é reconstruído com Docker Compose. O guia completo está em **[DEPLOY.md](DEPLOY.md)** e cobre:

- Pré-requisitos na VPS (Docker + Docker Compose v2, usuário do site)
- Configuração do `.env` em produção (credenciais SMTP via Gmail App Password)
- Fluxo de atualização: `git push` → `ssh` → `sudo -u jmattosdev git pull` → `docker compose up -d --build`
- Verificação de saúde (`/status`), logs e solução de problemas

Resumo do fluxo:

```bash
# 1. Local: desenvolver, testar e publicar no GitHub
git add . && git commit -m "descrição da mudança" && git push

# 2. Na VPS (via SSH), no diretório do projeto
cd /home/jmattosdev/htdocs/jmattosdev.tech
sudo -u jmattosdev git pull

# 3. Reconstruir e arrancar o container
docker compose up -d --build
```

## 📁 Estrutura básica

```
jmattosdev/
├── index.html               # HTML principal (todas as seções)
├── server.js                # Servidor Express: serve dist/ + API de contato (envia e-mail real via SMTP)
├── package.json             # Dependências e scripts
├── vite.config.js           # Config do Vite (plugin Tailwind v4)
├── Dockerfile               # Build multi-stage (Vite → runtime Express, porta 3001)
├── docker-compose.yml       # Orquestração de produção (VPS)
├── docker-compose.dev.yml   # Orquestração de desenvolvimento (hot-reload com volumes)
├── .env.example             # Modelo das variáveis de ambiente (o .env real não é versionado)
├── .gitignore               # Arquivos ignorados pelo Git
├── .dockerignore            # Arquivos ignorados no contexto de build da imagem
├── DEPLOY.md                # Guia de deploy (VPS + Docker Compose)
├── AI_GUIDELINES.md         # Regras e padrões para IAs do projeto
├── plans/                   # Planos/arquitetura
├── public/                  # Arquivos estáticos servidos na raiz
│   ├── favicon.svg
│   ├── jmattos.webp
│   ├── og-image.svg         # Card Open Graph (1200x630) para compartilhamento
│   ├── robots.txt
│   ├── sitemap.xml
│   ├── icons/               # Ícones customizados (ex.: whatsapp.svg)
│   └── screenshots/         # Screenshots dos projetos (projeto-1.gif, projeto-2.png)
└── src/
    ├── css/
    │   └── style.css        # Design tokens + Tailwind CSS v4 (CSS-first)
    └── js/
        ├── main.js          # Ponto de entrada (ícones + renderização + menu)
        ├── projects.js      # Renderiza a seção Projetos (com zoom Lightbox)
        ├── servicos.js      # Renderiza a seção Serviços
        ├── presenca.js      # Renderiza a seção Presença profissional
        ├── disponibilidade.js # Badge de disponibilidade + hub de caminhos (VAGA x PROJETO)
        ├── contato.js       # Seção Contato: envio via API + feedback de status
        ├── whatsapp.js      # Botão flutuante de WhatsApp (canto inferior direito)
        ├── scrollspy.js     # Destaca o link da seção ativa na navbar
        ├── lightbox.js      # Modal acessível para visualização ampliada de screenshots
        ├── reveal.js        # Animação reveal on scroll
        ├── reveal-estrutural.js # Reveal direcional para blocos estruturais
        └── data/            # Fontes únicas de verdade (dados)
            ├── projects.js
            ├── servicos.js
            ├── presenca.js
            ├── contato.js
            └── disponibilidade.js
```

---

_© JMATTOS.DEV — Julio Mattos_
