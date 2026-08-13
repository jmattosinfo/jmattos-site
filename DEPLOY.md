# DEPLOY — jmattosdev.tech (CloudPanel + SFTP + deploy automático)

Guia passo a passo para publicar o JMATTOS.DEV (landing page **estática**) no domínio usando o **CloudPanel** da VPS e a **extensão SFTP do VSCode**.

**Arquitetura:**

```
Usuário → DNS (jmattosdev.tech → IP da VPS) → CloudPanel (Nginx) → /home/<site>/htdocs/jmattosdev.tech/
```

**Fluxo de trabalho:**

```
Código local (src/) → npm run build -- --watch → dist/ → SFTP (upload automático ao salvar) → VPS (web root do site no CloudPanel) → Nginx serve a versão mais recente
```

> **Hot-reload no servidor:** o projeto usa Vite. Rodando `npm run build -- --watch` + `uploadOnSave`/watcher do SFTP, **cada alteração salva no código local é enviada automaticamente para o web root do site no CloudPanel** e o Nginx passa a servir a nova versão imediatamente — sem reiniciar nada (basta atualizar a página no navegador com F5).

---

## 1. Pré-requisitos

Antes de começar, confirme que você tem:

- **VPS (Ubuntu/Debian)** com **CloudPanel** instalado e funcionando. A VPS atual usa **CloudPanel v6** (acesso via CLI `clpctl`).
- **Acesso ao painel do CloudPanel** — a UI fica em `https://IP-DA-VPS:8443` (ex.: `https://187.127.39.48:8443`).
- **Extensão SFTP instalada no VSCode** — *SFTP* de **Natizyskunk** (ID: `Natizyskunk.sftp`). É ela que gerencia o upload automático.
- **Acesso SFTP/SSH à VPS** com o usuário **`deploy`** (host: `187.127.39.48`), autenticando por **chave SSH** (recomendado) ou senha.
- **Domínio próprio** já registrado (ex.: `jmattosdev.tech`) e com **registro A no DNS apontando para o IP da VPS** (sem proxy — ver seção 6).
- **Projeto versionado no GitHub** (branch `main`) — o repositório é a fonte de verdade do código; o deploy apenas publica o build.
- **Node.js + npm** instalados localmente (para gerar o build com `npm run build`).

---

## 2. Entendendo a estrutura de sites do CloudPanel

O CloudPanel **gerencia os vhosts do Nginx automaticamente**. Você **não edita** `/etc/nginx/` na mão — tudo é feito pelo painel (ou via `sudo clpctl`).

Para **cada site**, o CloudPanel cria um **usuário de sistema dedicado** com a seguinte estrutura (exemplo do site existente `acolher.life`):

```
/home/<usuario-do-site>/
├── htdocs/
│   └── <dominio>/      # ← WEB ROOT (pasta que o Nginx serve)
├── logs/
│   └── nginx/          # logs de acesso/erro do site
├── backups/
└── tmp/
```

- **Web root padrão:** `/home/<usuario>/htdocs/<dominio>/` — é **aqui** que o conteúdo do site deve ficar.
- **Usuário do site:** criado pelo painel ao registrar o site (ex.: `acolher` → `/home/acolher`).
- **Logs do site:** em `/home/<usuario>/logs/nginx/` (muito útil para troubleshooting).

> ⚠️ **Importante:** o site **não pode** ser publicado numa pasta fora da estrutura do CloudPanel (ex.: `/home/deploy/jmattosdev.tech`). O Nginx do CloudPanel só serve o **web root do site** (`/home/<site>/htdocs/<dominio>/`).

---

## 3. Configuração do SFTP no VSCode

### 3.1. Criar o arquivo `sftp.json`

Com o projeto aberto no VSCode, abra a paleta de comandos (`Ctrl+Shift+P`) e execute **`SFTP: Config`**. Isso cria o arquivo [`.vscode/sftp.json`](.vscode/sftp.json) na raiz do projeto.

