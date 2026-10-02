# DEPLOY — jmattosdev.tech (VPS + Docker + Docker Compose)

Guia passo a passo para publicar e atualizar o **JMATTOS.DEV** na VPS, executando a aplicação como um **container Docker** orquestrado pelo **Docker Compose**.

Este documento descreve o fluxo **manual e seguro (Nível 1 de DevOps)**: desenvolvimento local → `git push` → `git pull` na VPS → rebuild do container. Não há deploy automático nem upload de ficheiros por FTP/SFTP.

**Arquitetura:**

```
Visitante → DNS (jmattosdev.tech → IP da VPS) → Proxy reverso (Nginx) → Container Docker → Node/Express (porta 3001) → dist/
```

**Fluxo de trabalho:**

```
Código local → validação no Docker (dev) → git push → VPS → git pull → docker compose up -d --build → container serve dist/ + POST /api/contato
```

> **Container único:** toda a aplicação (build do Vite + [`server.js`](server.js) com Express) roda num só container definido no [`docker-compose.yml`](docker-compose.yml:1). O proxy reverso de borda (Nginx) apenas encaminha o tráfego do domínio para a porta `3001`, onde o container escuta.

> **API de contato:** além de servir o `dist/`, o [`server.js`](server.js) expõe `POST /api/contato` (formulário da seção Contato). A rota valida os dados e **envia o e-mail real** via SMTP (Nodemailer + Gmail App Password). As credenciais são variáveis de ambiente (`SMTP_USER`, `SMTP_PASS`, `SMTP_TO`) injetadas no container pelo `env_file: .env` (ver seção 3).

---

## 1. Pré-requisitos

Antes de começar, confirme que tem:

- **VPS (Linux/Ubuntu)** com acesso **SSH**.
- **Docker Engine** e **Docker Compose v2** instalados e a funcionar (`docker --version` e `docker compose version`).
- **Usuário do site** na VPS: `jmattosdev` (dono do diretório do projeto e dos ficheiros). O deploy é executado em seu nome.
- **Domínio próprio** (`jmattosdev.tech`) com **registro A no DNS apontando para o IP da VPS**.
- **Proxy reverso (Nginx)** configurado para encaminhar o domínio para `127.0.0.1:3001` (a porta do container), com TLS/HTTPS ativo.
- **Projeto versionado no GitHub** (branch `main`) — o repositório é a **fonte de verdade** do código.
- **Docker e Docker Compose v2** também na máquina local (para o desenvolvimento e testes).

---

## 2. Estrutura na VPS

O projeto fica no diretório:

```
/home/jmattosdev/htdocs/jmattosdev.tech/
├── docker-compose.yml      # Orquestração de produção (build + container)
├── Dockerfile              # Build multi-stage da imagem
├── .env                    # Credenciais reais (NÃO versionado; permissão 600)
├── server.js               # Express: serve dist/ + POST /api/contato
├── package.json
├── src/ · public/ · index.html · vite.config.js
└── (imagem e container ficam sob gestão do Docker)
```

- O **código** é mantido via `git` (ver seção 4).
- O **`.env`** vive apenas na VPS (nunca no Git), com permissões restritas.
- A **imagem** é construída localmente na VPS pelo `docker compose up -d --build` (não depende de um registry externo).

---

## 3. Configuração do `.env` em produção

As credenciais **nunca** ficam no código nem no Git. O container recebe-as via `env_file: .env`.

### 3.1. Criar o `.env` a partir do modelo

No diretório do projeto na VPS:

```bash
cp .env.example .env
chmod 600 .env          # restringe a leitura ao dono
```

Preencha as variáveis:

| Variável    | Descrição                                                                 |
| ----------- | ------------------------------------------------------------------------- |
| `NODE_ENV`  | `production`.                                                             |
| `PORT`      | `3001` (porta que o container expõe e o proxy encaminha).                 |
| `SMTP_USER` | Conta Gmail remetente (ex.: `jmattosinfo@gmail.com`).                      |
| `SMTP_PASS` | **App Password** do Gmail (ver 3.2 — não é a senha normal da conta).       |
| `SMTP_TO`   | Destinatário das mensagens (opcional — se ausente, usa o próprio `SMTP_USER`). |
| `IMAGE_TAG` | Tag da imagem (reservado para uso futuro/CI; o Compose atual faz `build`). |

### 3.2. Criar a App Password no Google

O Gmail **não aceita a senha normal** da conta para envio por SMTP. É preciso uma **senha de aplicativo (App Password)**, que exige a **verificação em 2 etapas (2FA)** ativada:

1. Ative a verificação em 2 etapas: `myaccount.google.com` → **Segurança** → **Verificação em 2 etapas**.
2. Gere a senha de app: `myaccount.google.com` → **Segurança** → **Senhas de app** (ou direto em `https://myaccount.google.com/apppasswords`).
3. Crie uma senha de app (ex.: nome `jmattosdev`) e copie o código gerado (16 caracteres) — é esse valor que vai em `SMTP_PASS`.

---

## 4. Fluxo de deploy manual (Nível 1)

### a) Desenvolvimento e testes local

Trabalhe e valide tudo localmente, com Docker:

```bash
# Ambiente de desenvolvimento com hot-reload
docker compose -f docker-compose.dev.yml up -d
# Frontend: http://localhost:5173/   Backend: http://localhost:3001/

# (Opcional) Testar a imagem de produção localmente
docker compose up -d --build
# Aplicação: http://localhost:3001/   Health check: http://localhost:3001/status → OK
docker compose down
```