### 3.2. Conteúdo recomendado

> **Antes de definir o `remotePath`:** crie o site no CloudPanel (seção 4) e anote o caminho do web root que aparece no painel. Será algo como `/home/jmattosdev.tech/htdocs/jmattosdev.tech/` (o nome exato do usuário/pasta depende de como o site foi registrado).

```json
{
    "name": "jmattosdev-cloudpanel",
    "host": "187.127.39.48",
    "protocol": "sftp",
    "port": 22,
    "username": "deploy",
    "privateKeyPath": "/home/jmattos/.ssh/id_ed25519",
    "remotePath": "/home/jmattosdev.tech/htdocs/jmattosdev.tech",
    "context": "dist",
    "uploadOnSave": true,
    "ignore": [
        "**/.git/**",
        "**/.vscode/**",
        "**/node_modules/**",
        "**/*.map"
    ],
    "watcher": {
        "files": "**/*",
        "autoUpload": true,
        "autoDelete": true
    }
}
```

**Explicação dos campos principais:**

| Campo | Valor | O que faz |
| --- | --- | --- |
| `host` | `187.127.39.48` | IP da VPS (ou hostname). |
| `username` | `deploy` | Usuário de acesso à VPS. |
| `privateKeyPath` | `/home/jmattos/.ssh/id_ed25519` | Caminho da chave privada SSH. **Alternativa:** use `"password": "SUA_SENHA"` (menos seguro). |
| `remotePath` | `/home/<site>/htdocs/<dominio>` | **Web root do site no CloudPanel** — o destino do upload. |
| `context` | `dist` | Pasta **local** cujo conteúdo será enviado. Como o site é servido a partir do build, o SFTP envia o conteúdo de `dist/` direto para o web root. |
| `uploadOnSave` | `true` | Envia o arquivo para a VPS **toda vez que ele for salvo** (essencial para o hot-reload). |
| `ignore` | `...` | Exclui pastas/arquivos desnecessários do upload (git, node_modules, maps). |
| `watcher` | `autoUpload` | Observa a pasta `dist/` e faz **upload automático** quando o build regenera os arquivos. |

### 3.3. Primeiro upload (envio inicial)

Após configurar o arquivo, faça o upload inicial de todo o `dist/`:

1. `Ctrl+Shift+P` → **`SFTP: Sync Local -> Remote`** (ou `SFTP: Upload Folder`).
2. Aguarde a barra de progresso no canto inferior direito.
3. Confirme no servidor:
   ```bash
   ssh deploy@187.127.39.48
   ls -la /home/<site>/htdocs/<dominio>   # deve listar index.html e a pasta assets/
   ```

---

## 4. Criar o site no CloudPanel (web root)

O site `jmattosdev.tech` **precisa existir no CloudPanel** antes do upload. Faça pelo painel:

1. Acesse **`https://187.127.39.48:8443`** no navegador (aceite o aviso de certificado auto-assinado na primeira vez).
2. Faça login com o usuário/senha **administrador do CloudPanel**.
3. Vá em **Websites → Add Website** (Adicionar site).
4. Informe o **domínio principal**: `jmattosdev.tech`.
5. Adicione o domínio adicional **`www.jmattosdev.tech`** (alias), se desejar.
6. Em **Runtime**, escolha **Static** (site estático — não precisa de PHP/Node).
7. Confirme. O CloudPanel vai criar:
   - O **usuário do site** (ex.: `jmattosdev.tech` ou nome similar).
   - O **web root** em `/home/<usuario>/htdocs/jmattosdev.tech/`.
   - O **vhost do Nginx** automaticamente (não precisa mexer em `/etc/nginx`).

> **Anote o web root exato** que aparece no painel (seção do site → "Document Root") — é esse caminho que vai no `remotePath` do [`sftp.json`](.vscode/sftp.json:8).