### b) Commit e envio para o GitHub

```bash
git add .
git commit -m "descrição da mudança"
git push
```

### c) Acesso à VPS via SSH

```bash
ssh jmattosdev@187.127.39.48
```

### d) Atualização do código (em nome do usuário do site)

```bash
cd /home/jmattosdev/htdocs/jmattosdev.tech
sudo -u jmattosdev git pull
```

> O `git pull` deve ser executado como o dono do diretório (`jmattosdev`) para evitar conflitos de permissão nos ficheiros.

### e) Reconstrução e arranque do container

```bash
docker compose up -d --build
```

O `--build` reconstrói a imagem com o código atualizado do `git pull`. A flag `-d` sobe o container em segundo plano; se já existir, o Compose recria-o com a nova imagem.

---

## 5. Verificação e health check

Após o arranque, confirme que o container está saudável:

```bash
# 1. Estado dos containers
docker compose ps

# 2. Health check do Express (dentro do container/servidor)
curl -I http://127.0.0.1:3001/status        # Esperado: 200 OK

# 3. Teste pelo domínio
curl -I https://jmattosdev.tech             # Esperado: 200 OK

# 4. Logs em tempo real (opcional)
docker compose logs -f --tail=200
```

---

## 6. Atualizações futuras

O fluxo é sempre o mesmo (seção 4). Para atualizar o site depois de uma alteração:

1. Desenvolva e teste localmente (`docker compose -f docker-compose.dev.yml up -d`).
2. `git add . && git commit -m "..." && git push`.
3. Na VPS: `cd /home/jmattosdev/htdocs/jmattosdev.tech && sudo -u jmattosdev git pull`.
4. `docker compose up -d --build`.
5. Valide com `docker compose ps` e `https://jmattosdev.tech`.

> Alterações apenas no **conteúdo/frontend** também exigem o rebuild (`--build`), porque o build do Vite acontece dentro da imagem (estágio *builder* do [`Dockerfile`](Dockerfile:1)).

---

## 7. Operação do container (runbook)

| Ação                         | Comando                                            |
| ---------------------------- | -------------------------------------------------- |
| Subir/reconstruir            | `docker compose up -d --build`                     |
| Subir sem reconstruir        | `docker compose up -d`                             |
| Ver estado                   | `docker compose ps`                                |
| Ver logs (tempo real)        | `docker compose logs -f --tail=200`                |
| Reiniciar                    | `docker compose restart`                           |
| Parar e remover o container  | `docker compose down`                              |
| Listar imagens               | `docker images`                                    |
| Limpar imagens antigas       | `docker image prune`                               |

> O `restart: always` do [`docker-compose.yml`](docker-compose.yml:1) garante que o container volta a subir automaticamente após um reboot da VPS ou uma falha do processo.

---

## 8. Solução de problemas (troubleshooting)

| Sintoma | Verificação |
| --- | --- |
| Site fora do ar | `docker compose ps` — confirme que o container está `Up`. Se não estiver, `docker compose up -d --build`. |
| **`502 Bad Gateway`** | O proxy não alcança a porta `3001`. Verifique: (1) o container está ativo (`docker compose ps`); (2) `curl -I http://127.0.0.1:3001/status` responde `200 OK`; (3) o proxy encaminha para `127.0.0.1:3001`; (4) a porta `3001` do host não está ocupada por outro processo. |
| Porta `3001` ocupada (`EADDRINUSE`) | Existe outro processo a usar a porta. Identifique-o (`sudo ss -ltnp \| grep 3001`) e pare-o antes de subir o container. |
| Container a reiniciar em loop | Veja `docker compose logs --tail=200`. Causas comuns: `.env` inválido/ausente ou variáveis SMTP em falta. |
| Alterações não aparecem no site | Confirme que fez `git pull` na VPS e executou `docker compose up -d --build` (o rebuild é obrigatório). Force o refresh no navegador (`Ctrl+Shift+R`). |
| E-mail do formulário não chega | Confirme `SMTP_USER`/`SMTP_PASS`/`SMTP_TO` no `.env` (App Password válida) e reinicie: `docker compose up -d --force-recreate`. Veja os logs: `docker compose logs -f`. |
| Erro de permissão no `git pull` | Execute como o dono do diretório: `sudo -u jmattosdev git pull`. |
| Build falha | Veja a saída completa do `docker compose up -d --build`. Atente ao primeiro `ERROR` no estágio *builder* (Vite) ou *runtime* (Express). |
| Ver logs do Express | `docker compose logs -f --tail=200` (o Express escreve em `stdout`/`stderr`). |

**Comando de diagnóstico rápido (roda tudo em sequência):**

```bash
docker compose ps && curl -I http://127.0.0.1:3001/status && docker compose logs --tail=50
```

---

## Resumo do fluxo de deploy

1. Desenvolver e testar localmente com Docker (`docker compose -f docker-compose.dev.yml up -d`).
2. Publicar no GitHub: `git add . && git commit -m "..." && git push`.
3. Aceder à VPS por SSH e entrar em `/home/jmattosdev/htdocs/jmattosdev.tech`.
4. Atualizar o código: `sudo -u jmattosdev git pull`.
5. Reconstruir e arrancar: `docker compose up -d --build`.
6. Validar: `docker compose ps` e `https://jmattosdev.tech` (health check: `GET /status` → `OK`).

---

© JMATTOS.DEV — Julio Mattos