### Alternativa via CLI (requer `sudo`)

Na VPS, o CloudPanel pode criar o site pela linha de comando:

```bash
sudo clpctl site:add --domainName=jmattosdev.tech --siteUser=jmattosdev.tech --siteUserPassword='SENHA'
```

> Consulte `sudo clpctl` para os comandos e parâmetros exatos da sua versão (CloudPanel 6).

---

## 5. Publicação no domínio — DNS

### 5.1. Apontar o DNS para a VPS (sem proxy)

O domínio precisa resolver **direto** para o IP da VPS. No painel do seu provedor de domínio (Hostinger), ajuste os registros **desativando o proxy** (o toggle/globo azul dos registros DNS):

| Tipo | Nome/Host | Valor | Proxy |
| --- | --- | --- | --- |
| A | `@` (ou `jmattosdev.tech`) | **187.127.39.48** | **OFF** |
| A | `www` | **187.127.39.48** | **OFF** |

> Se houver um CNAME de `www` com proxy, remova-o e use um registro **A** direto, **sem proxy**. O proxy da Hostinger (`2.57.91.91`) **intercepta o desafio ACME do Let's Encrypt** e faz o Certbot falhar com erro `500`.

### 5.2. Validar o DNS

Confirme que o domínio resolve para a VPS:

```bash
dig jmattosdev.tech +short
dig www.jmattosdev.tech +short
# Esperado: 187.127.39.48 (o IP da VPS)
```

> A propagação pode levar de minutos a algumas horas.

### 5.3. Testar localmente na VPS (antes do navegador)

```bash
# Dentro da VPS: deve retornar o HTML do seu site
curl -I http://localhost
# Esperado: HTTP/1.1 200 OK
```

---

## 6. Emitir o certificado SSL (HTTPS) no CloudPanel

O CloudPanel tem o **Let's Encrypt integrado** — não use o `certbot` manual. Pelo painel:

1. Acesse o site `jmattosdev.tech` em **Websites**.
2. Vá na aba **SSL/TLS**.
3. Clique em **Add / Issue Let's Encrypt Certificate**.
4. Marque `jmattosdev.tech` e `www.jmattosdev.tech`.
5. Confirme e aguarde a emissão (requer o DNS já apontando para a VPS — seção 5).

O CloudPanel configura o vhost com HTTPS e o redirect HTTP → HTTPS automaticamente.

> **Se o Let's Encrypt falhar com `unauthorized ... 500`**, a causa é o DNS ainda apontando para o proxy da Hostinger (`2.57.91.91`). Corrija os registros A (proxy OFF) e aguarde a propagação antes de tentar de novo.

---

## 7. Atualizações futuras (deploy automático / hot-reload)

### 7.1. Deploy automático ao salvar (recomendado)

O objetivo é que **cada alteração local** já vá para o servidor sem esforço manual:

1. **Deixe o build em modo watch rodando** em um terminal (gera o `dist/` atualizado a cada salvamento no `src/`):
   ```bash
   npm run build -- --watch
   ```
2. **Salve o código no VSCode** — o Vite recompila o `dist/` e a extensão SFTP (via `watcher` + `uploadOnSave`) **envia os arquivos alterados para o web root do site automaticamente**.
3. **Recarregue a página** no navegador (F5) para ver a mudança publicada.

> Como o Nginx do CloudPanel serve o web root diretamente, **não é preciso reiniciar nem recarregar o Nginx** em atualizações de conteúdo (HTML/CSS/JS). Basta o upload ter sido feito.

### 7.2. Atualização manual com a extensão SFTP

Se preferir um controle manual:

1. Altere o código e publique no GitHub como de costume:
   ```bash
   git add . && git commit -m "descrição da mudança" && git push
   ```
2. Gere o build:
   ```bash
   npm run build
   ```
3. `Ctrl+Shift+P` → **`SFTP: Sync Local -> Remote`** para enviar o novo `dist/` ao web root.
4. Pronto — o site já está atualizado.

### 7.3. Alternativa: `git pull` no servidor

Se preferir versionar o deploy pelo servidor (requer Node.js/npm na VPS):

```bash
cd /home/<site>/htdocs/<dominio>
git pull
npm ci && npm run build
# Copie o build para o web root raiz se o site não for servido de subpasta
```

> **Atenção:** para um site estático, o web root deve conter `index.html` + `assets/` na **raiz** (`/home/<site>/htdocs/<dominio>/`), não dentro de uma subpasta `dist`.

> **Dica:** o fluxo 7.1 (SFTP + build em watch) é o que entrega o "hot-reload" contínuo, sem depender de Node.js na VPS.

---

## 8. Solução de problemas (troubleshooting)

Verificações rápidas na ordem:

| Sintoma | Verificação |
| --- | --- |
| Site fora do ar | `systemctl status nginx` na VPS — confira se o serviço está `active (running)`. |
| Site responde "Empty reply" | O site provavelmente **não foi criado no CloudPanel** ou os arquivos estão fora do web root. Confirme se o site existe em `Websites` e se o `remotePath` do SFTP é o web root (`/home/<site>/htdocs/<dominio>/`). |
| `403 Forbidden` | Permissões: rode `sudo clpctl system:permissions:reset --directories=770 --files=660 --path=/home/<site>/htdocs/<dominio>` (ou `chown`/`chmod` para o usuário do site). |
| Página antiga / mudança não aparece | Confirme que o upload foi feito (`ls -la /home/<site>/htdocs/<dominio>`) e force o refresh (`Ctrl+Shift+R`). |
| Domínio não abre, mas IP abre | DNS não apontou ainda: `dig jmattosdev.tech +short` — se resolver para `2.57.91.91` (proxy Hostinger), corrija os registros A (proxy OFF). |
| Upload SFTP não acontece | Confira o [`.vscode/sftp.json`](.vscode/sftp.json:1): host, username, `privateKeyPath`/`password`, `remotePath` (web root) e se `uploadOnSave`/`watcher` estão ativos. |
| Certbot/Let's Encrypt falha `unauthorized` | DNS apontando para o proxy (`2.57.91.91`). Desative o proxy nos registros A e aguarde a propagação. |
| Nginx não responde na VPS | `curl -I http://localhost` — se retornar o HTML do site, o problema é DNS/firewall; se não, revise o site no CloudPanel e os logs em `/home/<site>/logs/nginx/`. |
| Portas 80/443 bloqueadas | No Ubuntu, confira o firewall: `sudo ufw status` → `Nginx Full` deve estar `ALLOW`. |
| Ver logs do site | `tail -f /home/<site>/logs/nginx/error.log` (e `access.log`). |

**Comando de diagnóstico rápido (roda tudo em sequência):**

```bash
systemctl status nginx && curl -I http://localhost && ls -la /home/<site>/htdocs/<dominio> && dig jmattosdev.tech +short
```

---

## Resumo do fluxo de deploy

1. Criar o site `jmattosdev.tech` no **CloudPanel** (Websites → Add Website, Runtime: **Static**).
2. Anotar o **web root** do site (ex.: `/home/jmattosdev.tech/htdocs/jmattosdev.tech/`).
3. Ajustar o `remotePath` do [`sftp.json`](.vscode/sftp.json:8) para o web root.
4. Apontar o **DNS** (registro A `@` e `www` → IP da VPS, **proxy OFF**).
5. Rodar `npm run build` e fazer o **upload inicial** (`SFTP: Sync Local -> Remote`).
6. Emitir o **SSL** pelo CloudPanel (Let's Encrypt).
7. Acessar `https://jmattosdev.tech` no navegador.
8. Para atualizar: `npm run build -- --watch` + salvar (upload automático) → F5 no navegador.

---

© JMATTOS.DEV — Julio Mattos
